import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import classNames from 'classnames';

import { Button, Icon, Input, Popconfirm, Table, Tag } from 'antd';
import {
  Sort,
  FormatCurrency,
  FormatStatus,
  FormatDate,
  SortDate,
  DisplayTableAmount,
  MarketBehaviorStatus, IsOperationPositive,
} from '../../../common/utils';
import Highlighter from "react-highlight-words";

class MarketTable extends Component {
  state = {
    marketOperations: [],
    searchText: '',
    searchedColumn: '',
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEqual( nextProps.marketOperations, prevState.marketOperations )) {

      return {
        marketOperations: nextProps.marketOperations
      }
    }
    return null;
  }

  _getCTA = (type, row) => {
    if (_.isEqual( this.props.status, 'inactive' )) {
      return (
        <div className="cta-container">
          <Popconfirm
            okText="Si"
            title="Está seguro que desea activarlo ?"
            cancelText="Cancelar"
            onConfirm={ () => this.props.onActive( row.id ) }
          >
            <Button type="danger">Activar</Button>
          </Popconfirm>
        </div>
      )
    } else {
      return (
        <div className="cta-container">
          <Button type="secondary" onClick={ () => this.props.onDetail( row.id ) }><Icon type="hdd" />Detalle</Button>
          {this.props.isAdmin ? (
            <>
              <Popconfirm
                okText="Si"
                title="Está seguro ?"
                cancelText="Cancelar"
                onConfirm={ () => this.props.onDelete( row.id ) }
              >
                <Button type="danger"><Icon type="delete"/></Button>
              </Popconfirm>
              <Button type="secondary" onClick={ () => this.props.onEdit( row.id ) }><Icon type="edit"/></Button>
            </>
          ) : null}
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

      return _.get(record, dataIndex)
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
    } );
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState( { searchText: '' } );
  };


  render() {

    const showHandleClass = this.props.isAdmin ? 'show' : 'hidden';

    const columns = [
      {
        title: '',
        dataIndex: 'behavior',
        key: 'behavior',
        render: status => MarketBehaviorStatus(status)
      },
      {
        title: 'Estado',
        dataIndex: 'status',
        key: 'status',
        render: status => {
          const {name, color} = FormatStatus(status);
          return <Tag color={color} >{ name }</Tag>
        },
        sorter: (a, b) => Sort( a.status, b.status ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Producto',
        dataIndex: 'product.name',
        key: 'product.name',
        render: text => <span key={`${text.code}-${text.name}`} >{ `${text.code}-${text.name}` }</span>,
        sorter: (a, b) => Sort( a.product.name, b.product.name ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'product.name' ),
      },
      {
        title: 'Usuario',
        dataIndex: 'userAccount.user.username',
        key: 'userAccount.user.username',
        className: `${showHandleClass} `,
        sorter: (a, b) => Sort( a.userAccount.user.username, b.userAccount.user.username ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'userAccount.user.username' ),
      },

      {
        title: 'Saldo Actual',
        key: 'amount',
        render: data => <span className={IsOperationPositive(data.amount, data.initialAmount) ? 'positive' : 'negative'} key={ data.amount }>{ DisplayTableAmount( data.amount ) }</span>,
        sorter: (a, b) => Sort( a.amount, b.amount ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Invesión',
        dataIndex: 'initialAmount',
        key: 'initialAmount',
        render: initialAmount => <span key={initialAmount} >{ DisplayTableAmount( initialAmount ) }</span>,
        sorter: (a, b) => Sort( a.initialAmount, b.initialAmount ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Margen de Mantenimiento',
        dataIndex: 'maintenanceMargin',
        key: 'maintenanceMargin',
        render: maintenanceMargin => <span key={maintenanceMargin} >{ DisplayTableAmount( maintenanceMargin ) }</span>,
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
        title: 'Acciones',
        key: 'actions',
        render: this._getCTA,
        fixed: 'right',
        width: 150
      },
    ];

    return (
      <Table
        rowKey={ record => record.id }
        columns={ columns }
        dataSource={ this.state.marketOperations }
        loading={ this.props.isLoading }
        scroll={ { x: true } }
        className={classNames({'hidden-table': !this.props.isAdmin && _.isEmpty(this.state.marketOperations)})}
      />
    );
  }
}


function mapStateToProps(state) {

  return {}
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {}, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( MarketTable );