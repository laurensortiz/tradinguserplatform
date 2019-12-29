import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import moment from 'moment';
import momentDurationFormat from 'moment-duration-format';
import _ from 'lodash';
import uuidv1 from 'uuid/v1';
import TimePicker from 'react-datepicker';

momentDurationFormat( moment );

import { Button, Icon, Popconfirm, Table, Tag, Popover, Collapse, Tooltip } from 'antd';

const FORMAT_TIME = 'HH:mm';
const FORMAT_DATE = 'DD-MM-YYYY';
const { Panel } = Collapse;

class TableEntryTime extends Component {
  state = {
    times: [],
    weekDays: [],
    totalWeekHours: '00:00',
    currentInput: null,
  };

  currentInputSelected = '1';

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEqual( nextProps.times, prevState.times ) && !_.isEmpty( nextProps.weekDays )) {
      return {
        totalWeekHours: TableEntryTime._getTotalWeekHours( nextProps.times ),
        times: nextProps.times,
      }
    } else if (!_.isEqual( nextProps.weekDays, prevState.weekDays )) {
      TableEntryTime.currentInputSelected = '1'; // Reset current Input focus
      return {
        weekDays: nextProps.weekDays
      }
    }

    return null;
  }


  static _getTotalWeekHours = (projects) => {
    let totalProjectsWeekHours = 0;

    _.map( projects, project => {
      const totalProjectWeekHours = _.reduce( project.weekDays, (total, { time }) => {
        const dateTime = time ? moment(time).format(FORMAT_TIME) : '00:00';
        const currentTime = moment.duration( dateTime ).asMilliseconds();
        const currentTotal = moment.duration( total ).asMilliseconds();

        return currentTotal + currentTime
      }, 0 );

      totalProjectsWeekHours = totalProjectsWeekHours + totalProjectWeekHours
    } );

    return moment.duration( moment.duration( totalProjectsWeekHours ).asHours(), "hours" ).format( FORMAT_TIME )
  };

  static _getTotalWeekHoursByProject = (times) => {
    const totalHours = _.reduce( times, (total, { time }) => {
      const dateTime = time ? moment(time).format(FORMAT_TIME) : '00:00';
      const currentTime = moment.duration( dateTime ).asMilliseconds();
      const currentTotal = moment.duration( total ).asMilliseconds();

      return currentTotal + currentTime
    }, 0 );

    return moment.duration( moment.duration( totalHours ).asHours(), "hours" ).format( FORMAT_TIME )
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!_.isNil(document.getElementById(this.currentInputSelected))) {
      document.getElementById(this.currentInputSelected).focus();
    }
  }

  _onFocus = (e) => {
    this.currentInputSelected = e.id;
  };

  _onDelete = (row) => {
    const ids = _.transform( row.weekDays, (arrIds, { id }) => {
      if (_.isInteger( id )) {
        arrIds.push( id )
      }
    }, [] );

    this.props.onDeleteTime( ids );
  }


  _getCTA = (type, row) => {

    return (
      <div className="cta-container">
        <Popconfirm
          okText="Si"
          title="Está seguro ?"
          cancelText="Cancelar"
          onConfirm={ () => this._onDelete( row ) }
        >
          <Button type="danger"><Icon type="delete"/></Button>
        </Popconfirm>
      </div>
    )

  };
  _getWeekTotal = (type, row) => {
    const total = TableEntryTime._getTotalWeekHoursByProject( row.weekDays );
    return (
      <div className="total-week-container">
        { _.some( row.weekDays, { isOverTime: true } ) ? (
          <Tooltip title="Tiempo Extra" className="extra-time">
            <strong>{ total }</strong><Icon type="clock-circle"/>
          </Tooltip>
        ) : (
          <strong>{ total }</strong>
        ) }
      </div>
    )

  };

  _renderNote = (note) => {
    return (
      <Popover content={ note } title="Nota" trigger="hover">
        <Icon type="form"/>
      </Popover>
    )
  };

  _onUpdateHours = (timeId, value, row, date) => {
    const numberOfHours = moment(value).hours();

    /*
    * Only Admins are able to report more than 8 hours per day
    * */
    if (!this.props.isAdmin && (numberOfHours > 8 || numberOfHours <= 0)) {
      return
    }
    // Check if time is new
    if (_.isString( timeId ) || _.isNil( timeId )) {
      this._onAddHours( row, value, date )
    } else {
      this.props.onUpdateTime( {
        id: timeId,
        time: value,
      } )
    }
  };

  _onAddHours = (row, value, date) => {
    this.props.onSaveTime( {
      date: moment( date ).format(),
      project: {
        id: row.project.id
      },
      stage: {
        id: row.stage.id
      },
      task: {
        id: row.task.id
      },
      assignment: {
        id: row.assignment.id
      },
      isOverTime: row.isOverTime || false,
      time: value,
    } )
  };

  _getColumns = () => {

    const projectColumn = {
      title: 'Proyectos',
      render: row => {
        return (
          <Collapse
            bordered={ false }
            expandIcon={ ({ isActive }) => <Icon type="caret-right" rotate={ isActive ? 90 : 0 }/> }
            className="project-name"
          >
            <Panel header={ row.project.name } key={ row.id }>
              <Tag className="stage"><strong>Etapa:</strong> { row.stage.name }({ row.stage.code }) </Tag>
              <Tag className="task"><strong>Tarea:</strong> { row.task.name }</Tag>
              <Tag className="assignment"><strong>Asignación:</strong> { row.assignment.name }</Tag>
            </Panel>

          </Collapse>

        )
      },
      key: uuidv1()
    };

    let inputId = 0;
    const daysTitle = _.reduce( this.state.weekDays, (columns, value, key) => {

      const title = <div className="columnTitle">
        <span className="week-day">{ moment( value ).format( 'dd' ) }</span>
        <span className="date">{ moment( value ).format( 'DD MMM' ) }</span>
      </div>;

      columns.push( {
        title,
        className: moment().isSame( value, 'day' ) ? 'active' : '',
        render: row => {
          inputId = inputId + 1;
          const currentDay = _.find( row.weekDays, day => moment.utc( day.date ).isSame( value, 'day' ) );

          if (currentDay) {
            const note = !_.isEmpty( currentDay.notes ) ? this._renderNote( currentDay.notes ) : null;
            const time = currentDay.time ? moment(currentDay.time).toDate() : null;
            return (
              <div className="input-time-container">

                <TimePicker
                  id={`${inputId}`}
                  selected={time}
                  onChange={ (e) => this._onUpdateHours( currentDay.id, e, row, value ) }
                  showTimeSelect={false}
                  showTimeSelectOnly
                  timeIntervals={10}
                  timeCaption="Time"
                  dateFormat={FORMAT_TIME}
                  placeholderText="00:00"
                  onChangeRaw={event => this._onFocus(event.target)}
                />
                { note }
              </div>
            )
          }

        },
        key: uuidv1()
      } )
      return columns
    }, [] )

    const actionColumn = {
      title: 'Acciones',
      key: uuidv1(),
      render: this._getCTA
    };

    const totalColumn = {
      title: 'Total',
      key: uuidv1(),
      render: this._getWeekTotal
    };
    return [
      projectColumn,
      ...daysTitle,
      totalColumn,
      actionColumn,
    ]

  };

  _displayTableHeaderFooter = () => {
    return (
      <p className="table-header-title">Total de horas: <strong>{ this.state.totalWeekHours }</strong></p>
    )
  };

  render() {
    const columns = this._getColumns();
    return (
      <Table
        bordered={ true }
        rowKey={ record => record.id}
        columns={ columns }
        dataSource={ this.state.times }
        className="table-time-report"
        title={ this._displayTableHeaderFooter }
        footer={ this._displayTableHeaderFooter }
        scroll={ { x: true } }
        loading={ this.props.isLoading }
      />
    );
  }
}


function mapStateToProps(state) {

  return {}
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {}, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( TableEntryTime );