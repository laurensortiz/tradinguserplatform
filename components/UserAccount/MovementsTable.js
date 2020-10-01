import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { Button, Table, Form, Popconfirm, Icon, Select, DatePicker, Row, Col } from 'antd';
import _ from 'lodash';
import uuidv1 from 'uuid/v1';
import moment from 'moment-timezone';

import momentDurationFormat from 'moment-duration-format';
import { extendMoment } from 'moment-range';

import { EditableProvider, EditableConsumer } from './editable/editableContext';
import EditableCell from './editable/editableCell';

import { FormatCurrency, FormatDate, GetGP, getGPInversion } from '../../common/utils';

import { userAccountMovementOperations } from '../../state/modules/userAccountMovement';

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
    filteredInfo: {},
    sortedInfo: {},
    searchText: '',
    isCompleted: false,
    actionType: ''
  };

  dateMode = 0;
  timeDateRange = [];
  defaultDate = null;


  isEditing = record => record.id === this.state.editingKey;

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {};



    if(nextProps.isCompleted && !_.isEmpty(prevState.actionType)) {

      const {id} = nextProps.selectedAccount;
      nextProps.fetchGetUserAccountMovements(id);

      _.assignIn( updatedState, {
        actionType: '',
      } )
    }


    if (!_.isEqual( nextProps.movements, prevState.dataSource )) {

      _.assignIn( updatedState, {
        dataSource: nextProps.movements,
        count: _.size( nextProps.movements ),
        tempDataSource: [],
        editingKey: '',
      } )

    }

    if (!_.isEqual( nextProps.isCompleted, prevState.isCompleted )) {
      _.assignIn( updatedState, {
        isCompleted: nextProps.isCompleted,
        tempDataSource: [],
        editingKey: '',
      } )

      nextProps.resetAfterMovementRequest();
    }



    return !_.isEmpty( updatedState ) ? updatedState : null;
  }

  componentDidMount() {
    const {id} = this.props.selectedAccount;
    this.props.fetchGetUserAccountMovements(id)
  }


  handleDelete = key => {
    if (_.isString( key )) {
      this.cancel()
    } else {
      this._handleDeleteMovement( Number( key ) );
    }
  };

  _handleChange = (pagination, filters, sorter, extra) => {
    this.setState( {
      exportData: extra.currentDataSource,
    } );
  };

  handleAdd = () => {
    const newMovement = {
      id: uuidv1(),
      debit: DEFAULT_INPUT_TEXT,
      credit: DEFAULT_INPUT_TEXT,
      reference: DEFAULT_INPUT_TEXT,
      accountValue: DEFAULT_INPUT_TEXT,
      createdAt: moment.parseZone(),
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
    } );
  };

  save = (key) => {
    this.props.form.validateFields( (error, row) => {
      if (error) {
        return;
      }

      const newMovement = _.first( this.state.tempDataSource );
      const newData = {
        ...newMovement,
        ...row,
        id: key
      };

      if (_.isString( key )) {
        this._handleAddMovement( newData )
      } else {
        this._handleEditMovement( newData )
      }
    } );
  };

  edit = (key) => {
    this.setState( { editingKey: key } );
  };


  _onChangeInput = (value) => {
    if (!_.isNumber( this.state.editingKey )) {
      const tempData = _.first( this.state.tempDataSource );

      const tempDataSourceUpdate = {
        ...tempData,
      };

      this.setState( {
        tempDataSource: [ tempDataSourceUpdate ]
      } )
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
      return _.includes( dateRange, moment.parseZone( _.get( record, dataIndex ) ).format( FORMAT_DATE ) )
    }

  };

  _createDateRange = (date, setSelectedKeys, minDate, maxDate, dataIndex) => {
    this.defaultDate = moment.parseZone( date );

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
    const datesInTimes = _.map( this.state.dataSource, record => moment( record.createdAt ) ),
      maxDatesInTimes = moment.max( datesInTimes ).add( 1, 'days' ),
      minDatesInTimes = moment.min( datesInTimes ).subtract( 1, 'days' );
    const showBasedAdmin = this.props.isAdmin ? 'show' : 'hidden';
    return [
      {
        title: 'Débito',
        dataIndex: 'debit',
        key: 'debit',
        render: value => FormatCurrency.format( value ),
        editable: true,
        required: false,
        inputType: 'number',
      },
      {
        title: 'Crédito',
        dataIndex: 'credit',
        key: 'credit',
        render: value => FormatCurrency.format( value ),
        editable: true,
        required: false,
        inputType: 'number'
      },

      {
        title: 'Valor de la Cuenta',
        dataIndex: 'accountValue',
        key: 'accountValue',
        render: value => FormatCurrency.format( value ),
        editable: true,
        required: true,
        inputType: 'number'
      },
      {
        title: 'Detalle',
        dataIndex: 'reference',
        key: 'reference',
        editable: true,
        required: false,
        inputType: 'text'
      },
      {
        title: 'Fecha de movimiento',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: value => moment(value).tz('America/New_York').format('DD-MM-YYYY'),
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
        className: `${ showBasedAdmin }`,
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
              <Button type="secondary" disabled={ editingKey !== '' } onClick={ () => this.edit( record.key ) }><Icon
                type="edit"/></Button>
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
  };

  /**
   * Add Movements
   */
  _handleAddMovement = (newMovement) => {
    const { id: userAccountId } = this.props.selectedAccount;
    const { debit , credit, accountValue } = newMovement;
    this.setState({
      actionType: 'add'
    })
    this.props.fetchAddUserAccountMovement( {
      ...newMovement,
      userAccountId,
      debit: parseFloat( debit || 0.00 ).toFixed( 2 ),
      credit: parseFloat( credit || 0.00 ).toFixed( 2 ),
      accountValue: parseFloat( accountValue || 0.00 ).toFixed( 2 ),
    } )
  };

  /**
   * Edit Movements
   */
  _handleEditMovement = (newMovement) => {
    const { debit, credit, accountValue, reference, createdAt, id } = newMovement;
    this.setState({
      actionType: 'edit'
    })
    this.props.fetchEditUserAccountMovement( {
      id,
      reference,
      debit: parseFloat( debit ).toFixed( 2 ),
      credit: parseFloat( credit ).toFixed( 2 ),
      accountValue: parseFloat( accountValue ).toFixed( 2 ),
      createdAt: moment.parseZone( createdAt ),
    } )
  };

  /**
   * Delete Movements
   */
  _handleDeleteMovement = (movementId) => {
    this.setState({
      actionType: 'delete'
    })
    this.props.fetchDeleteUserAccountMovement( movementId )
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
          onPressEnter: () => this.save( record.id )
        } ),
      };
    } );

    const disableAddBtn = !_.isEqual( _.get( this.props, 'selectedAccount.status', 1 ), 1 );
    return (
      <div>
        <Row style={ { marginBottom: 30, marginTop: 30 } }>
          <Col sm={ 12 }>
            { this.props.isAdmin ? (
              <Button onClick={ this.handleAdd } type="primary" style={ { marginBottom: 16 } }
                      disabled={ !_.isEmpty( this.state.tempDataSource ) || disableAddBtn }>
                <Icon type="bank"/> Agregar Transferencia
              </Button>
            ) : null }
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
  const { userAccountMovementsState } = state;
  return {
    movements: state.userAccountMovementsState.list,
    isSuccess: state.userAccountMovementsState.isSuccess,
    messageMovements: state.userAccountMovementsState.message,
    isLoading: state.userAccountMovementsState.isLoading,
    isCompleted: state.userAccountMovementsState.isCompleted,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetUserAccountMovements: userAccountMovementOperations.fetchGetUserAccountMovements,
    fetchAddUserAccountMovement: userAccountMovementOperations.fetchAddUserAccountMovement,
    fetchEditUserAccountMovement: userAccountMovementOperations.fetchEditUserAccountMovement,
    fetchDeleteUserAccountMovement: userAccountMovementOperations.fetchDeleteUserAccountMovement,
    resetAfterMovementRequest: userAccountMovementOperations.resetAfterRequest,
  }, dispatch );

export default connect( mapStateToProps, mapDispatchToProps )( Form.create()( MovementsTable ) );
