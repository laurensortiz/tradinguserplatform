import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import _ from 'lodash';
import classNames from 'classnames';
import Highlighter from "react-highlight-words";
import { Button, Icon, Input, Popconfirm, Table, Tag, Row, Col, Select, Radio, DatePicker, Tooltip } from 'antd';
import momentDurationFormat from 'moment-duration-format';
import moment from "moment-timezone";
import { extendMoment } from 'moment-range';
import { withNamespaces } from 'react-i18next';
import {
  Sort,
  FormatStatusLang,
  FormatDate,
  DisplayTableAmount,
  MarketBehaviorStatus,
  IsOperationPositive,
} from '../../../../common/utils';

import BulkUpdateSteps from './BulkUpdateSteps';

import { assetClassOperations } from "../../../../state/modules/assetClasses";

momentDurationFormat( moment );
extendMoment( moment );
moment.locale( 'es' ); // Set Lang to Spanish

const { Option } = Select;
const { RangePicker } = DatePicker;
const FORMAT_DATE = 'DD-MM-YYYY';

class MarketTable extends Component {
  state = {
    marketOperations: [],
    assetClasses: [],
    searchText: '',
    searchedColumn: '',
    selectedRowKeys: [],
    currentDataSource: [],
    selectedBulkUpdateType: 'status',
    bulkUpdateValue: null,
    isBulkUpdateActive: false,
    isMenuFold: true,
    filteredInfo: {},
    sortedInfo: {},
  };

