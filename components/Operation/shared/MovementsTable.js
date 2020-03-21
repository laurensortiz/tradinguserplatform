import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { Button, Table, Form, Popconfirm, Icon, Select, DatePicker, Row, Col } from 'antd';
import _ from 'lodash';
import uuidv1 from 'uuid/v1';
import moment from 'moment';

import momentDurationFormat from 'moment-duration-format';
import { extendMoment } from 'moment-range';

import { EditableProvider, EditableConsumer } from './editable/editableContext';
import EditableCell from './editable/editableCell';

import { FormatCurrency, FormatDate, GetGP, getGPInversion } from '../../../common/utils';

import { investmentMovementOperations } from '../../../state/modules/investmentMovement';
import { Export } from "./index";

momentDurationFormat( moment );
extendMoment( moment );
moment.locale( 'es' ); // Set Lang to Spanish

const { Option } = Select;
const { RangePicker } = DatePicker;

const DEFAULT_INPUT_TEXT = '';
const FORMAT_DATE = 'DD-MM-YYYY';

class MovementsTable extends Component {
  state = {
    dataSource: [],
    tempDataSource: [],
    count: 0,
    editingKey: '',
    currentOperationAmount: 0,
    initialOperationAmount: 0,
    operationPercentage: 0,
    filteredInfo: {},
    sortedInfo: {},
    searchText: '',
    exportData: []
  };

  dateMode = 0;
  timeDateRange = [];
  defaultDate = null;


  isEditing = record => record.id === this.state.editingKey;

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {};
    if (!_.isEqual( nextProps.movements, prevState.dataSource )) {

      _.assignIn( updatedState, {
        dataSource: nextProps.movements,
        exportData: nextProps.movements,
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


  handleDelete = key => {
    if (_.isString( key )) {
      this.cancel()
    } else {
      this.props.onDelete( Number( key ) );
    }
  };

  _handleChange = (pagination, filters, sorter, extra) => {
    this.setState( {
      exportData: extra.currentDataSource,
    } );
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
        this.props.onEdit( newData )
      }
    } );
  }

  edit = (key) => {
    this.setState( { editingKey: key } );
  }


  _onChangeInput = (value) => {

    if (!_.isNumber(this.state.editingKey)) {
      const currentAmount = getGPInversion(this.props.currentOperation.amount || 0, _.isNumber(value) ? parseFloat(value).toFixed(2) : 0);
      const tempData = _.first(this.state.tempDataSource);

      const tempDataSourceUpdate = {
        ...tempData,
        gpInversion: parseFloat(currentAmount).toFixed(2)
      };

      this.setState({
        tempDataSource: [tempDataSourceUpdate]
      })
    }

  };
  /*
  * RANGE
  *
  * */

