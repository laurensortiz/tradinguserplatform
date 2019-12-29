import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import moment from 'moment';
import momentDurationFormat from 'moment-duration-format';
import { extendMoment } from 'moment-range';
import _ from 'lodash';
import XLSX from 'xlsx';
import uuidv1 from 'uuid/v1';

momentDurationFormat( moment );
extendMoment( moment );
moment.locale( 'es' ); // Set Lang to Spanish

import {
  Button,
  Icon,
  Table,
  Collapse,
  Select,
  DatePicker,
  Col,
  Row,
  Badge,
  Tooltip,
} from 'antd';

const FORMAT_TIME = 'HH:mm';
const FORMAT_DATE = 'DD-MM-YYYY';
const { Option } = Select;
const { RangePicker } = DatePicker;

const EXCEL_HEADER = [
  'user',
  'date',
  'project',
  'projectStartDate',
  'projectEndDate',
  'projectTotalHoursQuoted',
  'totalReported',
  'projectCategory',
  'projectScope',
  'stage',
  'assignment',
  'task',
  'country'
];

const addCommentToCell = (context, column, comment) => {
  if (!context[ column ].c) context[ column ].c = [];

  context[ column ].c.hidden = true;
  return context[ column ].c.push( { t: comment } );
};

const getExportFileName = (orgId) => {
  const time = moment().format();
  return `reporte_${ time }.xlsx`
};

class TableReportTime extends Component {

  state = {
    times: [],
    totalReportedHours: '00:00',
    filteredInfo: {},
    sortedInfo: {},
    searchText: '',
    isDisable: false,
    exportData: [],
  };

