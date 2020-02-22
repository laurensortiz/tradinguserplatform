import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { Button, Table, Form, Popconfirm } from 'antd';
import _ from 'lodash';
import uuidv1 from 'uuid/v1';

import { EditableProvider, EditableConsumer } from './shared/editableContext';
import EditableCell from './shared/editableCell';

import { accountOperations } from '../../../state/modules/accounts';

const DEFAULT_INPUT_TEXT = '';

class Accounts extends Component {
  columns = [
    {
      title: 'Porcentaje',
      dataIndex: 'percentage',
      key: 'percentage',
      editable: true,
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      editable: true,
    },
    {
      title: 'Tipo de Operación Asociada',
      dataIndex: 'associatedOperation',
      key: 'associatedOperation',
      editable: true,
      render: type => _.isEqual(type, 1) ? 'Bolsa OTC' : 'Fondo de Interés'
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

  state = {
    dataSource: [],
    tempDataSource: [],
    count: 0,
    editingKey: '',
  };

  isEditing = record => record.id === this.state.editingKey;

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEqual( nextProps.accounts, prevState.dataSource )) {

      return {
        dataSource: nextProps.accounts,
        count: _.size( nextProps.accounts ),
        tempDataSource: [],
        editingKey: '',
      }
    }

    if (nextProps.isSuccess && !_.isEmpty( nextProps.message )) {
      nextProps.fetchGetAccounts();
      nextProps.resetAfterRequest();
    }

    return null;
  }

  componentDidMount() {
    if (_.isEmpty( this.state.dataSource )) {
      this.props.fetchGetAccounts();
    }
  }

  handleDelete = key => {
    if (_.isString( key )) {
      this.cancel()
    } else {
      this.props.fetchDeleteAccount( Number( key ) );
    }
  };

  handleAdd = () => {
    const newData = {
      ...this.state.tempDataSource,
      id: uuidv1(),
      percentage: DEFAULT_INPUT_TEXT,
      name: DEFAULT_INPUT_TEXT,
    };
    this.setState( {
      tempDataSource: [ newData ],
      editingKey: newData.id,
    } );
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
        this.props.fetchAddAccount( newData )
      } else {
        this.props.fetchEditAccount( newData )
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
    const columns = this.columns.map( col => {
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
          Agregar Cuenta
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
  const { accountsState } = state;
  return {
    accounts: accountsState.list,
    isSuccess: accountsState.isSuccess,
    isLoading: accountsState.isLoading,
    message: accountsState.message,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetAccounts: accountOperations.fetchGetAccounts,
    fetchAddAccount: accountOperations.fetchAddAccount,
    fetchEditAccount: accountOperations.fetchEditAccount,
    fetchDeleteAccount: accountOperations.fetchDeleteAccount,
    resetAfterRequest: accountOperations.resetAfterRequest,
  }, dispatch );

export default connect( mapStateToProps, mapDispatchToProps )( Form.create()( Accounts ) );
