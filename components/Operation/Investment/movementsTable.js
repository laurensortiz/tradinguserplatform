import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { Button, Table, Form, Popconfirm, Icon } from 'antd';
import _ from 'lodash';
import uuidv1 from 'uuid/v1';
import moment from 'moment';

moment.locale( 'es' ); // Set Lang to Spanish

import { EditableProvider, EditableConsumer } from './shared/editableContext';
import EditableCell from './shared/editableCell';

import { FormatCurrency, FormatDate, GetGP, getGPInversion } from '../../../common/utils';

import { investmentMovementOperations } from '../../../state/modules/investmentMovement';

const DEFAULT_INPUT_TEXT = '';

class MovementsTable extends Component {
  state = {
    dataSource: [],
    tempDataSource: [],
    count: 0,
    editingKey: '',
    currentOperationAmount: 0,
    initialOperationAmount: 0,
    operationPercentage: 0
  };

  columns = [
    {
      title: 'G/P',
      dataIndex: 'gpInversion',
      key: 'gpInversion',
      render: value => FormatCurrency.format( value ),
      editable: true,
      required: false
    },
    {
      title: 'G/P',
      dataIndex: 'gpAmount',
      key: 'gpAmount',
      render: value => FormatCurrency.format( value ),
      editable: true,
      required: true
    },
    {
      title: 'Fecha de movimiento',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: value => FormatDate( value ),
      editable: true,
      inputType: 'date',
      required: false
    },
    {
      title: 'Acciones',
      key: 'actions',
      className: 'actions-col',
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
                    onClick={ () => this.save( record.key ) }
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
            {/*<a className="cta-actions" disabled={ editingKey !== '' } onClick={ () => this.edit( record.key ) }>*/ }
            {/*  Editar*/ }
            {/*</a>*/ }
            {/*<Popconfirm*/ }
            {/*  title="Desea eliminarlo?"*/ }
            {/*  onConfirm={ () => this.handleDelete( record.key ) }*/ }
            {/*  okText="Sí"*/ }
            {/*  cancelText="No"*/ }
            {/*>*/ }
            {/*  <Button type="danger" disabled={ editingKey !== '' }><Icon type="delete"/></Button>*/ }
            {/*</Popconfirm>*/ }
          </div>
        );
      },
    },
  ];

  isEditing = record => record.id === this.state.editingKey;

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {};
    if (!_.isEqual( nextProps.movements, prevState.dataSource )) {

      _.assignIn( updatedState, {
        dataSource: nextProps.movements,
        count: _.size( nextProps.movements ),
        tempDataSource: [],
        editingKey: '',
      } )
    }

    if (!_.isEmpty( nextProps.currentOperation )) {
      if (!_.isEqual( nextProps.currentOperation.amount, prevState.currentOperationAmount )) {
        _.assignIn( updatedState, {
          currentOperationAmount: nextProps.currentOperation.amount,
          initialOperationAmount: nextProps.currentOperation.initialAmount,
          operationPercentage: _.get( nextProps, 'currentOperation.userAccount.account.percentage', 0 )
        } )
      }
    }


    return !_.isEmpty( updatedState ) ? updatedState : null;
  }

  componentDidMount() {
  }

  handleDelete = key => {
    if (_.isString( key )) {
      this.cancel()
    } else {
      this.props.fetchDeleteInvestmentMovement( Number( key ) );
    }
  };

  handleAdd = () => {
    const { amount, id: operationId } = this.props.currentOperation;
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
        this.props.fetchEditInvestmentMovement( newData )
      }
    } );
  }

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
          inputType: col.inputType,
          required: col.required,
          onChangeInput: this._onChangeInput,
          onPressEnter: () => this.save(record.id)
        } ),
      };
    } );
    return (
      <div>
        <Button onClick={ this.handleAdd } type="primary" style={ { marginBottom: 16 } }
                disabled={ !_.isEmpty( this.state.tempDataSource ) }>
          Agregar Movimiento
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
            loading={ this.props.isLoading }
          />
        </EditableProvider>

      </div>
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
    fetchGetInvestmentMovements: investmentMovementOperations.fetchGetInvestmentMovements,
    fetchAddInvestmentMovement: investmentMovementOperations.fetchAddInvestmentMovement,
    fetchEditInvestmentMovement: investmentMovementOperations.fetchEditInvestmentMovement,
    fetchDeleteInvestmentMovement: investmentMovementOperations.fetchDeleteInvestmentMovement,
    resetAfterRequest: investmentMovementOperations.resetAfterRequest,
  }, dispatch );

export default connect( mapStateToProps, mapDispatchToProps )( Form.create()( MovementsTable ) );
