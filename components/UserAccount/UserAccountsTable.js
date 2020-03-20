import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import { Button, Icon, Input, Popconfirm, Radio, Table, Tag } from 'antd';
import { Sort, FormatCurrency, IsOperationPositive, DisplayTableAmount } from '../../common/utils';
import Highlighter from "react-highlight-words";


class UserAccountsTable extends Component {
  state = {
    userAccounts: [],
    searchText: '',
    searchedColumn: '',
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEqual( nextProps.userAccounts, prevState.userAccounts )) {
      return {
        userAccounts: nextProps.userAccounts
      }
    }
    return null;
  }

  _selectItemsOperationType = () => (
    <Menu onClick={this.props.onCreateOperation}>
      <Menu.Item key="market">Bolsa</Menu.Item>
      <Menu.Item key="investment">Inversión</Menu.Item>
    </Menu>
  );

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
          <Popconfirm
            okText="Si"
            title="Está seguro ?"
            cancelText="Cancelar"
            onConfirm={ () => this.props.onDelete( row.id ) }
          >
            <Button type="danger"><Icon type="delete"/></Button>
          </Popconfirm>
          <Button type="secondary" onClick={ () => this.props.onEdit( row.id ) }><Icon type="edit"/></Button>
        </div>
      )
    }

  };

  _displayTableAmount = amount => {
    if (amount) {
      return `${ FormatCurrency.format(amount) }`
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
    const columns = [
      {
        title: 'Usuario',
        dataIndex: 'user.username',
        key: 'user.username',
        sorter: (a, b) => Sort( a.username, b.username ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'user.username' ),
      },
      {
        title: 'Tipo de Cuenta',
        dataIndex: 'account.name',
        key: 'account.name',
        sorter: (a, b) => Sort( a.accountName, b.accountName ),
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
        render: data => <span className={IsOperationPositive(data.accountValue, data.balanceInitial) ? 'positive' : 'negative'} key={ data.accountValue }>{ DisplayTableAmount( data.accountValue ) }</span>,
        sorter: (a, b) => Sort( a.accountValue, b.accountValue ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Garantías disponibles',
        dataIndex: 'guaranteeOperation',
        key: 'guaranteeOperation',
        render: amount => <span key={ amount }>{ this._displayTableAmount( amount ) }</span>,
        sorter: (a, b) => Sort( a.guaranteeOperation, b.guaranteeOperation ),
        sortDirections: [ 'descend', 'ascend' ],
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
        dataSource={ this.state.userAccounts }
        loading={ this.props.isLoading }
        scroll={ { x: true } }
        title={this._displayTableHeader}
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