  _handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState( {
      searchText: selectedKeys[ 0 ],
    } );
  };

  _handleReset = (selectedKeys, clearFilters) => {
    if (!_.isEmpty( selectedKeys )) {
      clearFilters();
      this.setState( {
        searchText: '',
      } );
    }

  };

  _sortDates = (start, end) => {
    if (_.isNil( start )) start = '00-00-0000';
    if (_.isNil( end )) end = '00-00-0000';

    return moment( start ).unix() - moment( end ).unix()
  };

  _handleDateFilterChange = (dateModeValue) => {
    this.dateMode = dateModeValue;
    this.forceUpdate();
    this.defaultDate = null;
  };

  _datesInRange = (record, dataIndex) => {

    const dateRange = this.timeDateRange;
    if (!_.isEmpty( dateRange )) {
      return _.includes( dateRange, moment.utc( _.get( record, dataIndex ) ).format( FORMAT_DATE ) )
    }

  };

  _createDateRange = (date, setSelectedKeys, minDate, maxDate, dataIndex) => {
    this.defaultDate = moment.utc( date );

    let dateRange = [],
      range = '';

    const dateMode = this.dateMode;

    switch (dateMode) {
      case 'single':
        range = moment.range( date, date );
        break;
      case 'range':
        range = moment.range( date[ 0 ], date[ 1 ] );
        break;
      default:
    }

    let arrayOfDates = _.toArray( range.by( 'days' ) );

    _.map( arrayOfDates, date => {
      dateRange.push( moment( date ).format( FORMAT_DATE ) )
    } );

    this.timeDateRange = dateRange;

    return setSelectedKeys( date ? [ date ] : [] );
  };

  _getColumnDateProps = (dataIndex, minDate, maxDate) => ( {
    filterDropdown: ({
                       setSelectedKeys,
                       selectedKeys,
                       confirm,
                       clearFilters,
                     }) => (
      <div className="custom-filter-dropdown">
        <Select
          placeholder="Seleccione el tipo de filtro"
          onChange={ e => this._handleDateFilterChange( e ) }
        >
          <Option value="single">Por día</Option>
          <Option value="range">Rango de fechas</Option>
        </Select>

        { this.dateMode === 'range' ?
          <RangePicker
            onChange={ e => this._createDateRange( e, setSelectedKeys, minDate, maxDate, dataIndex ) }
            format={ FORMAT_DATE }
            allowClear={ false }
          />
          : null
        }

        { this.dateMode === 'single' ?
          <DatePicker
            value={ this.defaultDate }
            onChange={ e => this._createDateRange( e, setSelectedKeys, minDate, maxDate, dataIndex ) }
            format={ FORMAT_DATE }
            allowClear={ false }
          />
          : null
        }
        <Button
          onClick={ () => this._handleSearch( selectedKeys, confirm ) }
          icon="search"
          size="small"
        >
          Filtrar
        </Button>
        <Button
          ref={ e => this.clearFilterDatesBtn = e }
          onClick={ () => this._handleReset( selectedKeys, clearFilters ) }
          size="small"
        >
          Limpiar
        </Button>
      </div>
    ),
    onFilter: (value, record) => {
      return this._datesInRange( record, dataIndex )
    }
  } );

  _getColumns = () => {
    const sortDirections = [ 'descend', 'ascend' ];
    const datesInTimes = _.map( this.state.dataSource, record => moment( record.createdAt ) ),
      maxDatesInTimes = moment.max( datesInTimes ).add( 1, 'days' ),
      minDatesInTimes = moment.min( datesInTimes ).subtract( 1, 'days' );
    const showBasedAdmin = this.props.isAdmin ? 'show' : 'hidden';
    return [
      {
        title: 'G/P',
        dataIndex: 'gpInversion',
        key: 'gpInversion',
        render: value => FormatCurrency.format( value ),
        editable: true,
        required: false,
        inputType: 'number'
      },
      {
        title: 'G/P',
        dataIndex: 'gpAmount',
        key: 'gpAmount',
        render: value => FormatCurrency.format( value ),
        editable: true,
        required: true,
        inputType: 'number'
      },
      {
        title: 'Fecha de movimiento',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: value => FormatDate( value ),
        editable: true,
        inputType: 'date',
        required: false,
        rowKey: d => {
          return FormatDate( d.createdAt )
        },
        sorter: (a, b) => {
          return this._sortDates( a.createdAt, b.createdAt );
        },
        ...this._getColumnDateProps(
          'createdAt',
          minDatesInTimes,
          maxDatesInTimes,
        )
      },
      {
        title: 'Acciones',
        key: 'actions',
        className: `${showBasedAdmin}`,
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
                  <span>
                    <a
                      onClick={ () => this.save( record.key ) }
                      style={ { marginRight: 8 } }
                    >
                    Salvar
                  </a>

                  </span>

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
            <div className="cta-container">
              <Button type="secondary" disabled={ editingKey !== '' } onClick={ () => this.edit( record.key ) }><Icon type="edit"/></Button>
              {/*<a className="cta-actions" disabled={ editingKey !== '' } onClick={ () => this.edit( record.key ) }>*/}
              {/*  Editar*/}
              {/*</a>*/}
              <Popconfirm
                title="Desea eliminarlo?"
                onConfirm={ () => this.handleDelete( record.key ) }
                okText="Sí"
                cancelText="No"
              >
                <Button type="danger" disabled={ editingKey !== '' }><Icon type="delete"/></Button>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
  }

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

    const disableAddBtn = !_.isEqual(_.get(this.props, 'currentOperation.status', 1), 1);

    return (
      <div>
        <Row style={{marginBottom: 30, marginTop: 30}}>
          <Col sm={12}>
            {this.props.isAdmin ? (
              <Button onClick={ this.handleAdd } type="primary" style={ { marginBottom: 16 } }
                      disabled={ !_.isEmpty( this.state.tempDataSource ) || disableAddBtn}>
                <Icon type="dollar" /> Agregar Movimiento
              </Button>
            ) : null}
          </Col>
          <Col sm={12}>
            <Export
              currentOperation={ this.props.currentOperation }
              exportData={ this.state.exportData }
            />
          </Col>
        </Row>

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
            onChange={ this._handleChange }
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
