import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Form, Icon, Input, Button, Alert } from 'antd';
import { authOperations } from "../state/modules/auth";

class AuthLoginForm extends Component {
  constructor(props) {
    super( props )
  }

  state = {
    username: '',
    password: '',
  };

  _handleChange = e => {
    this.setState( { [ e.target.name ]: e.target.value } );
  };

  _handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields( (err, values) => {
      if (!err) {
        this.props.login( this.state )
      }
    } );

  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login-form-container">
        <div className="login-form-header">

        </div>
        <Form onSubmit={ this._handleSubmit } className="login-form">
          <Form.Item label="Usuario">
            { getFieldDecorator( 'username', {
              rules: [ { required: true, message: 'Por favor ingrese su usuario' } ],
            } )(
              <Input name="username" onChange={ this._handleChange }
                     prefix={ <Icon type="user" style={ { color: 'rgba(0,0,0,.25)' } }/> } placeholder="Username"/>
            ) }
          </Form.Item>
          <Form.Item label="Contraseña">
            { getFieldDecorator( 'password', {
              rules: [ { required: true, message: 'Por favor ingrese su contraseña' } ],
            } )(
              <Input name="password" onChange={ this._handleChange }
                     prefix={ <Icon type="lock" style={ { color: 'rgba(0,0,0,.25)' } }/> } type="password"
                     placeholder="Password"/>
            ) }
          </Form.Item>
          <Form.Item>
            {/*<a className="login-form-forgot" href="">Forgot password</a>*/ }
            <Button type="primary" htmlType="submit" className="login-form-button">
              Ingresar
            </Button>
          </Form.Item>
        </Form>
        <div className="login-form-footer">
          {this.props.isFailure ? (
            <Alert style={{textAlign: "center"}} showIcon type="error" message="Usuario o Contraseña incorrectos" />
          ) : null}

        </div>
      </div>

    );
  }
}

function mapStateToProps(state) {


  return {
    auth: state.authState,
    isAuthenticated: state.authState.isAuthenticated,
    isFailure: state.authState.isFailure,
    isLoading: state.authState.isLoading,
    isSessionExpired: state.authState.isSessionExpired,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    login: authOperations.login,
  }, dispatch);


export default connect( mapStateToProps, mapDispatchToProps )( Form.create( { name: 'normal_login' } )( AuthLoginForm ) );
