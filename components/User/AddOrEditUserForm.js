import React, { PureComponent } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

moment.locale( 'es' ); // Set Lang to Spanish

import { Input, Checkbox, Button, Form, Tag, Select, DatePicker, Icon } from 'antd';

import { accountOperations } from '../../state/modules/accounts';

const { Option } = Select;

class AddOrEditUserForm extends PureComponent {
  state = {
    username: '',
    firstName: '',
    lastName: '',
    userID: '',
    email: '',
    role: {
      id: 2,
      name: ''
    },
    account: {
      id: null,
      name: ''
    },
    startDate: null,
    endDate: null,
    confirmDirty: false,
    isInvalid: true,
    password: '',
    phoneNumber: '',
    verifyPassword: '',
    status: 1,
    accounts: [],
  };

  static getDerivedStateFromProps(nextProps, prevState) {

    if (!_.isEqual( nextProps.accounts, prevState.accounts )) {
      return {
        accounts: nextProps.accounts
      }
    }
    return null;
  }


  componentDidMount() {
    if (_.isEmpty( this.state.accounts )) {
      this.props.fetchGetAccounts();
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

  _handleChangeCheckBox = e => {
    const value = e.target.checked ? 1 : 2;
    this.setState( {
      role: {
        id: value
      }
    } );
  };

  _handleChangeSelect = (event) => {
    const { value } = event;
    const fieldName = event.name;
    const codeIdName = value.split( '-' );

    const id = Number( codeIdName[ 0 ] );
    const name = codeIdName[ 1 ];
    this.setState( {
      [ fieldName ]: {
        id,
        name,
      }
    } )

  };

  _handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields( (err, values) => {
      if (!err) {
        const user = {
          ...this.state,
        };

        if (_.isEqual( this.props.actionType, 'add' )) {
          this.props.onAddNew( user )
        } else {
          this.props.onEdit( user )
        }
      }
    } );

  };

  _getSelectOption = options => {
    return _.map( options, ({ id, name }) => <Option key={ `${ id }-${ name }` }>{ name }</Option> )
  };

  _setStartDate = (date) => {
    this.setState( {
      startDate: moment.utc( date ).format()
    } );
  };

  _setEndDate = (date) => {
    this.setState( {
      endDate: moment.utc( date ).format()
    } );

  };

  _compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue( 'password' )) {
      callback( 'Las dos contraseñas no son iguales' );
    } else {
      callback();
    }
  };

  _validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields( [ 'verifyPassword' ], { force: true } );
    }
    callback();
  };

  _handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState( { confirmDirty: this.state.confirmDirty || !!value } );
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    // Default values for edit action
    const roleInitValue = _.isEqual( this.state.role.id, 1 );
    const accountInitValue = !_.isEmpty( this.state.account.name ) ? this.state.account.name : undefined;
    const emailInitValue = !_.isEmpty( this.state.email ) ? this.state.email : undefined;
    const phoneNumberInitValue = !_.isEmpty( this.state.phoneNumber ) ? this.state.phoneNumber : undefined;
    const startDateInitValue = !_.isEmpty( this.state.startDate ) ? moment.utc( this.state.startDate ) : undefined;
    const endDateInitValue = !_.isEmpty( this.state.endDate ) ? moment.utc( this.state.endDate ) : undefined;
    return (
      <Form onSubmit={ this._handleSubmit } className="auth-form">
        <Form.Item>
          { getFieldDecorator( 'firstName', {
            initialValue: this.state.firstName,
            rules: [ { required: true, message: 'Por favor ingrese su Nombre' } ],
          } )(
            <Input name="firstName" onChange={ this._handleChange } placeholder="Nombre"/>
          ) }
        </Form.Item>
        <Form.Item>
          { getFieldDecorator( 'lastName', {
            initialValue: this.state.lastName,
            rules: [ { required: true, message: 'Por favor ingrese su Apellido' } ],
          } )(
            <Input name="lastName" onChange={ this._handleChange } placeholder="Apellido"/>
          ) }
        </Form.Item>
        <Form.Item>
          { getFieldDecorator( 'username', {
            initialValue: this.state.username,
            rules: [ { required: true, message: 'Por favor ingrese su Usuario' } ],
          } )(
            <Input name="username" onChange={ this._handleChange } placeholder="Usuario"/>
          ) }
        </Form.Item>
        <Form.Item>
          { getFieldDecorator( 'userID', {
            initialValue: this.state.userID,
            rules: [ { required: true, message: 'Por favor ingrese su número de cédula' } ],
          } )(
            <Input name="userID" onChange={ this._handleChange } placeholder="Cédula"/>
          ) }
        </Form.Item>
        <Form.Item>
          { getFieldDecorator( 'email', {
            initialValue: emailInitValue,
            rules: [ {
              type: 'email', message: 'No es un Email válido',
            }, {
              required: true, message: 'Por favor ingrese el Email',
            } ],
          } )(
            <Input name="email" type="email" onChange={ this._handleChange }
                   prefix={ <Icon type="mail" style={ { color: 'rgba(0,0,0,.25)' } }/> } placeholder="Email"/>
          ) }
        </Form.Item>
        <Form.Item>
          { getFieldDecorator( 'phoneNumber', {
            initialValue: phoneNumberInitValue,
            rules: [ { required: false, message: 'Por favor ingrese su número de teléfono' } ],
          } )(
            <Input name="phoneNumber" onChange={ this._handleChange } placeholder="Teléfono"/>
          ) }
        </Form.Item>
        <Form.Item>
          { getFieldDecorator( 'password', {
            rules: [ {
              required: _.isEqual( this.props.actionType, 'add' ),
              message: 'Por favor ingrese la Contraseña'
            },
              {
                validator: this._validateToNextPassword,
              } ],
          } )(
            <Input name="password" onChange={ this._handleChange }
                   prefix={ <Icon type="lock" style={ { color: 'rgba(0,0,0,.25)' } }/> } type="password"
                   placeholder="Contraseña"/>
          ) }
        </Form.Item>
        <Form.Item>
          { getFieldDecorator( 'verifyPassword', {
            rules: [ {
              required: _.isEqual( this.props.actionType, 'add' ),
              message: 'Por favor ingrese la Contraseña'
            },
              {
                validator: this._compareToFirstPassword,
              } ],
          } )(
            <Input name="verifyPassword" onChange={ this._handleChange }
                   prefix={ <Icon type="lock" style={ { color: 'rgba(0,0,0,.25)' } }/> } type="password"
                   placeholder="Contraseña" onBlur={ this._handleConfirmBlur }/>
          ) }
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
            <DatePicker onChange={ this._setEndDate } placeholder="Fecha de Salida"/>
          ) }
        </Form.Item>
        <Form.Item>
          { getFieldDecorator( 'account', {
            initialValue: accountInitValue,
            rules: [ { required: true, message: 'Por favor ingrese el tipo de cuenta' } ],
          } )(
            <Select name="account" onChange={ value => this._handleChangeSelect( { name: 'account', value } ) }
                    placeholder="Tipo de Cuenta">
              { this._getSelectOption( this.state.accounts ) }
            </Select>
          ) }
        </Form.Item>
        <Form.Item>
          { getFieldDecorator( 'role', {
            initialValue: roleInitValue
          })(
            <Checkbox checked={roleInitValue} name="role" onChange={ this._handleChangeCheckBox }>Es Administrador</Checkbox>
          ) }
        </Form.Item>

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
  const { accountsState } = state;
  return {
    accounts: accountsState.list,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetAccounts: accountOperations.fetchGetAccounts,
  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Form.create( { name: 'register' } )( AddOrEditUserForm ) );