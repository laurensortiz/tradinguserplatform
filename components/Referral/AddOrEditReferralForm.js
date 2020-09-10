import React, { PureComponent } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

moment.locale( 'es' ); // Set Lang to Spanish

import { Input, Row, Col, Button, Form, Tag, DatePicker, Icon, Switch, Upload } from 'antd';

import { AmountFormatValidation } from '../../common/utils';
const { TextArea } = Input;
class AddOrEditReferralForm extends PureComponent {
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
    username: '',
    personalIdDocumentDownloadType: 'pdf',
    downloadDocumentName: ''
  };

  componentDidMount() {

    if (!_.isEmpty( this.props.selectedReferral )) {
      const { selectedReferral } = this.props;
      const username = _.get(selectedReferral, 'userAccount.user.username', '');
      let personalIdDocument = '',
        personalIdDocumentDownloadType = 'pdf',
        downloadDocumentName = '';
      if (selectedReferral.personalIdDocument.type === 'Buffer' && !_.isEmpty(selectedReferral.personalIdDocument.data)) {
        personalIdDocument = Buffer.from(selectedReferral.personalIdDocument.data, 'base64').toString('utf8');
        personalIdDocumentDownloadType = ((personalIdDocument.split(',')[0]).split('/')[1]).split(';')[0];
        downloadDocumentName = `ID-${selectedReferral.firstName}-${selectedReferral.lastName}.${personalIdDocumentDownloadType}`;
      }

      this.setState( {
        ...this.state,
        ...selectedReferral,
        username,
        personalIdDocument,
        personalIdDocumentDownloadType,
        downloadDocumentName
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

  _handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields( (err, values) => {
      if (!err) {
        const saveState = _.omit(this.state, ['personalIdDocument']);
        if (_.isEqual( this.props.actionType, 'add' )) {
          this.props.onAddNew( saveState )
        } else {
          this.props.onEdit( saveState )
        }
      }
    } );

  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const isAddAction = _.isEqual( this.props.actionType, 'add' );


    // Default values for edit action
    const firstNameInitValue = !_.isEmpty( this.state.firstName ) ? this.state.firstName : undefined;
    const lastNameInitValue = !_.isEmpty( this.state.lastName ) ? this.state.lastName : undefined;
    const emailInitValue = !_.isEmpty( this.state.email ) ? this.state.email : undefined;
    const phoneNumberInitValue = !_.isEmpty( this.state.phoneNumber ) ? this.state.phoneNumber : undefined;
    const countryInitValue = !_.isEmpty( this.state.country ) ? this.state.country : undefined;
    const cityInitValue = !_.isEmpty( this.state.city ) ? this.state.city : undefined;
    const jobTitleInitValue = !_.isEmpty( this.state.jobTitle ) ? this.state.jobTitle : undefined;
    const initialAmountInitValue = !_.isEmpty( this.state.initialAmount ) ? this.state.initialAmount : undefined;
    const hasBrokerGuaranteeInitValue = this.state.hasBrokerGuarantee === 1 ? 'checked' : null;
    const brokerGuaranteeCodeInitValue = !_.isEmpty( this.state.brokerGuaranteeCode ) ? this.state.brokerGuaranteeCode : undefined;
    const quantityInitValue = this.state.quantity > 0 ? this.state.quantity : undefined;
    const personalIdDocumentInitValue = !_.isEmpty( this.state.personalIdDocument ) ? this.state.personalIdDocument : undefined;
    const collaboratorIBInitValue = !_.isEmpty( this.state.collaboratorIB ) ? this.state.collaboratorIB : undefined;
    const descriptionInitValue = !_.isEmpty( this.state.description ) ? this.state.description : undefined;
    const notesInitValue = !_.isEmpty( this.state.notes ) ? this.state.notes : undefined;

    return (
      <Form onSubmit={ this._handleSubmit } className="auth-form">
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="Nombre">
              { getFieldDecorator( 'firstName', {
                initialValue: firstNameInitValue,
                rules: [
                  {
                    required: true,
                    message: 'Por favor ingrese su Nombre',
                  },
                ],
              } )( <Input placeholder="Nombre" name="firstName" onChange={ this._handleChange }/> ) }
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Apellido">
              { getFieldDecorator( 'lastName', {
                initialValue: lastNameInitValue,
                rules: [
                  {
                    required: true,
                    message: 'Por favor ingrese su Apellido',
                  },
                ],
              } )( <Input placeholder="Apellido" name="lastName" onChange={ this._handleChange }/> ) }
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="Email">
              { getFieldDecorator( 'email', {
                initialValue: emailInitValue,
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
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Teléfono">
              { getFieldDecorator( 'phoneNumber', {
                initialValue: phoneNumberInitValue,
                rules: [
                  {
                    required: true,
                    message: 'Por favor ingrese su Teléfono',
                  },
                ],
              } )( <Input placeholder="Teléfono" name="phoneNumber" onChange={ this._handleChange }/> ) }
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="País">
              { getFieldDecorator( 'country', {
                initialValue: countryInitValue,
                rules: [
                  {
                    required: true,
                    message: 'Por favor ingrese su País',
                  },
                ],
              } )( <Input placeholder="País" name="country" onChange={ this._handleChange }/> ) }
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Ciudad">
              { getFieldDecorator( 'city', {
                initialValue: cityInitValue,
                rules: [
                  {
                    required: true,
                    message: 'Por favor ingrese su Ciudad',
                  },
                ],
              } )( <Input placeholder="Ciudad" name="city" onChange={ this._handleChange }/> ) }
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="Ocupación">
              { getFieldDecorator( 'jobTitle', {
                initialValue: jobTitleInitValue,
                rules: [
                  {
                    required: true,
                    message: 'Por favor ingrese su Ocupación',
                  },
                ],
              } )( <Input placeholder="Ocupación" name="jobTitle" onChange={ this._handleChange }/> ) }
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Monto de Inversión $">
              { getFieldDecorator( 'initialAmount', {
                initialValue: initialAmountInitValue,
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
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={12}><Form.Item label="Cantidad">
            { getFieldDecorator( 'quantity', {
              initialValue: quantityInitValue,
              rules: [
                {
                  required: false,
                  message: 'Por favor ingrese su Cantidad',
                },
              ],
            } )( <Input placeholder="Cantidad" name="quantity" onChange={ this._handleChange }/> ) }
          </Form.Item></Col>
          <Col xs={24} sm={12}><Form.Item label="IB Colaborador">
            { getFieldDecorator( 'collaboratorIB', {
              initialValue: collaboratorIBInitValue,
              rules: [
                {
                  required: false,
                  message: 'Por favor ingrese su IB Colaborador',
                },
              ],
            } )( <Input placeholder="IB Colaborador" name="collaboratorIB" onChange={ this._handleChange }/> ) }
          </Form.Item></Col>
        </Row>
        <Row gutter={16}>

          <Col xs={24} sm={12}>
            <Form.Item label="Código de Broker Guarantee">
              { getFieldDecorator( 'brokerGuaranteeCode', {
                initialValue: brokerGuaranteeCodeInitValue,
                rules: [
                  {
                    required: false,
                    message: 'Por favor ingrese su Código de Broker Guarantee',
                  },
                ],
              } )( <Input placeholder="Código de Broker Guarantee" name="brokerGuaranteeCode"
                          onChange={ this._handleChange }/> ) }
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Compra Broker Guarantee">
              { getFieldDecorator( 'hasBrokerGuarantee', {
                valuePropName: 'checked',
                initialValue: hasBrokerGuaranteeInitValue,
              } )(
                <Switch name="hasBrokerGuarantee" onChange={ (e) => this._handleChange( {
                  target: {
                    type: 'checkbox',
                    checked: e,
                    name: 'hasBrokerGuarantee'
                  }
                } ) } checkedChildren="Sí" unCheckedChildren="No"/>
              ) }
            </Form.Item>
          </Col>
        </Row>


        <Row>
          <Col xs={24} sm={24}>
            <Form.Item label="Descripción del cliente referido">
              { getFieldDecorator( 'description', {
                initialValue: descriptionInitValue,
                rules: [
                  {
                    required: true,
                    message: 'Por favor ingrese su Descripción del cliente referido',
                  },
                ],
              } )( <TextArea rows={3} placeholder="Descripción del cliente referido" name="description"
                             onChange={ this._handleChange }/> ) }
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={24}>
            {!_.isEmpty(this.state.personalIdDocument) ? (
              <a className="download-file" type="primary" href={this.state.personalIdDocument} download={this.state.downloadDocumentName}>
                <Icon type="contacts" /> Descargar Documento Identificación</a>
            ) : <h3><Icon type="contacts" /> Documento no suministrado</h3>}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={12}></Col>
          <Col xs={24} sm={12}></Col>
        </Row>










        {/*<Form.Item label="Identificación">*/}
        {/*  { getFieldDecorator( 'personalIdDocument', {*/}
        {/*    initialValue: personalIdDocumentInitValue,*/}
        {/*    valuePropName: 'files',*/}
        {/*    getValueFromEvent: this.normFile,*/}
        {/*  } )(*/}
        {/*    <Upload.Dragger*/}
        {/*      name="files"*/}
        {/*      customRequest={ this._handleUpload }*/}
        {/*      accept=".pdf, .png, .jpg"*/}
        {/*      beforeUpload={ file => {*/}
        {/*        this.setState( {*/}
        {/*          fileList: [ file ],*/}
        {/*          fileName: file.name*/}
        {/*        } )*/}

        {/*      } }*/}
        {/*    >*/}
        {/*      <p className="ant-upload-drag-icon">*/}
        {/*        <Icon type="inbox"/>*/}
        {/*      </p>*/}
        {/*      <p className="ant-upload-text">Arrastre y suelte o seleccione un archivo</p>*/}
        {/*      <p className="ant-upload-hint">Los formatos de archivo aceptados son: .pdf, .jpg y*/}
        {/*        .png</p>*/}
        {/*    </Upload.Dragger>,*/}
        {/*  ) }*/}
        {/*</Form.Item>*/}


        <hr/>
        <Form.Item label="Notas Administrativas">
          { getFieldDecorator( 'notes', {
            initialValue: notesInitValue,
            rules: [
              {
                required: false,
                message: 'Por favor ingrese su nota',
              },
            ],
          } )( <TextArea rows={8} placeholder="" name="notes"
                         onChange={ this._handleChange }/> ) }
        </Form.Item>
        <Form.Item>
          <Button style={ { width: '100%' } } type="primary" htmlType="submit" size="large"
                  className="login-form-button">
            Guardar Actualización
          </Button>
        </Form.Item>
      </Form>

    );
  }
}


function mapStateToProps(state) {
  const { accountsState, usersState } = state;
  return {

  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {

  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Form.create( { name: 'register' } )( AddOrEditReferralForm ) );