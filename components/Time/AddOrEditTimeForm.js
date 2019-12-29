import React, { PureComponent } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import TimePicker from 'react-datepicker';

import { Input, Button, Form, Switch, Select, DatePicker, Row, Col, Alert } from 'antd';


const { Option } = Select;
const { TextArea } = Input;
const FORMAT_TIME = 'HH:mm';
const FORMAT_DATE = 'DD-MM-YYYY';
const INIT_TIME_STATE = {
  date: '',
  project: {
    id: 0,
    name: ''
  },
  stage: {
    id: 1, // 1 default
    name: ''
  },
  task: {
    id: 0,
    name: ''
  },
  assignment: {
    id: 0,
    name: ''
  },
  scope: {
    id: 0
  },
  time: null,
  isOverTime: false,
  notes: '',
};

class AddOrEditTimeForm extends PureComponent {
  state = {
    timeEntry: INIT_TIME_STATE,
    projects: [],
    assignments: [],
    stages: [],
    tasks: [],
    currentTimesReported: [],
    isAlertUniqTimeVisible: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let stateUpdated = {};

    if (!_.isEqual( nextProps.projects, prevState.projects )) {
      stateUpdated.projects = nextProps.projects;
    }

    if (!_.isEqual( nextProps.assignments, prevState.assignments )) {
      stateUpdated.assignments = nextProps.assignments;
    }

    if (!_.isEqual( nextProps.stages, prevState.stages )) {
      stateUpdated.stages = nextProps.stages;
    }

    if (!_.isEqual( nextProps.tasks, prevState.tasks )) {
      stateUpdated.tasks = nextProps.tasks;
    }

    return !_.isEmpty( stateUpdated ) ? stateUpdated : null;

  }

  componentDidMount() {
    this._handleFormatCurrentTimesReported();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    if (!_.isEqual( prevState.timeEntry.stage.id, this.state.timeEntry.stage.id ) || !_.isEqual( prevState.timeEntry.scope.id, this.state.timeEntry.scope.id )) {
      this.props.onRequestTasks( {
        stageId: this.state.timeEntry.stage.id,
        scopeId: this.state.timeEntry.scope.id,
      } )
    }

    if (!_.isEmpty( this.props.times )) {
      this._handleUniqTimeEntry();
    }


  }

  _handleFormatCurrentTimesReported = () => {
    const currentTimesReported = _
      .chain( this.props.times )
      .uniqBy( ({ weekDays }) => weekDays )
      .reduce( (total, { weekDays }) => {
        _.map( weekDays, day => {
          total.push( {
            isOverTime: day.isOverTime || false,
            assignment: {
              id: day.assignmentId
            },
            date: moment( day.date ).format( FORMAT_DATE ),
            project: {
              id: day.projectId
            },
            stage: {
              id: day.stageId
            },
            task: {
              id: day.taskId
            },
          } )
        } );
        return total
      }, [] )
      .value();

    this.setState( {
      currentTimesReported
    } )
  };

  _handleUniqTimeEntry = () => {
    const { timeEntry, currentTimesReported } = this.state;
    const timeEntryForVerify = {
      date: moment( timeEntry.date ).format( FORMAT_DATE ),
      assignment: { id: timeEntry.assignment.id },
      isOverTime: timeEntry.isOverTime,
      project: { id: timeEntry.project.id },
      stage: { id: timeEntry.stage.id },
      task: { id: timeEntry.task.id },
    };

    const check = _.some( currentTimesReported, timeEntryForVerify );

    if (!_.isEqual( this.state.isAlertUniqTimeVisible, check )) {
      this.setState( {
        isAlertUniqTimeVisible: check
      } )
    }
  };

  _handleChangeSelect = (event) => {
    const { value } = event;
    const fieldName = event.name;
    const codeIdName = value.split( '-' );

    const id = Number( codeIdName[ 0 ] );
    const name = codeIdName[ 1 ];

    // Set the Project Scope ID
    if (_.isEqual( fieldName, 'project' )) {
      this._setScopeProject( name, id );
      return
    }

    this.setState( {
      timeEntry: {
        ...this.state.timeEntry,
        [ fieldName ]: {
          id,
          name,
        }
      }
    } );

  };

  _setScopeProject = (name, id) => {
    const projectSelected = _.find( this.props.projects, { id } );

    this.setState( {
      timeEntry: {
        ...this.state.timeEntry,
        project: {
          name,
          id,
        },
        scope: {
          id: projectSelected.scopeId
        }
      }
    } )
  };

