import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import _ from 'lodash';
import Highlighter from 'react-highlight-words';
import { Button, Icon, Input, Popconfirm, Radio, Table, Dropdown, Menu, Row, Col, Tag, Tooltip } from 'antd';
import { Sort, FormatCurrency, IsOperationPositive, DisplayTableAmount } from '../../common/utils';
import classNames from "classnames";
import BulkUpdateSteps from "./BulkUpdateSteps";


class UserAccountsTable extends Component {
  state = {
    userAccounts: [],
    searchText: '',
    searchedColumn: '',
    isMenuFold: true,
    currentDataSource: [],
    selectedRowKeys: [],
    selectedBulkUpdateType: 'report',
    bulkUpdateValue: null,
    isBulkUpdateActive: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEqual( nextProps.userAccounts, prevState.userAccounts )) {
      return {
        userAccounts: nextProps.userAccounts
      }
    }
    return null;
  }

  onSelectAllOperation = (isSelected) => {
    const { currentDataSource, userAccounts } = this.state;
    const dataSource = !_.isEmpty( currentDataSource ) ? currentDataSource : userAccounts;
    const allOperationsIds = isSelected ? dataSource.map( ope => ope.id ) : []
    this.setState( { selectedRowKeys: allOperationsIds } )
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
            <Button type="danger"><Icon type="undo"/><span>Activar</span></Button>
          </Popconfirm>
        </div>
      )
    } else {
      return (
        <div className="cta-container">
          { this.props.isOperationStandard ? (
            <Dropdown overlay={ (
              <Menu onClick={ ({ key }) => this._handleExportHistory( {
                id: row.id,
                status: key
              } ) }>
                <Menu.Item key={ null }>Todas las Operaciones</Menu.Item>
                <Menu.Item key={ 4 }>Operaciones Vendidas</Menu.Item>
              </Menu>
            ) }>
              <Button
                type="primary"
                data-testid="export-button"
                className="export-excel-cta"
                style={ { float: 'right' } }
              >
                <Icon type="file-excel"/> <span>Reporte Histórico</span>
              </Button>
            </Dropdown>
          ) : null }

          <Button type="secondary" onClick={ () => this.props.onEdit( row.id ) }><Icon type="edit"/><span>Editar</span></Button>
          <Popconfirm
            okText="Si"
            title="Está seguro ?"
            cancelText="Cancelar"
            onConfirm={ () => this.props.onDelete( row.id ) }
          >
            <Button type="danger"><Icon type="delete"/><span>Eliminar</span></Button>
          </Popconfirm>
        </div>
      )
    }

  };

  _displayTableAmount = amount => {
    if (amount) {
      return `${ FormatCurrency.format( amount ) }`
    } else {
      return '-'
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
      <Icon type="filter" theme="filled" style={ { color: filtered ? '#1890ff' : undefined } }/>
    ),
    onFilter: (value, record) => {
      if (_.get( record, dataIndex )) {
        return _.get( record, dataIndex )
          .toString()
          .toLowerCase()
          .includes( value.toLowerCase() )
      }

    },
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout( () => this.searchInput.select() );
      }
    },
    render: text => {
      const displayText = dataIndex === 'guaranteeOperation' ? this._displayTableAmount(text) : text;
      return this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={ { backgroundColor: '#ffc069', padding: 0 } }
          searchWords={ [ this.state.searchText ] }
          autoEscape
          textToHighlight={ displayText.toString() }
        />
      ) : (
        displayText
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

  onTableChange = (pagination, filters, sorter, extra) => {
    const { currentDataSource } = extra;
    this.setState( {
      currentDataSource,
      filteredInfo: filters,
      sortedInfo: sorter,
    } )
    this.props.onRequestUpdateTable();
  }

  _handleExportHistory = (accountSelected) => {
    this.props.onReqeuestExportHistoryReport( accountSelected )
  }

  onSelectOperation = (selectedRowKeys) => {
    this.setState( { selectedRowKeys } )
  }

  _onSelectBulkReport = () => {
    const exportData = _.isEmpty(this.state.currentDataSource) ? this.state.userAccounts : this.state.currentDataSource;
    const selectedAccounts = _.filter(exportData, account => _.includes(this.state.selectedRowKeys, account.id))

    this.props.onReqeuestExportAccountReport( selectedAccounts );
  }

  _handleClickBulkUpdate = bulkOperation => {
    if (bulkOperation.updateType === 'report') {
      this._onSelectBulkReport()
    } else {
      this.props.onFetchBulkUpdate( {
        ...bulkOperation,
        operationsIds: this.state.selectedRowKeys
      } )
    }

  }
  onCancelBulkProcess = () => {
    this.setState( {
      isBulkUpdateActive: false,
      selectedRowKeys: [],
      selectedBulkUpdateType: 'report',
      bulkUpdateValue: null,
    } )
    this.props.onRequestUpdateTable()
  }

  _displayTableHeader = () => (
    <>
    <Row>
      <Col sm={ 12 }>
        <Radio.Group defaultValue={ 1 } buttonStyle="solid" onChange={ this.props.onTabChange }>
          <Radio.Button value={ 1 }>Activos</Radio.Button>
          <Radio.Button value={ 0 }>Eliminados</Radio.Button>
        </Radio.Group>
      </Col>
      <Col sm={12} style={ { textAlign: 'right' } }>
        <Button type="secondary" className={classNames({'hidden': this.state.isBulkUpdateActive})}
                onClick={ () => this.setState( { isBulkUpdateActive: true } ) } size="large">
          <Icon type="retweet"/> Actualización Masiva
        </Button>
        <Button type="danger" className={classNames({'hidden': !this.state.isBulkUpdateActive})}
                onClick={ this.onCancelBulkProcess } >
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
  );

  _onSelectMenuFold = () => {
    this.setState( {
      isMenuFold: !this.state.isMenuFold
    } )
  }

  _handleActionTitle = () => {
    return (
      <Row>
        <Col xs={12} style={ { textAlign: 'left' } }>
          <Tooltip placement="top" title="Sincronizar Datos">
            <Button type="primary" onClick={ () => this.props.onRequestUpdateTable() }><Icon type="history" /></Button>
          </Tooltip>
        </Col>
        <Col xs={12} style={ { textAlign: 'right' } }>
          <Button onClick={ this._onSelectMenuFold }><Icon type="swap"/></Button>
        </Col>
      </Row>
    )
  }

  _displayTableFooter = () => (
    <Row>
      <Col>
        <h3>Total de Cuentas: <Tag color="#1b1f21" style={{fontSize: 14, marginLeft: 10}}>{_.size(this.state.userAccounts)}</Tag></h3>
      </Col>
    </Row>
  )


  render() {
    const dynamicClass = this.props.isOperationStandard ? 'show' : 'hidden';

    const {
      selectedRowKeys,
      isBulkUpdateActive,
    } = this.state;

    const columns = [
      {
        title: 'Usuario',
        dataIndex: 'user.username',
        key: 'user.username',
        sorter: (a, b) => Sort( a.user.username, b.user.username ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'user.username' ),
      },
      {
        title: 'Nombre',
        dataIndex: 'user.firstName',
        key: 'user.firstName',
        render: text => <span key={ text }>{ text }</span>,
        sorter: (a, b) => Sort( a.user.firstName, b.user.firstName ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'user.firstName' ),
      },
      {
        title: 'Apellido',
        dataIndex: 'user.lastName',
        key: 'user.lastName',
        render: text => <span key={ text }>{ text }</span>,
        sorter: (a, b) => Sort( a.user.lastName, b.user.lastName ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'user.lastName' ),
      },
      {
        title: 'Tipo de Cuenta',
        dataIndex: 'account.name',
        key: 'account.name',
        sorter: (a, b) => Sort( a.account.name, b.account.name ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'account.name' ),
      },
      {
        title: 'Comisión',
        dataIndex: 'account',
        key: 'percentage',
        render: text => <span key={ text }>{ text.percentage }%</span>,
        sorter: (a, b) => Sort( a.account.percentage, b.account.percentage ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Valor de la Cuenta',
        key: 'accountValue',
        render: data => <span
          className={ IsOperationPositive( data.accountValue, data.balanceInitial ) ? 'positive txt-highlight' : 'negative txt-highlight' }
          key={ data.accountValue }>{ DisplayTableAmount( data.accountValue ) }</span>,
        sorter: (a, b) => Sort( a.accountValue, b.accountValue ),
        sortDirections: [ 'descend', 'ascend' ]
      },
      {
        title: 'Garantías disponibles',
        dataIndex: 'guaranteeOperation',
        key: 'guaranteeOperation',
        className: dynamicClass,
        render: amount => <span key={ amount }>{ this._displayTableAmount( amount ) }</span>,
        sorter: (a, b) => Sort( a.guaranteeOperation, b.guaranteeOperation ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'guaranteeOperation' ),
      },
      {
        title: 'Saldo Inicial',
        dataIndex: 'balanceInitial',
        key: 'balanceInitial',
        render: amount => <span key={ amount }>{ this._displayTableAmount( amount ) }</span>,
        sorter: (a, b) => Sort( a.balanceInitial, b.balanceInitial ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Saldo Final',
        dataIndex: 'balanceFinal',
        key: 'balanceFinal',
        render: amount => <span key={ amount }>{ this._displayTableAmount( amount ) }</span>,
        sorter: (a, b) => Sort( a.balanceFinal, b.balanceFinal ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Garantías / Créditos',
        dataIndex: 'guaranteeCredits',
        key: 'guaranteeCredits',
        render: amount => <span key={ amount }>{ this._displayTableAmount( amount ) }</span>,
        sorter: (a, b) => Sort( a.guaranteeCredits, b.guaranteeCredits ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'guaranteeCredits' ),
      },
      {
        title: 'Corredor',
        dataIndex: 'broker.name',
        key: 'broker.name',
        render: text => <span key={ text }>{ text }</span>,
        sorter: (a, b) => a.broker && b.broker ? Sort( a.broker.name, b.broker.name ) : null,
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'broker.name' ),
      },
      {
        title: this._handleActionTitle,
        key: 'actions',
        render: this._getCTA,
        fixed: 'right',
        className: 't-a-r fixed-table-actions-panel'
      },
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectOperation,
      onSelectAll: this.onSelectAllOperation
    };

    return (
      <Table
        rowSelection={ isBulkUpdateActive ? rowSelection : null }
        rowKey={ record => record.id }
        columns={ columns }
        dataSource={ this.state.userAccounts }
        loading={ this.props.isLoading }
        scroll={ { x: true } }
        title={ this._displayTableHeader }
        onChange={ this.onTableChange }
        className={ classNames( { 'is-menu-fold': this.state.isMenuFold } ) }
        footer={this._displayTableFooter}
      />
    );
  }
}


function mapStateToProps(state) {

  return {}
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {}, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( UserAccountsTable );