import React, { PureComponent } from 'react';
import { Input, InputNumber, Button, Form, Tag, Upload, Switch, Icon } from 'antd';
import _ from 'lodash';
import { AmountFormatValidation } from '../../common/utils';

const { TextArea } = Input;

class ReferralForm extends PureComponent {

  state = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    country: '',
    city: '',
    jobTitle: '',
    initialAmount: 0.0,
    hasBrokerGuarantee: 0,
    brokerGuaranteeCode: '',
    quantity: 0,
    personalIdDocument: '',
    collaboratorIB: '',
    description: '',
    userAccountId: '',
    fileName: '',
    confirmDirty: false,
    isInvalid: true,
    fileList: []
  }

  _handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState( { confirmDirty: this.state.confirmDirty || !!value } );
  };

  normFile = e => {
    console.log( 'Upload event:', e );
    if (Array.isArray( e )) {
      return e;
    }
    return e && e.fileList;
  };

  _handleChange = e => {
    console.log( '[=====  hhh  =====>' );
    console.log( e );
    console.log( '<=====  /hhh  =====]' );
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
        const saveState = _.omit( this.state, [ 'confirmDirty', 'isValid', 'fileList' ] );
        const { accountId, user } = this.props.userAccount;
        this.props.onAddReferral( {
          ...saveState,
          accountId,
          username: user.username
        } )
      }
    } );

  };

  _onUploadCompleted = (fileAttached) => {
    this.setState( {
      fileName: _.get( fileAttached, 'file.name', 'no-file-name' ),
    } )
  }

  _handleUpload = (option) => {
    const reader = new FileReader();
    reader.readAsDataURL( option.file );
    reader.onloadend = (e) => {
      if (e && e.target && e.target.result) {
        this.setState( {
          personalIdDocument: e.target.result
        } )
        option.onSuccess();
      }
    };
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <>
        <Form onSubmit={ this._handleSubmit } className="auth-form">
          <Form.Item label="Nombre">
            { getFieldDecorator( 'firstName', {
              rules: [
                {
                  required: true,
                  message: 'Por favor ingrese su Nombre',
                },
              ],
            } )( <Input placeholder="Nombre" name="firstName" onChange={ this._handleChange }/> ) }
          </Form.Item>
          <Form.Item label="Apellido">
            { getFieldDecorator( 'lastName', {
              rules: [
                {
                  required: true,
                  message: 'Por favor ingrese su Apellido',
                },
              ],
            } )( <Input placeholder="Apellido" name="lastName" onChange={ this._handleChange }/> ) }
          </Form.Item>
          <Form.Item label="Email">
            { getFieldDecorator( 'email', {
              rules: [ {
                type: 'email', message: 'No es un Email válido',
              }, {
                required: true,
                message: 'Por favor ingrese el Email',
              } ],
            } )(
              <Input name="email" type="email" onChange={ this._handleChange }
                     prefix={ <Icon type="mail" style={ { color: 'rgba(0,0,0,.25)' } }/> } placeholder="Email"/>
            ) }
          </Form.Item>
          <Form.Item label="Teléfono">
            { getFieldDecorator( 'phoneNumber', {
              rules: [
                {
                  required: true,
                  message: 'Por favor ingrese su Teléfono',
                },
              ],
            } )( <Input placeholder="Teléfono" name="phoneNumber" onChange={ this._handleChange }/> ) }
          </Form.Item>
          <Form.Item label="País">
            { getFieldDecorator( 'country', {
              rules: [
                {
                  required: true,
                  message: 'Por favor ingrese su País',
                },
              ],
            } )( <Input placeholder="País" name="country" onChange={ this._handleChange }/> ) }
          </Form.Item>
          <Form.Item label="Ciudad">
            { getFieldDecorator( 'city', {
              rules: [
                {
                  required: true,
                  message: 'Por favor ingrese su Ciudad',
                },
              ],
            } )( <Input placeholder="Ciudad" name="city" onChange={ this._handleChange }/> ) }
          </Form.Item>
          <Form.Item label="Ocupación">
            { getFieldDecorator( 'jobTitle', {
              rules: [
                {
                  required: true,
                  message: 'Por favor ingrese su Ocupación',
                },
              ],
            } )( <Input placeholder="Ocupación" name="jobTitle" onChange={ this._handleChange }/> ) }
          </Form.Item>
          <Form.Item label="Monto de Inversión $">
            { getFieldDecorator( 'initialAmount', {
              rules: [ { required: false, message: 'Por favor ingrese el Monto de Inversión' },
                {
                  validator: (rule, amount) => AmountFormatValidation( rule, amount )
                }
              ],
            } )(
              <Input name="initialAmount" onChange={ this._handleChange }
                     placeholder="Monto de Inversión $"/>
            ) }
          </Form.Item>
          <Form.Item label="Compra Broker Guarantee">
            { getFieldDecorator( 'hasBrokerGuarantee', { valuePropName: 'checked' } )(
              <Switch name="hasBrokerGuarantee" onChange={ (e) => this._handleChange( {
                target: {
                  type: 'checkbox',
                  checked: e,
                  name: 'hasBrokerGuarantee'
                }
              } ) } checkedChildren="Sí" unCheckedChildren="No"/>
            ) }
          </Form.Item>
          <Form.Item label="Código de Broker Guarantee">
            { getFieldDecorator( 'brokerGuaranteeCode', {
              rules: [
                {
                  required: false,
                  message: 'Por favor ingrese su Código de Broker Guarantee',
                },
              ],
            } )( <Input placeholder="Código de Broker Guarantee" name="brokerGuaranteeCode"
                        onChange={ this._handleChange }/> ) }
          </Form.Item>
          <Form.Item label="Cantidad">
            { getFieldDecorator( 'quantity', {
              rules: [
                {
                  required: false,
                  message: 'Por favor ingrese su Cantidad',
                },
              ],
            } )( <Input placeholder="Cantidad" name="quantity" onChange={ this._handleChange }/> ) }
          </Form.Item>
          <Form.Item label="Identificación">
            { getFieldDecorator( 'personalIdDocument', {
              valuePropName: 'files',
              getValueFromEvent: this.normFile,
            } )(
              <Upload.Dragger
                name="files"
                customRequest={ this._handleUpload }
                accept=".pdf, .png, .jpg"
                beforeUpload={ file => {
                  this.setState( {
                    fileList: [ file ],
                      fileName: file.name
                  } )

                } }
              >
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox"/>
                </p>
                <p className="ant-upload-text">Arrastre y suelte o seleccione un archivo</p>
                <p className="ant-upload-hint">Los formatos de archivo aceptados son: .pdf, .jpg y
                  .png</p>
              </Upload.Dragger>,
            ) }
          </Form.Item>
          <Form.Item label="IB Colaborador">
            { getFieldDecorator( 'collaboratorIB', {
              rules: [
                {
                  required: true,
                  message: 'Por favor ingrese su IB Colaborador',
                },
              ],
            } )( <Input placeholder="IB Colaborador" name="collaboratorIB" onChange={ this._handleChange }/> ) }
          </Form.Item>
          <Form.Item label="Descripción del cliente referido">
            { getFieldDecorator( 'description', {
              rules: [
                {
                  required: true,
                  message: 'Por favor ingrese su Descripción del cliente referido',
                },
              ],
            } )( <TextArea placeholder="Descripción del cliente referido" name="description"
                           onChange={ this._handleChange }/> ) }
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" className="login-form-button"
                    disabled={ this.props.isReferralLoading }>
              Enviar Referencia
            </Button>
          </Form.Item>
        </Form>

      </>
    )
  }


}

export default ( Form.create( { name: 'register' } )( ReferralForm ) );
