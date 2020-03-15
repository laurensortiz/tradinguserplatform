import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { Button, Table, Popconfirm, Alert } from 'antd';
import _ from 'lodash';
import uuidv1 from 'uuid/v1';

import { assetClassOperations } from '../../../state/modules/assetClasses';

import EditableCell, {EditableFormRow} from './shared/editableCell';

const DEFAULT_INPUT_TEXT = '';

class AssetClass extends Component {
  columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      editable: true,
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (text, record) =>
        this.state.dataSource.length >= 1 ? (
          <Popconfirm
            title="Si desea eliminarlo?"
            onConfirm={ () => this.handleDelete( record.id ) }
            okText="Sí"
            cancelText="No"
          >
            <a>Borrar</a>
          </Popconfirm>
        ) : null,
    },
  ];

  state = {
    dataSource: [],
    tempDataSource: [],
    count: 0,
  };

  static getDerivedStateFromProps(nextProps, prevState) {

    if (!_.isEqual( nextProps.assetClasses, prevState.dataSource )) {
      return {
        dataSource: nextProps.assetClasses,
        count: _.size( nextProps.assetClasses ),
        tempDataSource: []
      }
    }

    if (nextProps.isSuccess && !_.isEmpty( nextProps.message )) {
      nextProps.fetchGetAssetClasses();
      nextProps.resetAfterRequest();
    }

    return null;
  }

  componentDidMount() {
    if (_.isEmpty( this.state.dataSource )) {
      this.props.fetchGetAssetClasses();

    }
  }

  handleDelete = key => {
    if (_.isString( key )) {
      this.setState( { tempDataSource: [] } );
    } else {
      this.props.fetchDeleteAssetClass( Number( key ) );
    }
  };

  handleAdd = () => {
    const newData = {
      id: uuidv1(),
      name: DEFAULT_INPUT_TEXT,
    };
    this.setState( {
      tempDataSource: [ newData ],
    } );

  };

  handleSave = row => {
    if (!_.isEqual( row.name, DEFAULT_INPUT_TEXT )) {
      if (_.isString( row.id )) {
        this.props.fetchAddAssetClass( row )
      } else {
        this.props.fetchEditAssetClass( row )
      }
    }

  };

  render() {
    const { dataSource, tempDataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
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
          handleSave: this.handleSave,
        } ),
      };
    } );
    return (
      <div>
        <Button onClick={ this.handleAdd } type="primary" style={ { marginBottom: 16 } }
                disabled={ !_.isEmpty( this.state.tempDataSource ) }>
          Agregar Categoría de Lotage
        </Button>
        <Alert message="Para editar el nombre sólo debe hacer click en el campo del puesto que desea modificar. " type="info" showIcon />

        <p></p>
        <Table
          className={ !_.isEmpty( this.state.tempDataSource ) ? 'hasNew' : '' }
          components={ components }
          rowClassName={ () => 'editable-row' }
          bordered
          dataSource={ [ ...tempDataSource, ...dataSource ] }
          columns={ columns }
          loading={this.props.isLoading}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { assetClassesState } = state;
  return {
    assetClasses: assetClassesState.list,
    isSuccess: assetClassesState.isSuccess,
    isLoading: assetClassesState.isLoading,
    message: assetClassesState.message,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetAssetClasses: assetClassOperations.fetchGetAssetClasses,
    fetchAddAssetClass: assetClassOperations.fetchAddAssetClass,
    fetchEditAssetClass: assetClassOperations.fetchEditAssetClass,
    fetchDeleteAssetClass: assetClassOperations.fetchDeleteAssetClass,
    resetAfterRequest: assetClassOperations.resetAfterRequest,
  }, dispatch );

export default connect( mapStateToProps, mapDispatchToProps )( AssetClass );
