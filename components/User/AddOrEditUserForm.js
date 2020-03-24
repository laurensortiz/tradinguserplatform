import React, { PureComponent } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import classNames from 'classnames';
import { Input, Checkbox, Button, Form, Tag, Select, DatePicker, Icon, Radio } from 'antd';

moment.locale( 'es' ); // Set Lang to Spanish

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
      id: 0,
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
    isAdminUser: false,
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
        isAdminUser: _.isEqual( selectedProject.roleId, 1 )
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

  _handleSelectUserType = ({ target }) => {
    const isAdminUser = _.isEqual( target.value, 'admin' );
    this.setState( {
      isAdminUser,
      role: {
        id: isAdminUser ? 1 : 2
      },
      account: {
        id: 0
      }
    } )
  };

  render() {

    const { getFieldDecorator } = this.props.form;
    const { isAdminUser } = this.state;
    // Default values for edit action
    const roleInitValue = _.isEqual( this.state.role.id, 1 );
    const accountInitValue = !_.isEmpty( this.state.account.name ) ? this.state.account.name : undefined;
    const emailInitValue = !_.isEmpty( this.state.email ) ? this.state.email : undefined;
    const phoneNumberInitValue = !_.isEmpty( this.state.phoneNumber ) ? this.state.phoneNumber : undefined;
    const startDateInitValue = !_.isEmpty( this.state.startDate ) ? moment.utc( this.state.startDate ) : undefined;
    const endDateInitValue = !_.isEmpty( this.state.endDate ) ? moment.utc( this.state.endDate ) : undefined;
    return (
      <div className="add-edit-user-modal">
        { _.isEqual( this.props.actionType, 'add' ) ? (
          <Radio.Group onChange={ this._handleSelectUserType } value={ isAdminUser ? 'admin' : 'regular' }
                       buttonStyle="solid" size="large">
            <Radio.Button value="regular"><Icon type="user-add"/> Cliente</Radio.Button>
            <Radio.Button value="admin"><Icon type="crown"/> Administrador</Radio.Button>
          </Radio.Group>
        ) : null }

        <Form onSubmit={ this._handleSubmit } className="auth-form">
          <Form.Item label="Nombre">
            { getFieldDecorator( 'firstName', {
              initialValue: this.state.firstName,
              rules: [ { message: 'Por favor ingrese su Nombre' } ],
            } )(
              <Input name="firstName" onChange={ this._handleChange } placeholder="Nombre"/>
            ) }
          </Form.Item>
          <Form.Item label="Apellido">
            { getFieldDecorator( 'lastName', {
              initialValue: this.state.lastName,
              rules: [ { message: 'Por favor ingrese su Apellido' } ],
            } )(
              <Input name="lastName" onChange={ this._handleChange } placeholder="Apellido"/>
            ) }
          </Form.Item>
          <Form.Item label="Usuario">
            { getFieldDecorator( 'username', {
              initialValue: this.state.username,
              rules: [ { required: true, message: 'Por favor ingrese su Usuario' } ],
            } )(
              <Input name="username" onChange={ this._handleChange } placeholder="Usuario"/>
            ) }
          </Form.Item>
          <Form.Item label="Usuario ID" className={ classNames( { 'hidden': isAdminUser } ) }>
            { getFieldDecorator( 'userID', {
              initialValue: this.state.userID,
              rules: [ { message: 'Por favor ingrese el ID del usuario' } ],
            } )(
              <Input name="userID" onChange={ this._handleChange } placeholder="Cuenta Cliente"/>
            ) }
          </Form.Item>
          <Form.Item label="Email">
            { getFieldDecorator( 'email', {
              initialValue: emailInitValue,
              rules: [ {
                type: 'email', message: 'No es un Email válido',
              }, {
                message: 'Por favor ingrese el Email',
              } ],
            } )(
              <Input name="email" type="email" onChange={ this._handleChange }
                     prefix={ <Icon type="mail" style={ { color: 'rgba(0,0,0,.25)' } }/> } placeholder="Email"/>
            ) }
          </Form.Item>
          <Form.Item label="Teléfono" className={ classNames( { 'hidden': isAdminUser } ) }>
            { getFieldDecorator( 'phoneNumber', {
              initialValue: phoneNumberInitValue,
              rules: [ { message: 'Por favor ingrese su número de teléfono' } ],
            } )(
              <Input name="phoneNumber" onChange={ this._handleChange } placeholder="Teléfono"/>
            ) }
          </Form.Item>
          <Form.Item label="Contraseña">
            { getFieldDecorator( 'password', {
              rules: [ {
                required: _.isEqual( this.props.actionType, 'add' ),
                message: 'Por favor ingrese la Contraseña'
              },
                {
                  validator: this._validateToNextPassword,
                } ],
            } )(
              <Input.Password name="password" onChange={ this._handleChange }
                              prefix={ <Icon type="lock" style={ { color: 'rgba(0,0,0,.25)' } }/> } type="password"
                              placeholder="Contraseña"/>
            ) }
          </Form.Item>
          <Form.Item label="Confirmar Contraseña">
            { getFieldDecorator( 'verifyPassword', {
              rules: [ {
                required: _.isEqual( this.props.actionType, 'add' ),
                message: 'Por favor ingrese la Contraseña'
              },
                {
                  validator: this._compareToFirstPassword,
                } ],
            } )(
              <Input.Password name="verifyPassword" onChange={ this._handleChange }
                              prefix={ <Icon type="lock" style={ { color: 'rgba(0,0,0,.25)' } }/> } type="password"
                              placeholder="Confirmar Contraseña" onBlur={ this._handleConfirmBlur }/>
            ) }
          </Form.Item>
          <Form.Item label="Fecha de Inicio">
            { getFieldDecorator( 'startDate', {
              initialValue: startDateInitValue
            } )(
              <DatePicker onChange={ this._setStartDate } placeholder="Fecha de Inicio"/>
            ) }
          </Form.Item>
          <Form.Item label="Fecha de Salida">
            { getFieldDecorator( 'endDate', {
              initialValue: endDateInitValue
            } )(
              <DatePicker onChange={ this._setEndDate } placeholder="Fecha de Salida"/>
            ) }
          </Form.Item>
          {/*<Form.Item label="Tipo de Cuenta" className={classNames({'hidden': isAdminUser})}>*/ }
          {/*  { getFieldDecorator( 'account', {*/ }
          {/*    initialValue: accountInitValue,*/ }
          {/*    rules: [ {*/ }
          {/*      message: 'Por favor ingrese el tipo de cuenta',*/ }
          {/*      required: _.isEqual( this.props.actionType, 'add' ) || !this.state.isAdminUser,*/ }
          {/*    } ],*/ }
          {/*  } )(*/ }
          {/*    <Select name="account" onChange={ value => this._handleChangeSelect( { name: 'account', value } ) }*/ }
          {/*            placeholder="Tipo de Cuenta">*/ }
          {/*      { this._getSelectOption( this.state.accounts ) }*/ }
          {/*    </Select>*/ }
          {/*  ) }*/ }
          {/*</Form.Item>*/ }


          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" disabled={ this.props.isLoading }>
              { _.isEqual( this.props.actionType, 'add' ) ? 'Agregar' : 'Editar' }
            </Button>
          </Form.Item>
        </Form>
      </div>


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