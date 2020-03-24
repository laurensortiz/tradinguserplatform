import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { Button, Table, Popconfirm, Alert } from 'antd';
import _ from 'lodash';
import uuidv1 from 'uuid/v1';

import { brokerOperations } from '../../../state/modules/brokers';

import EditableCell, {EditableFormRow} from '../shared/SingleEditable/editableCell';

const DEFAULT_INPUT_TEXT = '';

class Broker extends Component {
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

    if (!_.isEqual( nextProps.brokers, prevState.dataSource )) {
      return {
        dataSource: nextProps.brokers,
        count: _.size( nextProps.brokers ),
        tempDataSource: []
      }
    }

    if (nextProps.isSuccess && !_.isEmpty( nextProps.message )) {
      nextProps.fetchGetBrokers();
      nextProps.resetAfterRequest();
    }

    return null;
  }

  componentDidMount() {
    if (_.isEmpty( this.state.dataSource )) {
      this.props.fetchGetBrokers();

    }
  }

  handleDelete = key => {
    if (_.isString( key )) {
      this.setState( { tempDataSource: [] } );
    } else {
      this.props.fetchDeleteBroker( Number( key ) );
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
        this.props.fetchAddBroker( row )
      } else {
        this.props.fetchEditBroker( row )
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
          Agregar Corredor
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
  const { brokersState } = state;
  return {
    brokers: brokersState.list,
    isSuccess: brokersState.isSuccess,
    isLoading: brokersState.isLoading,
    message: brokersState.message,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetBrokers: brokerOperations.fetchGetBrokers,
    fetchAddBroker: brokerOperations.fetchAddBroker,
    fetchEditBroker: brokerOperations.fetchEditBroker,
    fetchDeleteBroker: brokerOperations.fetchDeleteBroker,
    resetAfterRequest: brokerOperations.resetAfterRequest,
  }, dispatch );

export default connect( mapStateToProps, mapDispatchToProps )( Broker );
