import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { Button, Table, Form, Popconfirm } from 'antd';
import _ from 'lodash';
import uuidv1 from 'uuid/v1';

import { EditableProvider, EditableConsumer } from './shared/editableContext';
import EditableCell from './shared/editableCell';

import { productOperations } from '../../../state/modules/products';

const DEFAULT_INPUT_TEXT = '';

class Products extends Component {
  columns = [
    {
      title: 'Código',
      dataIndex: 'code',
      key: 'code',
      editable: true,
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      editable: true,
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

    if (!_.isEqual( nextProps.products, prevState.dataSource )) {
      return {
        dataSource: nextProps.products,
        count: _.size( nextProps.products ),
        tempDataSource: [],
        editingKey: '',
      }
    }

    if (nextProps.isSuccess && !_.isEmpty( nextProps.message )) {
      nextProps.fetchGetProducts();
      nextProps.resetAfterRequest();
    }

    return null;
  }

  componentDidMount() {
    if (_.isEmpty( this.state.dataSource )) {
      this.props.fetchGetProducts();
    }
  }

  handleDelete = key => {
    if (_.isString( key )) {
      this.cancel()
    } else {
      this.props.fetchDeleteProduct( Number( key ) );
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
        this.props.fetchAddProduct( newData )
      } else {
        this.props.fetchEditProduct( newData )
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
          Agregar Producto
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
  const { productsState } = state;
  return {
    products: productsState.list,
    isSuccess: productsState.isSuccess,
    isLoading: productsState.isLoading,
    message: productsState.message,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetProducts: productOperations.fetchGetProducts,
    fetchAddProduct: productOperations.fetchAddProduct,
    fetchEditProduct: productOperations.fetchEditProduct,
    fetchDeleteProduct: productOperations.fetchDeleteProduct,
    resetAfterRequest: productOperations.resetAfterRequest,
  }, dispatch );

export default connect( mapStateToProps, mapDispatchToProps )( Form.create()( Products ) );
