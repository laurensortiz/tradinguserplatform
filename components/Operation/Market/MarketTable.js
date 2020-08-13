import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import _ from 'lodash';
import classNames from 'classnames';
import Highlighter from "react-highlight-words";
import { Button, Icon, Input, Popconfirm, Table, Tag, Row, Col, Select, Radio } from 'antd';
import {
  Sort,
  FormatStatus,
  DisplayTableAmount,
  MarketBehaviorStatus, IsOperationPositive,
} from '../../../common/utils';

import BulkUpdateSteps from './BulkUpdateSteps';

const { Option } = Select;


class MarketTable extends Component {
  state = {
    marketOperations: [],
    searchText: '',
    searchedColumn: '',
    selectedRowKeys: [],
    currentDataSource: [],
    selectedBulkUpdateType: 'status',
    bulkUpdateValue: null,
    isBulkUpdateActive: true,
    isMenuFold: true
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {}
    if (!_.isEqual( nextProps.marketOperations, prevState.marketOperations )) {
      _.assignIn( updatedState, {
        marketOperations: nextProps.marketOperations
      } )
    }
    return !_.isEmpty( updatedState ) ? updatedState : null;
  }

  _getCTA = (type, row) => {
    if (_.isEqual( this.props.dataStatus, 0 )) {
      return (
        <div className="cta-container">
          <Popconfirm
            okText="Si"
            title="Está seguro que desea activarlo ?"
            cancelText="Cancelar"
            onConfirm={ () => this.props.onActive( row.id ) }
          >
            <Button type="danger"><Icon type="undo" /><span>Activar</span></Button>
          </Popconfirm>
        </div>
      )
    } else {
      return (
        <div className="cta-container">
          <Button type="secondary" onClick={ () => this.props.onDetail( row.id ) }><Icon type="hdd"/><span>Detalle</span></Button>
          { this.props.isAdmin ? (
            <>
              <Popconfirm
                okText="Si"
                title="Está seguro ?"
                cancelText="Cancelar"
                onConfirm={ () => this.props.onDelete( row.id ) }
              >
                <Button type="danger"><Icon type="delete"/><span>Eliminar</span></Button>
              </Popconfirm>
              <Button type="secondary" onClick={ () => this.props.onEdit( row.id ) }><Icon type="edit"/><span>Editar</span></Button>
            </>
          ) : null }
        </div>
      )
    }

  };

