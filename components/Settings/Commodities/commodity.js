import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { Button, Table, Popconfirm, Alert } from 'antd';
import _ from 'lodash';
import uuidv1 from 'uuid/v1';

import { commodityOperations } from '../../../state/modules/commodity';

import EditableCell, {EditableFormRow} from '../shared/SingleEditable/editableCell';

const DEFAULT_INPUT_TEXT = '';

class Commodity extends Component {
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

    if (!_.isEqual( nextProps.commodities, prevState.dataSource )) {
      return {
        dataSource: nextProps.commodities,
        count: _.size( nextProps.commodities ),
        tempDataSource: []
      }
    }

    if (nextProps.isSuccess && !_.isEmpty( nextProps.message )) {
      nextProps.fetchGetCommodities();
      nextProps.resetAfterRequest();
    }

    return null;
  }

  componentDidMount() {
    if (_.isEmpty( this.state.dataSource )) {
      this.props.fetchGetCommodities();

    }
  }

  handleDelete = key => {
    if (_.isString( key )) {
      this.setState( { tempDataSource: [] } );
    } else {
      this.props.fetchDeleteCommodity( Number( key ) );
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
        this.props.fetchAddCommodity( row )
      } else {
        this.props.fetchEditCommodity( row )
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
          Agregar Mercado
        </Button>
        <Alert message="Para editar el nombre sólo debe hacer click en el campo que desea modificar. " type="info" showIcon />

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
  const { commoditiesState } = state;
  return {
    commodities: commoditiesState.list,
    isSuccess: commoditiesState.isSuccess,
    isLoading: commoditiesState.isLoading,
    message: commoditiesState.message,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetCommodities: commodityOperations.fetchGetCommodities,
    fetchAddCommodity: commodityOperations.fetchAddCommodity,
    fetchEditCommodity: commodityOperations.fetchEditCommodity,
    fetchDeleteCommodity: commodityOperations.fetchDeleteCommodity,
    resetAfterRequest: commodityOperations.resetAfterRequest,
  }, dispatch );

export default connect( mapStateToProps, mapDispatchToProps )( Commodity );
