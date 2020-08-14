import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { Button, Table, Form, Popconfirm, Input, Icon } from 'antd';
import _ from 'lodash';
import uuidv1 from 'uuid/v1';

import { EditableProvider, EditableConsumer } from '../shared/MultipleEditable/editableContext';
import EditableCell from '../shared/MultipleEditable/editableCell';

import { settingOperations } from '../../../state/modules/settings';
import Highlighter from "react-highlight-words";
import { Sort, SortDate } from "../../../common/utils";

const DEFAULT_INPUT_TEXT = '';

class General extends Component {
  state = {
    dataSource: [],
    tempDataSource: [],
    count: 0,
    editingKey: '',
  };

  isEditing = record => record.id === this.state.editingKey;

  static getDerivedStateFromProps(nextProps, prevState) {

    if (!_.isEqual( nextProps.settings, prevState.dataSource )) {
      return {
        dataSource: nextProps.settings,
        count: _.size( nextProps.settings ),
        tempDataSource: [],
        editingKey: '',
      }
    }

    if (nextProps.isSuccess && !_.isEmpty( nextProps.message )) {
      nextProps.fetchGetSettings();
      nextProps.resetAfterRequest();
    }

    return null;
  }

  componentDidMount() {
    if (_.isEmpty( this.state.dataSource )) {
      this.props.fetchGetSettings();
    }
  }

  handleDelete = key => {
    if (_.isString( key )) {
      this.cancel()
    } else {
      this.props.fetchDeleteSetting( Number( key ) );
    }
  };

  handleAdd = () => {
    const newData = {
      ...this.state.tempDataSource,
      id: uuidv1(),
      code: DEFAULT_INPUT_TEXT,
      name: DEFAULT_INPUT_TEXT,
    };
    this.setState( {
      tempDataSource: [ newData ],
      editingKey: newData.id,
    } );
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

  /************************/

  cancel = () => {
    this.setState( { editingKey: '', tempDataSource: [] } );
  };

  save(form, key) {
    form.validateFields( (error, row) => {
      if (error) {
        return;
      }

      const newData = {
        ...row,
        id: key
      };

      if (_.isString( key )) {
        this.props.fetchAddSetting( newData )
      } else {
        this.props.fetchEditSetting( newData )
      }
    } );
  }

  edit(key) {
    this.setState( { editingKey: key } );
  }

  render() {
    const { dataSource, tempDataSource } = this.state;
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columnsSource = [
      {
        title: 'Nombre',
        dataIndex: 'name',
        key: 'name',
        editable: true,
        sorter: (a, b) => Sort( a.code, b.code ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'code' ),
      },
      {
        title: 'Valor',
        dataIndex: 'value',
        key: 'value',
        editable: true,
        sorter: (a, b) => Sort( a.name, b.name ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'name' ),
      },
      {
        title: 'Acciones',
        key: 'actions',
        render: (text, record) => {
          record = {
            ...record,
            key: record.id
          };
          const { editingKey } = this.state;
          const editable = this.isEditing( record );
          return editable ? (
            <span>
              <EditableConsumer>
                { form => (
                  <a
                    onClick={ () => this.save( form, record.key ) }
                    style={ { marginRight: 8 } }
                  >
                    Salvar
                  </a>
                ) }
              </EditableConsumer>
              <Popconfirm
                title="Desea cancelar?"
                onConfirm={ () => this.cancel( record.key ) }
                okText="Sí"
                cancelText="No"
              >
                <a>Cancelar</a>
              </Popconfirm>
            </span>
          ) : (
            <div>
              <a className="cta-actions" disabled={ editingKey !== '' } onClick={ () => this.edit( record.key ) }>
                Editar
              </a>
              <Popconfirm
                title="Desea eliminarlo?"
                onConfirm={ () => this.handleDelete( record.key ) }
                okText="Sí"
                cancelText="No"
              >
                <a disabled={ editingKey !== '' } className="cta-actions"> Eliminar </a>
              </Popconfirm>
            </div>
          );
        },
      },
    ];


    const columns = columnsSource.map( col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ( {
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing( record ),
        } ),
      };
    } );


    return (
      <div>
        <Button onClick={ this.handleAdd } type="primary" style={ { marginBottom: 16 } }
                disabled={ !_.isEmpty( this.state.tempDataSource ) }>
          Agregar Ajuste
        </Button>
        <EditableProvider value={ this.props.form }>
          <Table
            className={ !_.isEmpty( this.state.tempDataSource ) ? 'hasNew' : '' }
            components={ components }
            rowClassName="editable-row"
            bordered
            dataSource={ [ ...tempDataSource, ...dataSource ] }
            columns={ columns }
            pagination={ {
              onChange: this.cancel,
            } }
            loading={this.props.isLoading}
          />
        </EditableProvider>

      </div>
    );
  }
}

function mapStateToProps(state) {
  const { settingsState } = state;
  return {
    settings: settingsState.list,
    isSuccess: settingsState.isSuccess,
    isLoading: settingsState.isLoading,
    message: settingsState.message,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetSettings: settingOperations.fetchGetSettings,
    fetchAddSetting: settingOperations.fetchAddSetting,
    fetchEditSetting: settingOperations.fetchEditSetting,
    fetchDeleteSetting: settingOperations.fetchDeleteSetting,
    resetAfterRequest: settingOperations.resetAfterRequest,
  }, dispatch );

export default connect( mapStateToProps, mapDispatchToProps )( Form.create()( General ) );
