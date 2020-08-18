import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import { Button, Icon, Input, Popconfirm, Table, Tag } from 'antd';
import { Sort, FormatCurrency, FormatStatus, FormatDate, SortDate, DisplayTableAmount } from '../../../common/utils';
import classNames from "classnames";
import Highlighter from "react-highlight-words";

class InvestmentTable extends Component {
  state = {
    operations: [],
    isMenuFold: true
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEqual( nextProps.operations, prevState.operations )) {
      return {
        users: nextProps.operations
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
            <Button type="danger"><Icon type="undo" /><span>Activar</span></Button>
          </Popconfirm>
        </div>
      )
    } else {
      return (
        <div className="cta-container">
          <Button type="secondary" onClick={ () => this.props.onDetail( row.id ) }><Icon type="hdd" /><span>Detalle</span></Button>
          {this.props.isAdmin ? (
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
          ): null}

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

    const columns = [
      {
        title: 'Estado',
        dataIndex: 'status',
        key: 'status',
        filters: [
          { text: 'Activo', value: 1 },
          { text: 'Cerrado', value: 2 },
          { text: 'Hold', value: 3 },
          { text: 'Vendido', value: 4 },
        ],
        onFilter: (value, record) => record.status === value,
        filterMultiple: false,
        render: status => {
          const {name, color} = FormatStatus(status, true);
          return <Tag color={color} >{ name }</Tag>
        },
        sorter: (a, b) => Sort( a.status, b.status ),
        sortDirections: [ 'descend', 'ascend' ],
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
        title: 'Nombre',
        dataIndex: 'userAccount.user.firstName',
        key: 'userAccount.user.firstName',
        render: text => <span key={ text }>{ text }</span>,
        sorter: (a, b) => Sort( a.firstName, b.firstName ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'userAccount.user.firstName' ),
      },
      {
        title: 'Apellido',
        dataIndex: 'userAccount.user.lastName',
        key: 'userAccount.user.lastName',
        render: text => <span key={ text }>{ text }</span>,
        sorter: (a, b) => Sort( a.lastName, b.lastName ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'userAccount.user.lastName' ),
      },
      {
        title: 'Tipo de Operación',
        dataIndex: 'operationType',
        key: 'operationType',
        render: text => <span key={ text }>{ text }</span>,
        sorter: (a, b) => Sort( a.operationType, b.operationType ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Cuenta de Usuario',
        dataIndex: 'userAccount',
        key: 'account',
        render: text => <span key={ text.accountId }>{ text.account.name }</span>,
        sorter: (a, b) => Sort( a.userAccount.account.name, b.userAccount.account.name ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Saldo Actual',
        dataIndex: 'amount',
        key: 'amount',
        render: amount => <span key={ amount }>{ DisplayTableAmount( amount ) }</span>,
        sorter: (a, b) => Sort( a.amount, b.amount ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Fecha de Inicio',
        dataIndex: 'startDate',
        key: 'startDate',
        render: (date, row) => <span className="date">{ FormatDate(date) }</span>,
        sorter: (a, b) => SortDate( a.startDate, b.startDate ),
        sortDirections: [ 'descend', 'ascend' ],

      },
      {
        title: 'Fecha de Salida',
        dataIndex: 'endDate',
        key: 'endDate',
        render: (date, row) => <span className="date">{ FormatDate(date) }</span>,
        sorter: (a, b) => SortDate( a.endDate, b.endDate ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: this._handleActionTitle,
        key: 'actions',
        render: this._getCTA,
        fixed: 'right',
        className: 't-a-r'
      },
    ];

    return (
      <Table
        rowKey={ record => record.id }
        columns={ columns }
        dataSource={ this.props.investmentOperations }
        loading={ this.props.isLoading }
        scroll={ { x: true } }
        className={classNames({'hidden-table': !this.props.isAdmin && _.isEmpty(this.props.investmentOperations), 'is-menu-fold': this.state.isMenuFold})}

      />
    );
  }
}


function mapStateToProps(state) {

  return {}
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {}, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( InvestmentTable );