  getColumnSearchProps = dataIndex => ( {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={ { padding: 8 } }>
        <Input
          ref={ node => {
            this.searchInput = node;
          } }
          placeholder={ `Buscar` }
          value={ selectedKeys[ 0 ] }
          onChange={ e => setSelectedKeys( e.target.value ? [ e.target.value ] : [] ) }
          onPressEnter={ () => this.handleSearch( selectedKeys, confirm, dataIndex ) }
          style={ { width: 188, marginBottom: 8, display: 'block' } }
        />
        <Button
          type="primary"
          onClick={ () => this.handleSearch( selectedKeys, confirm, dataIndex ) }
          icon="search"
          size="small"
          style={ { width: 90, marginRight: 8 } }
        >
          Buscar
        </Button>
        <Button onClick={ () => this.handleReset( clearFilters ) } size="small" style={ { width: 90 } }>
          Limpiar
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={ { color: filtered ? '#1890ff' : undefined } }/>
    ),
    onFilter: (value, record) => {

      return _.get( record, dataIndex )
        .toString()
        .toLowerCase()
        .includes( value.toLowerCase() )
    },
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout( () => this.searchInput.select() );
      }
    },
    render: text => {
      return this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={ { backgroundColor: '#ffc069', padding: 0 } }
          searchWords={ [ this.state.searchText ] }
          autoEscape
          textToHighlight={ text.toString() }
        />
      ) : (
        text
      )
    }

  } );

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState( {
      searchText: selectedKeys[ 0 ],
      searchedColumn: dataIndex,
      selectedRowKeys: []
    } );
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState( {
      searchText: '',
      selectedRowKeys: []
    } );

  };

  onSelectOperation = (selectedRowKeys) => {
    this.setState( { selectedRowKeys } )
  }

  onSelectAllOperation = (isSelected) => {
    const { currentDataSource, marketOperations } = this.state;
    const dataSource = !_.isEmpty( currentDataSource ) ? currentDataSource : marketOperations;
    const allOperationsIds = isSelected ? dataSource.map( ope => ope.id ) : []
    this.setState( { selectedRowKeys: allOperationsIds } )
  }

  onTableChange = (pagination, filters, sorter, extra) => {
    const { currentDataSource } = extra;
    this.setState( { currentDataSource } )
    if (this.props.isAdmin) {
      this.props.onRequestUpdateTable()
    }

  }

  onCancelBulkProcess = () => {
    this.setState( {
      isBulkUpdateActive: false,
      selectedRowKeys: [],
      selectedBulkUpdateType: 'status',
      bulkUpdateValue: null,
    } )
    this.props.onRequestUpdateTable()
  }


  _handleClickBulkUpdate = bulkOperation => {

    this.props.onFetchBulkUpdate( {
      ...bulkOperation,
      operationsIds: this.state.selectedRowKeys
    } )

  }
  tableHeader = () => (
    <>
      <Row>
        <Col sm={12} style={ { textAlign: 'left' } }>
          <Radio.Group defaultValue={this.props.dataStatus} buttonStyle="solid" onChange={ this.props.onTabChange }>
            <Radio.Button value={1}>Activos</Radio.Button>
            <Radio.Button value={0}>Eliminados</Radio.Button>
          </Radio.Group>
        </Col>
        <Col sm={12} style={ { textAlign: 'right' } }>
          <Button type="secondary" className={classNames({'hidden': this.state.isBulkUpdateActive})}
                  onClick={ () => this.setState( { isBulkUpdateActive: true } ) } size="large">
            <Icon type="retweet"/> Actualización Masiva
          </Button>
          <Button type="danger" className={classNames({'hidden': !this.state.isBulkUpdateActive})}
                  onClick={ this.onCancelBulkProcess } size="large">
            <Icon type="close-circle"/> Cerrar
          </Button>
        </Col>
      </Row>
      {
        this.state.isBulkUpdateActive ? (
          <Row>
            <Col>
              <div className="multiple-actualization-module">
                <BulkUpdateSteps
                  selectedElements={ this.state.selectedRowKeys.length }
                  onClickUpdate={ this._handleClickBulkUpdate }
                  isProcessComplete={ this.props.isBulkCompleted }
                  isBulkLoading={ this.props.isBulkLoading }
                  isBulkSuccess={ this.props.isBulkSuccess }
                />
              </div>
            </Col>
          </Row>
        ) : null
      }
    </>
  )

  _onSelectMenuFold = () => {
    this.setState({
      isMenuFold: !this.state.isMenuFold
    })
  }

  _handleActionTitle = () => {
    return (
      <div style={{textAlign: 'right'}}>
        <Button onClick={this._onSelectMenuFold}><Icon type="swap" /></Button>
      </div>
    )
  }

  render() {

    const showHandleClass = this.props.isAdmin ? 'show' : 'hidden';
    const { selectedRowKeys, isBulkUpdateActive, marketOperations } = this.state;

    const columns = [
      {
        title: '',
        dataIndex: 'behavior',
        key: 'behavior',
        render: status => MarketBehaviorStatus( status )
      },
      {
        title: 'Estado',
        dataIndex: 'status',
        key: 'status',
        filters: [
          { text: 'Activo', value: 1 },
          { text: 'Market Close', value: 2 },
          { text: 'Hold', value: 3 },
          { text: 'Vendido', value: 4 },
        ],
        onFilter: (value, record) => record.status === value,
        filterMultiple: false,
        render: status => {
          const { name, color } = FormatStatus( status );
          return <Tag color={ color }>{ name }</Tag>
        },
        sorter: (a, b) => Sort( a.status, b.status ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Producto',
        dataIndex: 'product.name',
        key: 'product.name',
        render: text => <span key={ `${ text.code }-${ text.name }` }>{ `${ text.code }-${ text.name }` }</span>,
        sorter: (a, b) => Sort( a.product.name, b.product.name ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'product.name' ),
      },
      {
        title: 'Usuario',
        dataIndex: 'userAccount.user.username',
        key: 'userAccount.user.username',
        className: `${ showHandleClass } `,
        sorter: (a, b) => Sort( a.userAccount.user.username, b.userAccount.user.username ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'userAccount.user.username' ),
      },
      {
        title: 'Nombre',
        dataIndex: 'userAccount.user.firstName',
        key: 'userAccount.user.firstName',
        render: text => <span key={ text }>{ text }</span>,
        sorter: (a, b) => Sort( a.userAccount.user.firstName, b.userAccount.user.firstName ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'userAccount.user.firstName' ),
      },
      {
        title: 'Apellido',
        dataIndex: 'userAccount.user.lastName',
        key: 'userAccount.user.lastName',
        render: text => <span key={ text }>{ text }</span>,
        sorter: (a, b) => Sort( a.userAccount.user.lastName, b.userAccount.user.lastName ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'userAccount.user.lastName' ),
      },
      {
        title: 'Saldo Actual',
        key: 'amount',
        render: data => <span
          className={ IsOperationPositive( data.amount, data.initialAmount ) ? 'positive txt-highlight' : 'negative txt-highlight' }
          key={ data.amount }>{ DisplayTableAmount( data.amount ) }</span>,
        sorter: (a, b) => Sort( a.amount, b.amount ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Inversión',
        dataIndex: 'initialAmount',
        key: 'initialAmount',
        render: initialAmount => <span key={ initialAmount }>{ DisplayTableAmount( initialAmount ) }</span>,
        sorter: (a, b) => Sort( a.initialAmount, b.initialAmount ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Margen de Mantenimiento',
        dataIndex: 'maintenanceMargin',
        key: 'maintenanceMargin',
        render: maintenanceMargin => <span key={ maintenanceMargin }>{ DisplayTableAmount( maintenanceMargin ) }</span>,
        sorter: (a, b) => Sort( a.maintenanceMargin, b.maintenanceMargin ),
        sortDirections: [ 'descend', 'ascend' ],
      },

      {
        title: 'Corredor',
        dataIndex: 'broker.name',
        key: 'broker.name',
        sorter: (a, b) => Sort( a.broker.name, b.broker.name ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'broker.name' ),
      },
      {
        title: this._handleActionTitle,
        key: 'actions',
        render: this._getCTA,
        fixed: 'right',
        className: 't-a-r'
      },
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectOperation,
      onSelectAll: this.onSelectAllOperation
    };

    return (
      <>

        <Table
          rowSelection={ isBulkUpdateActive ? rowSelection : null }
          rowKey={ record => record.id }
          columns={ columns }
          dataSource={ marketOperations }
          loading={ this.props.isLoading }
          scroll={ { x: true } }
          className={ classNames( { 'hidden-table': !this.props.isAdmin && _.isEmpty( this.state.marketOperations ), 'is-menu-fold': this.state.isMenuFold } ) }
          onChange={ this.onTableChange }
          title={ this.props.isAdmin ? this.tableHeader : null }
        />
      </>
    );
  }
}


function mapStateToProps(state) {

  return {}
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {}, dispatch );

export default connect( mapStateToProps, mapDispatchToProps )( MarketTable );
