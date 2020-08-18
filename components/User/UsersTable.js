import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import _ from 'lodash';

import { Button, Icon, Popconfirm, Table, Tag, Input, Radio } from 'antd';
import Highlighter from 'react-highlight-words';

import { Sort, SortDate, FormatDate } from '../../common/utils';
import classNames from "classnames";

class UsersTable extends Component {
  state = {
    searchText: '',
    searchedColumn: '',
    isAdminUsersSelected: false,
    isMenuFold: true
  };

  _getCTA = (type, row) => {
    return (
      <div className="cta-container" style={{float: 'right'}}>
        {_.isEqual(this.props.dataStatus, 0) ? (
          <Popconfirm
            okText="Si"
            title="Está seguro que desea activarlo ?"
            cancelText="Cancelar"
            onConfirm={ () => this.props.onActive( row.id ) }
          >
            <Button type="danger"><Icon type="undo" /><span>Activar</span></Button>
          </Popconfirm>
        ) : (
          <>
            <Button type="secondary" onClick={ () => this.props.onDetail( row ) }><Icon type="hdd"/>Detalle</Button>
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
        )}
      </div>
    )

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

  _displayTableHeader = () => {
    return (
      <Radio.Group defaultValue={ this.props.dataStatus } buttonStyle="solid" onChange={ this.props.onTabChange }>
        <Radio.Button value={ 1 }>Activos</Radio.Button>
        <Radio.Button value={ 0 }>Eliminados</Radio.Button>
      </Radio.Group>
    )
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
    const columns = [

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
        title: this._handleActionTitle,
        key: 'actions',
        render: this._getCTA,
        className: 't-a-r'
      },
    ];

    return (
      <Table
        rowKey={ record => record.id }
        columns={ columns }
        dataSource={ this.props.users }
        loading={ this.props.isLoading }
        title={ this._displayTableHeader }
        className={ classNames( { 'is-menu-fold': this.state.isMenuFold } ) }
        tableLayout="auto"
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