  _handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields( (err, values) => {
      if (!err) {
        this.props.onSaveTime( this.state.timeEntry )
      }
    } );

  };

  _getSelectOption = options => {
    return _.map( options, ({ id, name, status = 1 }) => status ?
      <Option key={ `${ id }-${ name }` }>{ name }</Option> : null )
  };

  _setDate = (dateSelected) => {
    const date = moment( dateSelected ).set( { hour: 0, minute: 0, second: 0, millisecond: 0 } );
    this.setState( {
      timeEntry: {
        ...this.state.timeEntry,
        date,
      }
    } );
  };

  _onSelectTime = (timeSelected) => {
    const numberOfHours = moment(timeSelected).hours();

    if (this.props.isAdmin && numberOfHours > 0) {
      this.setState( {
        timeEntry: {
          ...this.state.timeEntry,
          time: timeSelected
        }
      } );
      return;
    }

    if (numberOfHours < 9 && numberOfHours > 0) {
      this.setState( {
        timeEntry: {
          ...this.state.timeEntry,
          time: timeSelected
        }
      } );
    }

  };

  _onSelectOverTime = (bool) => {
    this.setState( {
      timeEntry: {
        ...this.state.timeEntry,
        isOverTime: bool
      }
    } );
  };

  _onChangeNotes = ({ target: { value } }) => {
    this.setState( {
      timeEntry: {
        ...this.state.timeEntry,
        notes: value
      }
    } );
  };

  _getAlertMessage = () => {
    return (
      <Alert
        message="Ya cuenta con este registro"
        description="Debe modificar la información para generar un nuevo registro"
        type="warning"
        showIcon
      />
    )
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const { assignments, projects, stages, tasks } = this.state;

    const dateInitValue = !_.isEmpty( this.state.timeEntry.date ) ? this.state.timeEntry.date : undefined;
    const assignmentInitValue = !_.isEmpty( this.state.timeEntry.assignment.name ) ? this.state.timeEntry.assignment.name : undefined;
    const projectInitValue = !_.isEmpty( this.state.timeEntry.project.name ) ? this.state.timeEntry.project.name : undefined;
    const stageInitValue = !_.isEmpty( this.state.timeEntry.stage.name ) ? this.state.timeEntry.stage.name : undefined;
    const taskInitValue = !_.isEmpty( this.state.timeEntry.task.name ) ? this.state.timeEntry.task.name : undefined;
    const alertMessage = this.state.isAlertUniqTimeVisible ? this._getAlertMessage() : null;

    return (
      <div>
        <Form onSubmit={ this._handleSubmit } className="auth-form">

          <Form.Item>
            { getFieldDecorator( 'date', {
              initialValue: dateInitValue,
              rules: [ { required: true, message: 'Por favor ingrese la fecha' } ],

            } )(
              <DatePicker onChange={ this._setDate } placeholder="Fecha"/>
            ) }
          </Form.Item>
          <Form.Item>
            { getFieldDecorator( 'project', {
              initialValue: projectInitValue,
              rules: [ { required: true, message: 'Por favor ingrese el proyecto' } ],
            } )(
              <Select name="project" onChange={ value => this._handleChangeSelect( { name: 'project', value } ) }
                      placeholder="Proyecto">
                { this._getSelectOption( projects ) }
              </Select>
            ) }
          </Form.Item>
          <Form.Item>
            { getFieldDecorator( 'stage', {
              initialValue: stageInitValue,
              rules: [ { required: true, message: 'Por favor ingrese la etapa' } ],
            } )(
              <Select name="stage" onChange={ value => this._handleChangeSelect( { name: 'stage', value } ) }
                      placeholder="Etapa">
                { this._getSelectOption( stages ) }
              </Select>
            ) }
          </Form.Item>
          <Form.Item>
            { getFieldDecorator( 'task', {
              initialValue: taskInitValue,
              rules: [ { required: true, message: 'Por favor ingrese la tarea' } ],
            } )(
              <Select name="task" onChange={ value => this._handleChangeSelect( { name: 'task', value } ) }
                      placeholder="Tarea">
                { this._getSelectOption( tasks ) }
              </Select>
            ) }
          </Form.Item>
          <Form.Item>
            { getFieldDecorator( 'assignment', {
              initialValue: assignmentInitValue,
              rules: [ { required: true, message: 'Por favor ingrese la labor' } ],
            } )(
              <Select name="assignment" onChange={ value => this._handleChangeSelect( { name: 'assignment', value } ) }
                      placeholder="Labores">
                { this._getSelectOption( assignments ) }
              </Select>
            ) }
          </Form.Item>
          <Row>
            <Col sm={ 12 }>
              <Form.Item>
                { getFieldDecorator( 'time', {
                  rules: [ { required: true, message: 'Por favor ingrese las horas' } ],
                } )(
                  <TimePicker
                    selected={ this.state.timeEntry.time }
                    onChange={ this._onSelectTime }
                    showTimeSelect={ false }
                    showTimeSelectOnly
                    timeIntervals={ 10 }
                    timeCaption="Time"
                    dateFormat={ FORMAT_TIME }
                    placeholderText="Tiempo"
                  />
                ) }
              </Form.Item>
            </Col>
            <Col sm={ 12 }>
              <Form.Item>
                { getFieldDecorator( 'isOverTime', {
                  initialValue: this.state.timeEntry.isOverTime,
                } )(
                  <Switch
                    checkedChildren="Es tiempo extra"
                    unCheckedChildren="Es tiempo extra"
                    onChange={ this._onSelectOverTime }
                  />
                ) }
              </Form.Item>
            </Col>

          </Row>
          <Form.Item>
            { getFieldDecorator( 'notes', {
              initialValue: this.state.timeEntry.notes,
            } )(
              <TextArea
                placeholder="Notas"
                rows={ 4 }
                onChange={ this._onChangeNotes }
              />
            ) }
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={ this.props.isLoading }
              disabled={ this.props.isLoading || this.state.isAlertUniqTimeVisible }
            >
              { _.isEqual( this.props.actionType, 'add' ) ? 'Reportar' : 'Editar' }
            </Button>
          </Form.Item>
        </Form>
        { alertMessage }
      </div>
    );
  }
}


function mapStateToProps(state) {

  return {}
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {}, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Form.create( { name: 'register' } )( AddOrEditTimeForm ) );