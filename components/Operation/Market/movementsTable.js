import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { Button, Table, Form, Popconfirm, Icon, Row, Col } from 'antd';
import _ from 'lodash';
import uuidv1 from 'uuid/v1';
import moment from "moment";

import { EditableProvider, EditableConsumer } from './shared/editableContext';
import EditableCell from './shared/editableCell';

import { FormatCurrency, FormatDate, GetGP, getGPInversion } from '../../../common/utils';

import { investmentMovementOperations } from '../../../state/modules/investmentMovement';

moment.locale( 'es' ); // Set Lang to Spanish
const DEFAULT_INPUT_TEXT = '';

class MovementsTable extends Component {
  state = {
    dataSource: [],
    tempDataSource: [],
    count: 0,
    editingKey: '',
  };

  isEditing = record => record.id === this.state.editingKey;

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {};
    if (!_.isEqual( nextProps.movements, prevState.dataSource )) {
      _.assignIn(updatedState, {
        dataSource: nextProps.movements,
        count: _.size( nextProps.movements ),
        tempDataSource: [],
        editingKey: '',
      })
    }

    return !_.isEmpty(updatedState) ? updatedState : null;
  }

  handleDelete = key => {
    if (_.isString( key )) {
      this.cancel()
    } else {
      this.props.fetchDeleteMarketMovement( Number( key ) );
    }
  };

  handleAdd = () => {
    const {amount, id: operationId} = this.props.currentOperation;
    const newMovement = {
      id: uuidv1(),
      gpInversion: amount,
      gpAmount: DEFAULT_INPUT_TEXT,
      createdAt: moment.utc(),
    };
    this.setState( {
      tempDataSource: [ newMovement ],
      editingKey: newMovement.id,
    } );
  };

  /************************/

  cancel = () => {
    this.setState( {
      editingKey: '',
      tempDataSource: [],
      currentAmount: this.props.currentOperation.amount
    } );
  };

  save = (key) => {
    this.props.form.validateFields( (error, row) => {
      if (error) {
        return;
      }

      const newMovement = _.first(this.state.tempDataSource);
      const newData = {
        ...newMovement,
        ...row,
        id: key
      };

      if (_.isString( key )) {
        this.props.onAdd( newData )
      } else {
        this.props.fetchEditMarketMovement( newData )
      }
    } );
  };

  edit(key) {
    this.setState( { editingKey: key } );
  }

  _onChangeInput = ({target}) => {
    const currentAmount = getGPInversion(this.props.currentOperation.amount || 0, !_.isEmpty(target.value) ? target.value : 0);
    const tempData = _.first(this.state.tempDataSource);
    const tempDataSourceUpdate = {
      ...tempData,
      gpInversion: currentAmount
    };

    this.setState({
      tempDataSource: [tempDataSourceUpdate]
    })
  };

  render() {

    const { dataSource, tempDataSource } = this.state;
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this._getColumns().map( col => {
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
          inputType: col.inputType,
          required: col.required,
          onChangeInput: this._onChangeInput,
          onPressEnter: () => this.save(record.id)
        } ),
      };
    } );
    return (
      <Row>
        {this.props.isAdmin ? (
          <Col>
            <Button onClick={ this.handleAdd } type="primary" style={ { marginBottom: 16 } }
                    disabled={ !_.isEmpty( this.state.tempDataSource ) || this.props.currentOperation.status != 1 }>
              Agregar Movimiento
            </Button>
          </Col>
        ) : null}


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

      </Row>
    );
  }
}

function mapStateToProps(state) {
  const { accountsState } = state;
  return {
    investmentMovements: state.investmentMovementsState.list,
    isLoading: state.investmentMovementsState.isLoading,
    isSuccess: state.investmentMovementsState.isSuccess,
    isFailure: state.investmentMovementsState.isFailure,
    message: state.investmentMovementsState.message,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetMarketMovements: investmentMovementOperations.fetchGetMarketMovements,
    fetchAddMarketMovement: investmentMovementOperations.fetchAddMarketMovement,
    fetchEditMarketMovement: investmentMovementOperations.fetchEditMarketMovement,
    fetchDeleteMarketMovement: investmentMovementOperations.fetchDeleteMarketMovement,
    resetAfterRequest: investmentMovementOperations.resetAfterRequest,
  }, dispatch );

export default connect( mapStateToProps, mapDispatchToProps )( Form.create()( MovementsTable ) );
