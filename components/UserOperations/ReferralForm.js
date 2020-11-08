import React, { PureComponent } from 'react';
import { Input, Button, Form, Upload, Switch, Icon, Select } from 'antd';
import _ from 'lodash';
import { AmountFormatValidation } from '../../common/utils';
import PhoneAreaCode from '../../common/utils/phone-area-codes.json';
import Draggable from 'react-draggable';
import { withNamespaces } from 'react-i18next';

const { TextArea } = Input;
const { Option } = Select;

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
    phoneAreaCode: '+506',
    fileList: []
  }

  normFile = e => {
    console.log( 'Upload event:', e );
    if (Array.isArray( e )) {
      return e;
    }
    return e && e.fileList;
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
        const saveState = _.omit( this.state, [ 'confirmDirty', 'isValid', 'fileList' ] );
        const { accountId, user } = this.props.userAccount;
        this.props.onAddReferral( {
          ...saveState,
          userAccountId: accountId,
          username: user.username,
          phoneNumber: `${ this.state.phoneAreaCode } ${ this.state.phoneNumber }`
        } )
      }
    } );

  };

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

  _handlePhoneAreaCode = (value) => {
    this.setState( {
      phoneAreaCode: value.split( ',' )[ 1 ]
    } )
  }

  _handleRemoveUploadedFiles = () => {
    this.setState( {
      fileList: [],
      personalIdDocument: ''
    } )
  }

  render() {
    const { t } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { fileList } = this.state;
    const { user } = this.props.userAccount;

    const prefixSelector = getFieldDecorator( 'prefix', {
      initialValue: 'Costa Rica (+506)',
    } )(
      <Select style={ { width: 200 } } showSearch={ true } onChange={ this._handlePhoneAreaCode }>
        { _.map( PhoneAreaCode.countries, ({ code, name }) =>
          <Option key={ code } value={ `${ name }, ${ code }` }>{ `${ name } (${ code })` }</Option> )
        }
      </Select>,
    );
    return (
      <Draggable
        handle=".handle"
      >
        <div className="modal-main-wrapper ant-modal-content ant-modal-body">
          <Button className="ant-modal-close" style={ { height: 'auto' } } onClick={ this.props.onCloseModal }>
            <span className="ant-modal-close-x">
              <Icon type="close"/>
            </span>

          </Button>
          <div className="handle" style={ { textAlign: 'center' } }>
            <h3>Referral Ticket</h3>
            <h2>{ user.username || '' } <span className="status-online"></span></h2>
          </div>
          <Form onSubmit={ this._handleSubmit } className="auth-form">
            <Form.Item label={ t( 'firstName' ) }>
              { getFieldDecorator( 'firstName', {
                rules: [
                  {
                    required: true,
                    message: `${ t( 'requiredFieldMessage' ) } ${ t( 'firstName' ) }`,
                  },
                ],
              } )( <Input placeholder={ t( 'firstName' ) } name="firstName" onChange={ this._handleChange }/> ) }
            </Form.Item>
            <Form.Item label={ t( 'lastName' ) }>
              { getFieldDecorator( 'lastName', {
                rules: [
                  {
                    required: true,
                    message: `${ t( 'requiredFieldMessage' ) } ${ t( 'lastName' ) }`,
                  },
                ],
              } )( <Input placeholder={ t( 'lastName' ) } name="lastName" onChange={ this._handleChange }/> ) }
            </Form.Item>
            <Form.Item label="Email">
              { getFieldDecorator( 'email', {
                rules: [ {
                  type: 'email', message: t( 'notValidMessage' ),
                }, {
                  required: true,
                  message: `${ t( 'requiredFieldMessage' ) } ${ t( 'firstName' ) }`,
                } ],
              } )(
                <Input name="email" type="email" onChange={ this._handleChange }
                       prefix={ <Icon type="mail" style={ { color: 'rgba(0,0,0,.25)' } }/> } placeholder="Email"/>
              ) }
            </Form.Item>
            <Form.Item label={ t( 'phone' ) }>
              { getFieldDecorator( 'phoneNumber', {
                rules: [
                  {
                    required: true,
                    message: `${ t( 'requiredFieldMessage' ) } ${ t( 'phone' ) }`,
                  },
                ],
              } )( <Input style={ { width: '100%' } } addonBefore={ prefixSelector } placeholder={ t( 'phone' ) }
                          name="phoneNumber" onChange={ this._handleChange }/> ) }
            </Form.Item>
            <Form.Item label={ t( 'country' ) }>
              { getFieldDecorator( 'country', {
                rules: [
                  {
                    required: true,
                    message: `${ t( 'requiredFieldMessage' ) } ${ t( 'country' ) }`,
                  },
                ],
              } )( <Input placeholder={ t( 'country' ) } name="country" onChange={ this._handleChange }/> ) }
            </Form.Item>
            <Form.Item label={ t( 'city' ) }>
              { getFieldDecorator( 'city', {
                rules: [
                  {
                    required: true,
                    message: `${ t( 'requiredFieldMessage' ) } ${ t( 'city' ) }`,
                  },
                ],
              } )( <Input placeholder={ t( 'city' ) } name="city" onChange={ this._handleChange }/> ) }
            </Form.Item>
            <Form.Item label={ t( 'occupation' ) }>
              { getFieldDecorator( 'jobTitle', {
                rules: [
                  {
                    required: true,
                    message: `${ t( 'requiredFieldMessage' ) } ${ t( 'occupation' ) }`,
                  },
                ],
              } )( <Input placeholder={ t( 'occupation' ) } name="jobTitle" onChange={ this._handleChange }/> ) }
            </Form.Item>
            <Form.Item label={ `${ t( 'investmentAmount' ) } $` }>
              { getFieldDecorator( 'initialAmount', {
                rules: [ { required: false, message: `${ t( 'requiredFieldMessage' ) } ${ t( 'investmentAmount' ) }` },
                  {
                    validator: (rule, amount) => AmountFormatValidation( rule, amount )
                  }
                ],
              } )(
                <Input name="initialAmount" onChange={ this._handleChange }
                       placeholder={ `${ t( 'investmentAmount' ) } $` }/>
              ) }
            </Form.Item>
            <Form.Item label={ t( 'buyBrokerGuarantee' ) }>
              { getFieldDecorator( 'hasBrokerGuarantee', { valuePropName: 'checked' } )(
                <Switch name="hasBrokerGuarantee" onChange={ (e) => this._handleChange( {
                  target: {
                    type: 'checkbox',
                    checked: e,
                    name: 'hasBrokerGuarantee'
                  }
                } ) } checkedChildren={ t( 'yes' ) } unCheckedChildren="No"/>
              ) }
            </Form.Item>
            <Form.Item label={ t( 'brokerGuaranteeCode' ) }>
              { getFieldDecorator( 'brokerGuaranteeCode', {
                rules: [
                  {
                    required: false,
                    message: `${ t( 'requiredFieldMessage' ) } ${ t( 'brokerGuaranteeCode' ) }`
                  },
                ],
              } )( <Input placeholder={ t( 'brokerGuaranteeCode' ) } name="brokerGuaranteeCode"
                          onChange={ this._handleChange }/> ) }
            </Form.Item>
            <Form.Item label={ t( 'quantity' ) }>
              { getFieldDecorator( 'quantity', {
                rules: [
                  {
                    required: false,
                    message: `${ t( 'requiredFieldMessage' ) } ${ t( 'quantity' ) }`
                  },
                ],
              } )( <Input placeholder={ t( 'quantity' ) } name="quantity" onChange={ this._handleChange }/> ) }
            </Form.Item>
            <Form.Item label={ t( 'personalID' ) }>
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
                  fileList={ fileList }
                  onRemove={ this._handleRemoveUploadedFiles }
                >
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox"/>
                  </p>
                  <p className="ant-upload-text">{ t( 'uploadFileIndicator' ) }</p>
                  <p className="ant-upload-hint">{ t( 'uploadFileFormatValid' ) }</p>
                </Upload.Dragger>,
              ) }
            </Form.Item>
            <Form.Item label={ `IB ${t('Collaborator')}` }>
              { getFieldDecorator( 'collaboratorIB', {
                rules: [
                  {
                    required: false,
                    message:  `${ t( 'requiredFieldMessage' ) } IB ${t('Collaborator')} }`
                  },
                ],
              } )( <Input placeholder={ `IB ${t('Collaborator')}` } name="collaboratorIB" onChange={ this._handleChange }/> ) }
            </Form.Item>
            <Form.Item label={ t('referredClientDescription') }>
              { getFieldDecorator( 'description', {
                rules: [
                  {
                    required: true,
                    message: `${ t( 'requiredFieldMessage' ) } ${t('referredClientDescription')} }`,
                  },
                ],
              } )( <TextArea placeholder={t('referredClientDescription')} name="description"
                             onChange={ this._handleChange }/> ) }
            </Form.Item>
            <Form.Item>
              <Button style={ { width: '100%' } } type="primary" htmlType="submit" size="large"
                      className="login-form-button"
                      disabled={ this.props.isReferralLoading } loading={ this.props.isReferralLoading }>
                {t('btn sendReference')}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Draggable>
    )
  }
}

export default ( Form.create( { name: 'register' } )( withNamespaces()( ReferralForm ) ) );