  dateMode = 0;
  timeDateRange = [];
  projectStartDateRange = [];
  projectEndDateRange = [];
  defaultDate = null;
  clearFilterDatesBtn = React.createRef();

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEqual( nextProps.times, prevState.times )) {

      return {
        times: nextProps.times,
        exportData: nextProps.times,
        totalReportedHours: TableReportTime._getTotalReportedHours( nextProps.times )
      }
    } else {
      return null;
    }
  }

  static _getTotalWeekHours = (projects) => {
    let totalProjectsWeekHours = 0;

    _.map( projects, project => {
      const totalProjectWeekHours = _.reduce( project.weekDays, (total, { time }) => {
        const dateTime = time ? moment( time ).format( FORMAT_TIME ) : '00:00';
        const currentTime = moment.duration( dateTime ).asMilliseconds();
        const currentTotal = moment.duration( total ).asMilliseconds();

        return currentTotal + currentTime
      }, 0 );

      totalProjectsWeekHours = totalProjectsWeekHours + totalProjectWeekHours
    } );

    return moment.duration( moment.duration( totalProjectsWeekHours ).asHours(), "hours" ).format( FORMAT_TIME )
  };

  static _getTotalReportedHours = (times) => {

    const totalHours = _.reduce( times, (total, { time }) => {
      const dateTime = time ? moment( time ).format( FORMAT_TIME ) : '00:00';
      const currentTime = moment.duration( dateTime ).asMilliseconds();
      const currentTotal = moment.duration( total ).asMilliseconds();

      return currentTotal + currentTime
    }, 0 );

    return moment.duration( moment.duration( totalHours ).asHours(), "hours" ).format( FORMAT_TIME )
  };

  _timesReport = (data) => {
    return _.map( data, timeItem => {
      return {
        user: timeItem.user.username,
        date: moment( timeItem.date ).format( FORMAT_DATE ),
        project: timeItem.project.name,
        projectStartDate: !_.isNil( timeItem.project.startDate ) ? moment( timeItem.project.startDate ).format( FORMAT_DATE ) : '',
        projectEndDate: !_.isNil( timeItem.project.endDate ) ? moment( timeItem.project.endDate ).format( FORMAT_DATE ) : '',
        projectTotalHoursQuoted: timeItem.project.totalHoursQuoted,
        totalReported: moment( timeItem.time ).format( FORMAT_TIME ),
        projectCategory: `${ timeItem.project.category.name } (${ timeItem.project.category.code })`,
        projectScope: `${ timeItem.project.scope.name } (${ timeItem.project.scope.code })`,
        stage: `${ timeItem.stage.name } (${ timeItem.stage.code })`,
        assignment: timeItem.assignment.name,
        task: timeItem.task.name,
        country: `${ timeItem.project.country.name } (${ timeItem.project.country.code })`,
      }
    } );
  };

  _downloadFile = (columns) => {
    const { exportData } = this.state;
    const workbook = this._timesReport( exportData );

    //Define template structure
    const ws = XLSX.utils.json_to_sheet(
      workbook,
      {
        header: EXCEL_HEADER,
      } );
    const wb = XLSX.utils.book_new();
    if (!wb.Props) wb.Props = {};

    wb.Props.Title = "Reporte de Horas";

    _.map( columns, ({ col, title }) => {

      if (ws[ `${ col }` ]) {
        return ws[ `${ col }` ].v = title
      }
      ;

    } );

    XLSX.utils.sheet_add_aoa( ws, [
      [ 'Total', '', '', '', '', '', this.state.totalReportedHours ]
    ], { origin: -1 } );

    XLSX.utils.book_append_sheet( wb, ws, "Reporte" );
    // Generate XLSX file and send to client
    XLSX.writeFile( wb, getExportFileName() );
    //this.props.resetExportCharges();
  }

  _getFilterValues = (context) => {
    const uniqValues = _
      .chain( this.state.times )
      .map( item => _.get( item, context ) )
      .uniq()
      .value();
    return _.map( uniqValues, name => {
      return {
        text: name,
        value: name,
      }
    } )
  };

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

    let dateRange = this.timeDateRange;
    switch (dataIndex) {
      case 'date':
        dateRange = this.timeDateRange;
        break;
      case 'project.startDate':
        dateRange = this.projectStartDateRange;
        break;
      case 'project.endDate':
        dateRange = this.projectEndDateRange;
        break;
      default:
        dateRange = this.timeDateRange;
    }

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

    switch (dataIndex) {
      case 'date':
        this.timeDateRange = dateRange;
        break;
      case 'project.startDate':
        this.projectStartDateRange = dateRange;
        break;
      case 'project.endDate':
        this.projectEndDateRange = dateRange;
        break;
      default:
    }

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
    const datesInTimes = _.map( this.state.times, record => moment( record.date ) ),
      maxDatesInTimes = moment.max( datesInTimes ).add( 1, 'days' ),
      minDatesInTimes = moment.min( datesInTimes ).subtract( 1, 'days' );

    return [
      {
        title: 'Usuario',
        col: 'A1',
        dataIndex: 'user',
        key: 'user',
        sortDirections,
        sorter: (a, b) => a.user.username.length - b.user.username.length,
        sortOrder: _.get( this.state.sortedInfo, 'columnKey' ) === 'user' && this.state.sortedInfo.order,
        filters: this._getFilterValues( 'user.username' ),
        filteredValue: _.get( this.state.filteredInfo, 'user' ) || null,
        onFilter: (value, record) => record.user.username.includes( value ),
        render: row => row.username
      },
      {
        title: 'Fecha',
        col: 'B1',
        dataIndex: 'date',
        key: 'date',
        rowKey: d => {
          return moment.utc( d.date ).format( FORMAT_DATE )
        },
        sorter: (a, b) => {
          return this._sortDates( a.date, b.date );
        },
        sortOrder: _.get( this.state.sortedInfo, 'columnKey' ) === 'date' && this.state.sortedInfo.order,

        render: date => moment.utc( date ).format( FORMAT_DATE ),
        ...this._getColumnDateProps(
          'date',
          minDatesInTimes,
          maxDatesInTimes,
        )
      },
      {
        title: 'Proyecto',
        col: 'C1',
        dataIndex: 'project',
        key: 'project',
        filters: this._getFilterValues( 'project.name' ),
        filteredValue: _.get( this.state.filteredInfo, 'project' ) || null,
        onFilter: (value, record) => record.project.name.includes( value ),
        sortDirections,
        sorter: (a, b) => a.project.name.length - b.project.name.length,
        sortOrder: _.get( this.state.sortedInfo, 'columnKey' ) === 'project' && this.state.sortedInfo.order,
        render: ({name, status}) => (
          <span>
            {status === 0 ? (
              <Tooltip placement="topRight" title="Inactivo">
                <Badge dot>{name}</Badge>
              </Tooltip>
            ) : name
            }
          </span>

        )
      },
      {
        title: 'Fecha de Inicio',
        col: 'D1',
        dataIndex: 'project',
        key: 'project.startDate',
        rowKey: d => {
          return moment.utc( d.project.startDate ).format( FORMAT_DATE )
        },
        sorter: (a, b) => {
          return this._sortDates( a.project.startDate, b.project.startDate );
        },
        sortOrder: _.get( this.state.sortedInfo, 'columnKey' ) === 'project.startDate' && this.state.sortedInfo.order,

        render: project => moment.utc( project.startDate ).format( FORMAT_DATE ),
        ...this._getColumnDateProps(
          'project.startDate',
          minDatesInTimes,
          maxDatesInTimes,
        )
      },
      {
        title: 'Fecha Final',
        col: 'E1',
        dataIndex: 'project',
        key: 'project.endDate',
        rowKey: d => {
          return moment.utc( d.project.endDate ).format( FORMAT_DATE )
        },
        sorter: (a, b) => {
          return this._sortDates( a.project.endDate, b.project.endDate );
        },
        sortOrder: _.get( this.state.sortedInfo, 'columnKey' ) === 'project.endDate' && this.state.sortedInfo.order,

        render: project => !_.isEmpty( project.endDate ) ? moment.utc( project.endDate ).format( FORMAT_DATE ) : 'Sin Registro',
        ...this._getColumnDateProps(
          'project.endDate',
          minDatesInTimes,
          maxDatesInTimes,
        )
      },
      {
        title: 'Horas Cotizadas',
        col: 'F1',
        dataIndex: 'project',
        key: 'totalHoursQuoted',
        sorter: (a, b) => a.project.totalHoursQuoted - b.project.totalHoursQuoted,
        sortOrder: _.get( this.state.sortedInfo, 'columnKey' ) === 'totalHoursQuoted' && this.state.sortedInfo.order,
        render: project => project.totalHoursQuoted
      },
      {
        title: 'Horas Reportadas',
        col: 'G1',
        key: 'time',
        sorter: (a, b) => this._sortDates( a.time, b.time ),
        sortOrder: _.get( this.state.sortedInfo, 'columnKey' ) === 'time' && this.state.sortedInfo.order,
        render: project => moment( project.time ).format( FORMAT_TIME )
      },
      {
        title: 'Categoría',
        col: 'H1',
        dataIndex: 'project',
        key: 'project.category',
        sortDirections,
        sorter: (a, b) => a.project.category.name.length - b.project.category.name.length,
        sortOrder: _.get( this.state.sortedInfo, 'columnKey' ) === 'project.category' && this.state.sortedInfo.order,
        filters: this._getFilterValues( 'project.category.name' ),
        filteredValue: _.get( this.state.filteredInfo, 'project.category' ) || null,
        onFilter: (value, record) => record.project.category.name.includes( value ),
        render: project => `${ project.category.name } (${ project.category.code })`
      },
      {
        title: 'Alcance',
        col: 'I1',
        dataIndex: 'project',
        key: 'project.scope',
        sortDirections,
        sorter: (a, b) => a.project.scope.name.length - b.project.scope.name.length,
        sortOrder: _.get( this.state.sortedInfo, 'columnKey' ) === 'project.scope' && this.state.sortedInfo.order,
        filters: this._getFilterValues( 'project.scope.name' ),
        filteredValue: _.get( this.state.filteredInfo, 'project.scope' ) || null,
        onFilter: (value, record) => record.project.scope.name.includes( value ),
        render: project => `${ project.scope.name } (${ project.scope.code })`
      },
      {
        title: 'Etapa',
        col: 'J1',
        dataIndex: 'stage',
        key: 'stage',
        sortDirections,
        sorter: (a, b) => a.stage.name.length - b.stage.name.length,
        sortOrder: _.get( this.state.sortedInfo, 'columnKey' ) === 'stage' && this.state.sortedInfo.order,
        filters: this._getFilterValues( 'stage.name' ),
        filteredValue: _.get( this.state.filteredInfo, 'stage' ) || null,
        onFilter: (value, record) => record.stage.name.includes( value ),
        render: stage => `${ stage.name } (${ stage.code })`
      },
      {
        title: 'Labor',
        col: 'K1',
        dataIndex: 'assignment',
        key: 'assignment',
        sortDirections,
        sorter: (a, b) => a.assignment.name.length - b.assignment.name.length,
        sortOrder: _.get( this.state.sortedInfo, 'columnKey' ) === 'assignment' && this.state.sortedInfo.order,
        filters: this._getFilterValues( 'assignment.name' ),
        filteredValue: _.get( this.state.filteredInfo, 'assignment' ) || null,
        onFilter: (value, record) => record.assignment.name.includes( value ),
        render: assignment => `${ assignment.name }`
      },
      {
        title: 'Tarea',
        col: 'L1',
        dataIndex: 'task',
        key: 'task',
        sortDirections,
        sorter: (a, b) => a.task.name.length - b.task.name.length,
        sortOrder: _.get( this.state.sortedInfo, 'columnKey' ) === 'task' && this.state.sortedInfo.order,
        filters: this._getFilterValues( 'task.name' ),
        filteredValue: _.get( this.state.filteredInfo, 'task' ) || null,
        onFilter: (value, record) => record.task.name.includes( value ),
        render: task => `${ task.name }`
      },
      {
        title: 'País',
        col: 'M1',
        dataIndex: 'project',
        key: 'project.country',
        sortDirections,
        sorter: (a, b) => a.project.country.name.length - b.project.country.name.length,
        sortOrder: _.get( this.state.sortedInfo, 'columnKey' ) === 'project.country' && this.state.sortedInfo.order,
        filters: this._getFilterValues( 'project.country.name' ),
        filteredValue: _.get( this.state.filteredInfo, 'project.country' ) || null,
        onFilter: (value, record) => record.project.country.name.includes( value ),
        render: project => `${ project.country.name } (${ project.country.code })`
      },

    ]

  };

  _displayTableHeader = (columns) => {
    return (
      <Row>
        <Col sm={ 12 }>
          <Button
            onClick={ this._clearAll }
          >
            <Icon type="delete" /> Limpiar Filtros
          </Button>
        </Col>
        <Col sm={ 12 }>
          <Button
            type="primary"
            onClick={ () => this._downloadFile( columns ) }
            data-testid="export-button"
            className="export-excel-cta"
            style={ { float: 'right' } }
          >
            <Icon type="file-excel"/> Exportar
          </Button>
        </Col>
      </Row>
    )
  };

  _displayTableFooter = () => {
    return (
      <p className="table-report-total-hours">Total de horas
        reportadas: <strong>{ this.state.totalReportedHours }</strong></p>
    )
  };

  _handleChange = (pagination, filters, sorter, extra) => {
    this.setState( {
      filteredInfo: filters,
      sortedInfo: sorter,
      exportData: extra.currentDataSource,
      totalReportedHours: TableReportTime._getTotalReportedHours( extra.currentDataSource )
    } );
  };

  _handleFilterChange = (filteredDataSource, activeFilters) => {
    this.setState( {
      exportData: filteredDataSource,
      totalReportedHours: TableReportTime._getTotalReportedHours( filteredDataSource )
    } );
  };

  _clearAll = () => {
    this.dateMode = 0;
    this.timeDateRange = [];
    this.defaultDate = null;
    this.clearFilterDatesBtn.handleClick();
    this.setState( {
      filteredInfo: {},
      sortedInfo: {},
      searchText: '',
      totalReportedHours: TableReportTime._getTotalReportedHours( this.state.times )
    } );

  };


  render() {
    const columns = this._getColumns();

    return (
      <div>
        <Table
          id="table-report"
          bordered={ true }
          rowKey={ record => record.id }
          columns={ columns }
          dataSource={ this.state.times }
          className="table-time-report"
          title={ () => this._displayTableHeader( columns ) }
          footer={ this._displayTableFooter }
          scroll={ { x: true } }
          onChange={ this._handleChange }
          onFilter={ this._handleFilterChange }
          loading={ this.props.isLoading }
          locale={ { filterConfirm: 'Filtrar', filterReset: 'Limpiar' } }
        />
      </div>

    );
  }
}


function mapStateToProps(state) {

  return {}
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {}, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( TableReportTime );