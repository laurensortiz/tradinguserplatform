import React, { PureComponent } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

moment.locale( 'es' ); // Set Lang to Spanish

import { Input, Checkbox, Button, Form, Tag, Select, DatePicker } from 'antd';

import { countryOperations } from '../../state/modules/countries';
import { categoryOperations } from '../../state/modules/categories';
import { scopeOperations } from '../../state/modules/scopes';

const { Option } = Select;
const { TextArea } = Input;

class AddOrEditProjectForm extends PureComponent {
  state = {
    code: '',
    name: '',
    scope: {
      id: null,
      name: '',
      code: '',
    },
    country: {
      id: null,
      name: '',
      code: '',
    },
    category: {
      id: null,
      name: '',
      code: '',
    },
    startDate: null,
    endDate: null,
    totalHoursQuoted: null,
    confirmDirty: false,
    isInvalid: true,
    status: 1,
    observations: ''
  };

  componentDidMount() {
    if (_.isEmpty( this.props.countries )) {
      this.props.fetchGetCountries();
    }
    if (_.isEmpty( this.props.categories )) {
      this.props.fetchGetCategories();
    }
    if (_.isEmpty( this.props.scopes )) {
      this.props.fetchGetScopes();
    }
    if (!_.isEmpty( this.props.selectedProject )) {
      const { selectedProject } = this.props;
      this.setState( {
        ...this.state,
        ...selectedProject,
      } )
    }
  }

  _handleChange = e => {
    let value = '';
    if (e.target.type === 'checkbox') {
      value = e.target.checked ? 1 : 0;
    } else {
      value = e.target.value;
    }
    this.setState( { [ e.target.name ]: value } );
  };

  _handleChangeSelect = (event) => {
    const { value } = event;
    const fieldName = event.name;
    const codeIdName = value.split( '-' );

    const code = codeIdName[ 0 ];
    const id = Number( codeIdName[ 1 ] );
    const name = codeIdName[ 2 ];
    this.setState( {
      [ fieldName ]: {
        code,
        id,
        name,
      }
    } )

  };