  dateMode = 0;
  timeDateRange = [];
  defaultDate = null;

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {}
    if (!_.isEqual( nextProps.marketOperations, prevState.marketOperations )) {

      _.assignIn( updatedState, {
        marketOperations: nextProps.marketOperations
      } )
    }
    if (!_.isEqual( nextProps.assetClasses, prevState.assetClasses )) {
      _.assignIn( updatedState, {
        assetClasses: nextProps.assetClasses
      } )
    }
    return !_.isEmpty( updatedState ) ? updatedState : null;
  }

  componentDidMount() {
    this.props.fetchGetAssetClasses()
  }

  _getCTA = (type, row) => {
    return (
      <div className="cta-container">
        <Button type="secondary" onClick={ () => this.props.onDetail( row.id ) }><Icon type="hdd"/><span>{this.props.t('detail')}</span></Button>
      </div>
    )

  };

  getColumnSearchProps = dataIndex => ( {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={ { padding: 8 } }>
        <Input
          ref={ node => {
            this.searchInput = node;
          } }
          placeholder={ `${this.props.t('btn search')}` }
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
          {this.props.t('btn search')}
        </Button>
        <Button onClick={ () => this.handleReset( clearFilters ) } size="small" style={ { width: 90 } }>
          {this.props.t('btn clean')}
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="filter" theme="filled" style={ { color: filtered ? '#1890ff' : undefined } }/>
    ),
    onFilter: (value, record) => {

      return _.get( record, dataIndex )
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
      selectedRowKeys: []
    } );
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState( {
      searchText: '',
      selectedRowKeys: []
    } );

  };

  onSelectOperation = (selectedRowKeys) => {
    this.setState( { selectedRowKeys } )
  }

  onSelectAllOperation = (isSelected) => {
    const { currentDataSource, marketOperations } = this.state;
    const dataSource = !_.isEmpty( currentDataSource ) ? currentDataSource : marketOperations;
    const allOperationsIds = isSelected ? dataSource.map( ope => ope.id ) : []
    this.setState( { selectedRowKeys: allOperationsIds } )
  }

  onTableChange = (pagination, filters, sorter, extra) => {
    const { currentDataSource } = extra;
    this.setState( {
      currentDataSource,
      filteredInfo: filters,
      sortedInfo: sorter,
    } )
    if (this.props.isAdmin) {
      this.props.onRequestUpdateTable()
    }

  }

  onCancelBulkProcess = () => {
    this.setState( {
      isBulkUpdateActive: false,
      selectedRowKeys: [],
      selectedBulkUpdateType: 'status',
      bulkUpdateValue: null,
    } )
    this.props.onRequestUpdateTable()
  }



  _onSelectMenuFold = () => {
    this.setState({
      isMenuFold: !this.state.isMenuFold
    })
  }

  _handleActionTitle = () => {
    return (
      <div style={{textAlign: 'right'}}>
        <Row>
          <Col xs={12} style={ { textAlign: 'left' } }>
            <Tooltip placement="top" title="Sincronizar Datos">
              <Button type="primary" onClick={ () => this.props.onRequestUpdateTable() }><Icon type="history" /></Button>
            </Tooltip>
          </Col>
          <Col xs={12} style={ { textAlign: 'right' } }>
            <Button onClick={ this._onSelectMenuFold }><Icon type="swap"/></Button>
          </Col>
        </Row>
      </div>
    )
  }
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

  _displayTableFooter = () => (
    <Row>
      <Col>
        <h3>{`${this.props.t('totalOperations')}:`} <Tag color="#1b1f21" style={{fontSize: 14, marginLeft: 10}}>{_.size(this.state.marketOperations)}</Tag></h3>
      </Col>
    </Row>
  )

  render() {
    const {t} = this.props;
    const datesInTimes = _.map( this.state.marketOperations, record => moment( record.createdAt ) ),
      maxDatesInTimes = moment.max( datesInTimes ).add( 1, 'days' ),
      minDatesInTimes = moment.min( datesInTimes ).subtract( 1, 'days' );
    const showHandleClass = this.props.isAdmin ? 'show' : 'hidden';
    const {
      selectedRowKeys,
      isBulkUpdateActive,
      marketOperations,
      sortedInfo,
      filteredInfo,
      assetClasses,
    } = this.state;
    const langStatus = status => t(`status ${status}`)

    const columns = [
      {
        title: '',
        dataIndex: 'behavior',
        key: 'behavior',
        render: status => MarketBehaviorStatus( status )
      },
      {
        title: t('status'),
        dataIndex: 'status',
        key: 'status',
        filters: [
          { text: `${t('status active')}`, value: 1 },
          { text: `${t('status marketClose')}`, value: 2 },
          { text: `${t('status hold')}`, value: 3 },
          { text: `${t('status sold')}`, value: 4 },
        ],
        defaultSortOrder: 'ascend',
        onFilter: (value, record) => record.status === value,
        render: status => {
          const { name, color } = FormatStatusLang( status );
          return <Tag color={ color }>{ langStatus(name) }</Tag>
        },
        sorter: (a, b) => Sort( a.status, b.status ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: t('product'),
        dataIndex: 'product.name',
        key: 'product.name',
        render: text => <span key={ `${ text.code }-${ text.name }` }>{ `${ text.code }-${ text.name }` }</span>,
        sorter: (a, b) => Sort( a.product.name, b.product.name ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'product.name' ),
      },
      {
        title: t('derivative'),
        dataIndex: 'assetClass',
        key: 'assetClass',
        render: assetClass => <Tag color="#1b1f21">{assetClass.name}</Tag>,
        filters: assetClasses.map(({name}) => {
          return {
            text: name,
            value: name
          }
        }),
        filteredValue: filteredInfo.assetClass || null,
        onFilter: (value, record) => record.assetClass.name.includes(value),
        sorter: (a, b) => Sort(a.assetClass.name.length,b.assetClass.name.length ),
        ellipsis: true,
      },
      {
        title: t('username'),
        dataIndex: 'userAccount.user.username',
        key: 'userAccount.user.username',
        className: `${ showHandleClass } `,
        sorter: (a, b) => Sort( a.userAccount.user.username, b.userAccount.user.username ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'userAccount.user.username' ),
      },
      {
        title: t('firstName'),
        dataIndex: 'userAccount.user.firstName',
        key: 'userAccount.user.firstName',
        render: text => <span key={ text }>{ text }</span>,
        sorter: (a, b) => Sort( a.userAccount.user.firstName, b.userAccount.user.firstName ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'userAccount.user.firstName' ),
      },
      {
        title: t('lastName'),
        dataIndex: 'userAccount.user.lastName',
        key: 'userAccount.user.lastName',
        render: text => <span key={ text }>{ text }</span>,
        sorter: (a, b) => Sort( a.userAccount.user.lastName, b.userAccount.user.lastName ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'userAccount.user.lastName' ),
      },
      {
        title: t('currentAmount'),
        key: 'amount',
        render: data => <span
          className={ IsOperationPositive( data.amount, data.initialAmount ) ? 'positive txt-highlight' : 'negative txt-highlight' }
          key={ data.amount }>{ DisplayTableAmount( data.amount ) }</span>,
        sorter: (a, b) => Sort( a.amount, b.amount ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: t('investment'),
        dataIndex: 'initialAmount',
        key: 'initialAmount',
        render: initialAmount => <span key={ initialAmount }>{ DisplayTableAmount( initialAmount ) }</span>,
        sorter: (a, b) => Sort( a.initialAmount, b.initialAmount ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: t('maintenanceMargin'),
        dataIndex: 'maintenanceMargin',
        key: 'maintenanceMargin',
        render: maintenanceMargin => <span key={ maintenanceMargin }>{ DisplayTableAmount( maintenanceMargin ) }</span>,
        sorter: (a, b) => Sort( a.maintenanceMargin, b.maintenanceMargin ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: t('takingProfit'),
        dataIndex: 'takingProfit',
        key: 'takingProfit',
        render: takingProfit => <span key={ takingProfit }>{ DisplayTableAmount( takingProfit ) }</span>,
        sorter: (a, b) => Sort( a.takingProfit, b.takingProfit ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'takingProfit' ),
      },
      {
        title: t('createdAt'),
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
        title: t('updatedAt'),
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: value => moment(value).tz('America/New_York').format('DD-MM-YYYY'),
        editable: true,
        inputType: 'date',
        required: false,
        rowKey: d => {
          return FormatDate( d.updatedAt )
        },
        sorter: (a, b) => {
          return this._sortDates( a.updatedAt, b.updatedAt );
        },
        ...this._getColumnDateProps(
          'updatedAt',
          minDatesInTimes,
          maxDatesInTimes,
        )
      },
      {
        title: t('broker'),
        dataIndex: 'broker.name',
        key: 'broker.name',
        sorter: (a, b) => Sort( a.broker.name, b.broker.name ),
        sortDirections: [ 'descend', 'ascend' ],
        ...this.getColumnSearchProps( 'broker.name' ),
      },
      {
        title: this._handleActionTitle,
        key: 'actions',
        render: this._getCTA,
        fixed: 'right',
        className: 't-a-r fixed-table-actions-panel'
      },
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectOperation,
      onSelectAll: this.onSelectAllOperation
    };

    return (
      <>
        <Table
          rowSelection={ isBulkUpdateActive ? rowSelection : null }
          rowKey={ record => record.id }
          columns={ columns }
          dataSource={ this.state.marketOperations }
          loading={ this.props.isLoading }
          scroll={ { x: true } }
          className={ classNames( { 'hidden-table': !this.props.isAdmin && _.isEmpty( this.state.marketOperations ), 'is-menu-fold': this.state.isMenuFold } ) }
          onChange={ this.onTableChange }
          footer={this._displayTableFooter}
        />
      </>
    );
  }
}


function mapStateToProps(state) {
  return {
    assetClasses: state.assetClassesState.list,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetAssetClasses: assetClassOperations.fetchGetAssetClasses
  }, dispatch );

export default connect( mapStateToProps, mapDispatchToProps )( withNamespaces()(MarketTable) );
