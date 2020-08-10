import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import Highlighter from 'react-highlight-words';
import { Button, Icon, Input, Popconfirm, Radio, Table, Tag } from 'antd';
import { Sort, FormatCurrency, IsOperationPositive, DisplayTableAmount } from '../../common/utils';



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

  _handleExportHistory = (accountId) => {
    this.props.onReqeuestExportHistoryReport(accountId)
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
          <Button
            type="primary"
            data-testid="export-button"
            className="export-excel-cta"
            onClick={ () => this._handleExportHistory(row.id)}
            style={ { float: 'right' } }
          >
            <Icon type="file-excel"/> Reporte Histórico
          </Button>
          <Button type="secondary" onClick={ () => this.props.onEdit( row.id ) }><Icon type="edit"/></Button>
          <Popconfirm
            okText="Si"
            title="Está seguro ?"
            cancelText="Cancelar"
            onConfirm={ () => this.props.onDelete( row.id ) }
          >
            <Button type="danger"><Icon type="delete"/></Button>
          </Popconfirm>
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

  onTableChange = (pagination, filters, sorter, extra) => {
   this.props.onRequestUpdateTable()
  }

  _displayTableHeader = () => (
    <Radio.Group defaultValue={1} buttonStyle="solid" onChange={ this.props.onTabChange }>
      <Radio.Button value={1}>Activos</Radio.Button>
      <Radio.Button value={0}>Eliminados</Radio.Button>
    </Radio.Group>
  )


  render() {
    const dynamicClass = this.props.isOperationStandard ? 'show' : 'hidden';

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
        render: data => <span className={IsOperationPositive(data.accountValue, data.balanceInitial) ? 'positive' : 'negative'} key={ data.accountValue }>{ DisplayTableAmount( data.accountValue ) }</span>,
        sorter: (a, b) => Sort( a.accountValue, b.accountValue ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Garantías disponibles',
        dataIndex: 'guaranteeOperation',
        key: 'guaranteeOperation',
        className: dynamicClass,
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
        onChange={ this.onTableChange }
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