  _handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields( (err, values) => {
      if (!err) {
        const project = {
          ...this.state,
          name: this._getProjectName()
        };

        if (_.isEqual( this.props.actionType, 'add' )) {
          this.props.onAddNew( project )
        } else {
          this.props.onEdit( project )
        }
      }
    } );

  };

  _getSelectOption = options => {
    return _.map( options, ({ id, name, code }) => <Option key={ `${ code }-${ id }-${ name }` }>{ name }</Option> )
  };

  _setStartDate = (date) => {
    this.setState( {
      startDate: moment( date ).format()
    } );
  };

  _setEndDate = (date) => {
    this.setState( {
      endDate: moment( date ).format()
    } );

  };

  _getProjectName = () => {
    const name = _.isEqual( this.props.actionType, 'add' ) ? this.state.name : _.last( ( this.state.name ).split( '_' ) );
    return `${ this.state.code }_${ this.state.category.code }_${ this.state.country.code }_${ name }`;

  };

  _onChangeObservations = ({ target: { value } }) => {
    this.setState( {
      observations: value
    } );
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const projectName = this._getProjectName();
    const { scopes, categories, countries } = this.props;
    // Default values for edit action
    const scopeInitValue = !_.isEmpty( this.state.scope.name ) ? this.state.scope.name : undefined;
    const categoryInitValue = !_.isEmpty( this.state.category.name ) ? this.state.category.name : undefined;
    const countryInitValue = !_.isEmpty( this.state.country.name ) ? this.state.country.name : undefined;
    const startDateInitValue = !_.isEmpty( this.state.startDate ) ? moment( this.state.startDate ) : undefined;
    const endDateInitValue = !_.isEmpty( this.state.endDate ) ? moment( this.state.endDate ) : undefined;

    return (
      <Form onSubmit={ this._handleSubmit } className="auth-form">
        <Form.Item>
          { getFieldDecorator( 'code', {
            initialValue: this.state.code,
            rules: [ { required: true, message: 'Por favor ingrese el Código' } ],
          } )(
            <Input name="code" onChange={ this._handleChange } placeholder="Código"/>
          ) }
        </Form.Item>
        <Form.Item>
          { getFieldDecorator( 'scope', {
            initialValue: scopeInitValue,
            rules: [ { required: true, message: 'Por favor ingrese el Alcance' } ],
          } )(
            <Select name="scope" onChange={ value => this._handleChangeSelect( { name: 'scope', value } ) }
                    placeholder="Alcance">
              { this._getSelectOption( scopes ) }
            </Select>
          ) }
        </Form.Item>
        <Form.Item>
          { getFieldDecorator( 'country', {
            initialValue: countryInitValue,
            rules: [ { required: true, message: 'Por favor ingrese el País' } ],
          } )(
            <Select name="country" onChange={ value => this._handleChangeSelect( { name: 'country', value } ) }
                    placeholder="País">
              { this._getSelectOption( countries ) }
            </Select>
          ) }
        </Form.Item>
        <Form.Item>
          { getFieldDecorator( 'category', {
            initialValue: categoryInitValue,
            rules: [ { required: true, message: 'Por favor ingrese la Categoría' } ],
          } )(
            <Select name="category" onChange={ value => this._handleChangeSelect( { name: 'category', value } ) }
                    placeholder="Categoría">
              { this._getSelectOption( categories ) }
            </Select>
          ) }
        </Form.Item>
        <Form.Item>
          { getFieldDecorator( 'name', {
            initialValue: this.state.name,
            rules: [ { required: true, message: 'Por favor ingrese el Nombre' } ],
          } )(
            <Input name="name" onChange={ this._handleChange } placeholder="Nombre"/>
          ) }
          <Tag>
            { projectName }
          </Tag>
        </Form.Item>
        <Form.Item>
          { getFieldDecorator( 'startDate', {
            initialValue: startDateInitValue
          } )(
            <DatePicker onChange={ this._setStartDate } placeholder="Fecha de Inicio"/>
          ) }
        </Form.Item>
        <Form.Item>
          { getFieldDecorator( 'endDate', {
            initialValue: endDateInitValue
          } )(
            <DatePicker onChange={ this._setEndDate } placeholder="Fecha de Finalización"/>
          ) }
        </Form.Item>
        <Form.Item>
          { getFieldDecorator( 'totalHoursQuoted', {
            initialValue: this.state.totalHoursQuoted
          } )(
            <Input name="totalHoursQuoted" onChange={ this._handleChange } placeholder="Horas Presupuestadas"/>
          ) }
        </Form.Item>
        <Form.Item>
          { getFieldDecorator( 'observations', {
            initialValue: this.state.observations,
          } )(
            <TextArea
              placeholder="Observaciones"
              rows={ 4 }
              onChange={ this._onChangeObservations }
            />
          ) }
        </Form.Item>
        {/*<Form.Item>*/ }
        {/*  { getFieldDecorator( 'status' )(*/ }
        {/*    <Checkbox name="status" onChange={ this._handleChange }>Es Activo</Checkbox>*/ }
        {/*  ) }*/ }
        {/*</Form.Item>*/ }

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button" disabled={ this.props.isLoading }>
            { _.isEqual( this.props.actionType, 'add' ) ? 'Agregar' : 'Editar' }
          </Button>
        </Form.Item>
      </Form>

    );
  }
}


function mapStateToProps(state) {
  const { categoriesState, countriesState, scopesState } = state;
  return {
    categories: categoriesState.list,
    countries: countriesState.list,
    scopes: scopesState.list,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetCountries: countryOperations.fetchGetCountries,
    fetchGetCategories: categoryOperations.fetchGetCategories,
    fetchGetScopes: scopeOperations.fetchGetScopes,
  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Form.create( { name: 'register' } )( AddOrEditProjectForm ) );