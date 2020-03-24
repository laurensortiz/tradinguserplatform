import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';

import { Input, Checkbox, Button, Form, Icon, Select } from 'antd';

import { userOperations } from "../state/modules/users";

import { jobTitle } from '../common/sample-data';

const { Option } = Select;

class AuthSignupFor extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    verify: '',
    title: '',
    role: 0,
    confirmDirty: false,
  };

  _handleChange = e => {
    let value = '';
    if (e.target.type === 'checkbox') {
      value = e.target.checked ? 1 : 0;
    } else {
      value = e.target.value;
    }
    this.setState( { [ e.target.name ]: value } );
  };

  _handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields( (err, values) => {
      if (!err) {
        this.props.addUser( this.state )
      }
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
      form.validateFields( [ 'verify' ], { force: true } );
    }
    callback();
  };

  _handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState( { confirmDirty: this.state.confirmDirty || !!value } );
  };

  _getJobTitleOptions = () => {
    return jobTitle.map(({name, id}) => <Option key={id}>{name}</Option>)
  };

  _handleChangeSelect = () => {

  };


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={ this._handleSubmit } className="auth-form">
        <Form.Item>
          { getFieldDecorator( 'username', {
            rules: [ { required: true, message: 'Por favor ingrese el Usuario' } ],
          } )(
            <Input name="username" onChange={ this._handleChange }
                   prefix={ <Icon type="user" style={ { color: 'rgba(0,0,0,.25)' } }/> } placeholder="Usuario"/>
          ) }
        </Form.Item>
        <Form.Item>
          { getFieldDecorator( 'email', {
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
          { getFieldDecorator( 'title', {
            rules: [ { required: true, message: 'Por favor ingrese el Puesto' } ],
          } )(
            <Select name="title" onChange={ value => this._handleChangeSelect( { name: 'title', value } ) }
                    placeholder="Puesto">
              { this._getJobTitleOptions( jobTitle ) }
            </Select>
          ) }
        </Form.Item>
        <Form.Item>
          { getFieldDecorator( 'password', {
            rules: [ { required: true, message: 'Por favor ingrese la Contraseña' },
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
          { getFieldDecorator( 'verify', {
            rules: [ { required: true, message: 'Por favor ingrese la Contraseña' },
              {
                validator: this._compareToFirstPassword,
              } ],
          } )(
            <Input name="verify" onChange={ this._handleChange }
                   prefix={ <Icon type="lock" style={ { color: 'rgba(0,0,0,.25)' } }/> } type="password"
                   placeholder="Contraseña" onBlur={ this._handleConfirmBlur }/>
          ) }
        </Form.Item>

        <Form.Item>
          { getFieldDecorator( 'role' )(
            <Checkbox name="role" onChange={ this._handleChange }>Es Administrador</Checkbox>
          ) }
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Registrar
          </Button>
        </Form.Item>
      </Form>

    );
  }
}


function mapStateToProps(state) {
  return {
    users: state.userState.users,
    isLoading: state.userState.isLoading,
    isAddingUser: state.userState.add.isLoading,
    addUserSuccess: state.userState.add.isSuccess,
    addUserError: state.userState.add.isFailure,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    addUser: userOperations.addUser,
  }, dispatch );

export default connect( mapStateToProps, mapDispatchToProps )( Form.create( { name: 'register' } )( AuthSignupFor ) );
