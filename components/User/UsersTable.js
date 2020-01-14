import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import { Button, Icon, Popconfirm, Table, Tag, Input } from 'antd';
import Highlighter from 'react-highlight-words';

import { Sort, SortDate, FormatDate } from '../../common/utils';

class UsersTable extends Component {
  state = {
    users: [],
    searchText: '',
    searchedColumn: '',
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEqual( nextProps.users, prevState.users )) {
      return {
        users: nextProps.users
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
    onFilter: (value, record) =>
      record[ dataIndex ]
        .toString()
        .toLowerCase()
        .includes( value.toLowerCase() ),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout( () => this.searchInput.select() );
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={ { backgroundColor: '#ffc069', padding: 0 } }
          searchWords={ [ this.state.searchText ] }
          autoEscape
          textToHighlight={ text.toString() }
        />
      ) : (
        text
      ),
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
  _getFilterValues = (context) => {
    const uniqValues = _
      .chain( this.state.users )
      .map( item => _.get( item, context ) )
      .uniq()
      .value();
    console.log('[=====  values  =====>');
    console.log(uniqValues);
    console.log('<=====  /values  =====]');
    return _.map( uniqValues, name => {
      return {
        text: name,
        value: name,
      }
    } )

  };

  render() {
    const columns = [
      {
        title: 'Nombre',
        dataIndex: 'firstName',
        key: 'firstName',
        render: text => <span key={ text }>{ text }</span>,
        sorter: (a, b) => Sort( a.firstName, b.firstName ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'firstName' ),
      },
      {
        title: 'Apellido',
        dataIndex: 'lastName',
        key: 'lastName',
        render: text => <span key={ text }>{ text }</span>,
        sorter: (a, b) => Sort( a.lastName, b.lastName ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'lastName' ),
      },
      {
        title: 'Usuario',
        dataIndex: 'username',
        key: 'username',
        render: text => <span key={ text }>{ text }</span>,
        sorter: (a, b) => Sort( a.username, b.username ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'username' ),
      },
      {
        title: 'Cédula',
        dataIndex: 'userID',
        key: 'userID',
        render: text => <span key={ text }>{ text }</span>,
        sorter: (a, b) => Sort( a.userID, b.userID ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'userID' ),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: email => <span key={ email }>{ email }</span>,
        sorter: (a, b) => Sort( a.email, b.email ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'email' ),
      },
      {
        title: 'Teléfono',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        render: phoneNumber => <span key={ phoneNumber }>{ phoneNumber }</span>,
        sorter: (a, b) => Sort( a.phoneNumber, b.phoneNumber ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'phoneNumber' ),
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
        title: 'Cuenta',
        dataIndex: 'account',
        key: 'account',
        render: account => <span>{ `${ account.percentage }% - ${ account.name }` }</span>,
        sorter: (a, b) => Sort( a.account.name, b.account.name ),
        sortDirections: [ 'descend', 'ascend' ],
        filters: this._getFilterValues('account.name'),
        onFilter: (value, record) => record.account.name.includes( value ),
      },
      {
        title: 'Permisos',
        dataIndex: 'role',
        key: 'role',
        render: (type, row) => {
          const colorTag = type.id === 2 ? 'orange' : 'green';
          return <Tag color={ colorTag }>{ type.name }</Tag>
        },
        sorter: (a, b) => Sort( a.role.name, b.role.name ),
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
        dataSource={ this.props.users }
        loading={ this.props.isLoading }
        scroll={ { x: true } }
      />
    );
  }
}


function mapStateToProps(state) {

  return {}
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {}, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( UsersTable );