import React, { PureComponent } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

moment.locale( 'es' ); // Set Lang to Spanish

import { Input, Row, Col, Button, Form, Tag, DatePicker, Icon, Switch, Upload, Select, Divider } from 'antd';

import { AmountFormatValidation } from '../../common/utils';

const { TextArea } = Input;
const { Option } = Select

class AddOrEditForm extends PureComponent {
  state = {
    currencyType: '',
    accountRCM: '',
    amount: 0.0,
    commissionsCharge: 0.0,
    commissionsReferenceDetail: '',
    beneficiaryPersonAccountNumber: '',
    beneficiaryPersonLastName: '',
    beneficiaryPersonAddress: '',

    beneficiaryBankName: '',
    beneficiaryBankSwift: '',
    beneficiaryBankABA: '',
    beneficiaryBankAddress: '',
    intermediaryBankName: '',
    intermediaryBankSwift: '',
    intermediaryBankABA: '',
    intermediaryBankAddress: '',
    intermediaryBankAccountInterBank: '',

    transferMethod: '',
    accountWithdrawalRequest: '',
    createdAt: '',
    updatedAt: '',
    closedAt: '',
    confirmDirty: false,
    isInvalid: true,
    username: '',
    status: 1,
    isLoaded: false
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {
      ...prevState
    };
    if (!_.isEmpty( nextProps.selectedWireTransferRequest ) && !prevState.isLoaded) {
      _.assignIn( updatedState, {
        ...nextProps.selectedWireTransferRequest,
        isLoaded: true
      } )

    }
    return !_.isEmpty( updatedState ) ? updatedState : null;
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
        const saveState = _.omit( this.state, [ 'confirmDirty', 'isInvalid' ] );
        if (_.isEqual( this.props.actionType, 'add' )) {
          this.props.onAddNew( saveState )
        } else {
          this.props.onEdit( saveState )
        }
      }
    } );

  };

  _handleChangeSelect = (event) => {
    const { value, name } = event;

    this.setState( {
      [ name ]: value
    } )
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const isAddAction = _.isEqual( this.props.actionType, 'add' );

    // Default values for edit action
    const statusInitValue = !_.isNil( this.state.status ) ? this.state.status : undefined;

    const usernameInitValue = !_.isEmpty( this.state.username ) ? this.state.username : undefined;
    const currencyTypeInitValue = !_.isEmpty( this.state.currencyType ) ? this.state.currencyType : undefined;
    const accountRCMInitValue = !_.isEmpty( this.state.accountRCM ) ? this.state.accountRCM : undefined;
    const transferMethodInitValue = !_.isEmpty( this.state.transferMethod ) ? this.state.transferMethod : undefined;
    const accountWithdrawalRequestInitValue = !_.isEmpty( this.state.accountWithdrawalRequest ) ? this.state.accountWithdrawalRequest : undefined;

    const amountInitValue = this.state.amount ? this.state.amount : undefined;
    const commissionsChargeInitValue = this.state.commissionsCharge ? this.state.commissionsCharge : undefined;
    const commissionsReferenceDetailInitValue = !_.isEmpty( this.state.commissionsReferenceDetail ) ? this.state.commissionsReferenceDetail : undefined;
    const beneficiaryPersonAccountNumberInitValue = !_.isEmpty( this.state.beneficiaryPersonAccountNumber ) ? this.state.beneficiaryPersonAccountNumber : undefined;
    const beneficiaryPersonFirstNameInitValue = !_.isEmpty( this.state.beneficiaryPersonFirstName ) ? this.state.beneficiaryPersonFirstName : undefined;
    const beneficiaryPersonLastNameInitValue = !_.isEmpty( this.state.beneficiaryPersonLastName ) ? this.state.beneficiaryPersonLastName : undefined;
    const notesInitValue = !_.isEmpty( this.state.notes ) ? this.state.notes : undefined;

    const beneficiaryPersonAddressInitValue = !_.isEmpty( this.state.beneficiaryPersonAddress ) ? this.state.beneficiaryPersonAddress : undefined;
    const beneficiaryBankNameInitValue = !_.isEmpty( this.state.beneficiaryBankName ) ? this.state.beneficiaryBankName : undefined;
    const beneficiaryBankSwiftInitValue = !_.isEmpty( this.state.beneficiaryBankSwift ) ? this.state.beneficiaryBankSwift : undefined;
    const beneficiaryBankABAInitValue = !_.isEmpty( this.state.beneficiaryBankABA ) ? this.state.beneficiaryBankABA : undefined;
    const beneficiaryBankAddressInitValue = !_.isEmpty( this.state.beneficiaryBankAddress ) ? this.state.beneficiaryBankAddress : undefined;

    const intermediaryBankNameInitValue = !_.isEmpty( this.state.intermediaryBankName ) ? this.state.intermediaryBankName : undefined;
    const intermediaryBankSwiftInitValue = !_.isEmpty( this.state.intermediaryBankSwift ) ? this.state.intermediaryBankSwift : undefined;
    const intermediaryBankABAInitValue = !_.isEmpty( this.state.intermediaryBankABA ) ? this.state.intermediaryBankABA : undefined;

    const intermediaryBankAddressInitValue = !_.isEmpty( this.state.intermediaryBankAddress ) ? this.state.intermediaryBankAddress : undefined;
    const intermediaryBankAccountInterBankInitValue = !_.isEmpty( this.state.intermediaryBankAccountInterBank ) ? this.state.intermediaryBankAccountInterBank : undefined;


    return (
      <Form onSubmit={ this._handleSubmit } className="auth-form">
        <Row gutter={ 16 }>
          <Col xs={ 24 } sm={ 12 }>
            <Form.Item label="Usuario">
              { getFieldDecorator( 'username', {
                initialValue: usernameInitValue,
                rules: [
                  {
                    required: false,
                  },
                ],
              } )( <Input placeholder="Usuario" name="username" readOnly/> ) }
            </Form.Item>
          </Col>
          <Col xs={ 24 } sm={ 12 }>
            <Form.Item label="Seleccione la moneda de transferencia">
              { getFieldDecorator( 'currencyType', {
                rules: [
                  {
                    required: true,
                    message: `Requerido Moneda`,
                  },
                ],
                initialValue: currencyTypeInitValue,
              } )(
                <Select
                  onChange={ value => this._handleChangeSelect( { name: 'currencyType', value } ) }>
                  <Option value="USD">USD</Option>
                  <Option value="EUR">EUR</Option>
                  <Option value="GBP">GBP</Option>
                </Select>
              ) }
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={ 16 }>
          <Col xs={ 24 } sm={ 12 }>
            <Form.Item label="Cuenta RCM">
              { getFieldDecorator( 'accountRCM', {
                initialValue: accountRCMInitValue,
                rules: [ {
                  required: true,
                  message: 'Por favor ingrese la cuenta RCM',
                } ],
              } )(
                <Input name="accountRCM" type="accountRCM" onChange={ this._handleChange }
                       prefix={ <Icon type="bank" style={ { color: 'rgba(0,0,0,.25)' } }/> } placeholder="Cuenta"/>
              ) }
            </Form.Item>
          </Col>
          <Col xs={ 24 } sm={ 12 }>
            <Form.Item label="Método de transferencia">
              { getFieldDecorator( 'transferMethod', {
                initialValue: transferMethodInitValue,
                rules: [
                  {
                    required: true,
                    message: `Requerido Método de transferencia`,
                  },
                ],
              } )(
                <Select
                  onChange={ value => this._handleChangeSelect( { name: 'transferMethod', value } ) }>

                  <Option value="Banco">Banco</Option>
                  <Option value="MoneyGram">MoneyGram</Option>
                </Select>
              ) }
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={ 16 }>
          <Col xs={ 24 } sm={ 12 }>
            <Form.Item label="Cuenta para retiro de fondos">
              { getFieldDecorator( 'accountWithdrawalRequest', {
                initialValue: accountWithdrawalRequestInitValue,
                rules: [
                  {
                    required: false,
                  },
                ],
              } )(
                // <Select
                //   onChange={ value => this._handleChangeSelect( { name: 'accountWithdrawalRequest', value } ) }>
                //   <Option value="OTC">OTC</Option>
                //   <Option value="ProfitMonth">ProfitMonth</Option>
                //   <Option value="Comisiones">Comisiones</Option>
                // </Select>
                <Input
                  name="accountWithdrawalRequest"
                  onChange={ this._handleChange }
                  placeholder={ `Cuenta para retiro de fondos` }
                />
              ) }
            </Form.Item>
          </Col>
          <Col xs={ 24 } sm={ 12 }>
            <Form.Item label={ `Monto USD` }>
              { getFieldDecorator( 'amount', {
                initialValue: amountInitValue,
                value: amountInitValue,
                rules: [
                  {
                    required: false,
                  },
                  {
                    validator: (rule, commissionsCharge) => AmountFormatValidation( rule, commissionsCharge ),
                  },
                ],
              } )(
                <Input
                  name="amount"
                  onChange={ this._handleChange }
                  placeholder={ `Monto USD` }
                />
              ) }

            </Form.Item>
          </Col>
        </Row>
        <Row gutter={ 16 }>
          <Col xs={ 24 } sm={ 12 }>
            <Form.Item label={ `Cobro de Comisiones USD` }>
              { getFieldDecorator( 'commissionsCharge', {
                initialValue: commissionsChargeInitValue,
                rules: [
                  {
                    required: false,
                  },
                  {
                    validator: (rule, commissionsCharge) => AmountFormatValidation( rule, commissionsCharge ),
                  },
                ],
              } )(
                <Input
                  name="commissionsCharge"
                  onChange={ this._handleChange }
                  placeholder={ `Cobro de Comisiones USD` }
                />
              ) }

            </Form.Item>
          </Col>
          <Col xs={ 24 } sm={ 12 }>
            <Form.Item label="Detalle de las referencias que generaron comisiones">
              { getFieldDecorator( 'description', {
                initialValue: commissionsReferenceDetailInitValue,
                rules: [
                  {
                    required: false,
                  },
                ],
              } )( <TextArea rows={ 3 } placeholder="Detalle de las referencias que generaron comisiones"
                             name="commissionsReferenceDetail"
                             onChange={ this._handleChange }/> ) }
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Detalles de Cuenta ( Beneficiario)</Divider>

        <Row gutter={ 16 }>
          <Col xs={ 24 } sm={ 12 }><Form.Item label="Número de Cuenta">
            { getFieldDecorator( 'beneficiaryPersonAccountNumber', {
              initialValue: beneficiaryPersonAccountNumberInitValue,
              rules: [
                {
                  required: true,
                  message: 'Por favor ingrese Número de Cuenta',
                },
              ],
            } )( <Input placeholder="Número de Cuenta" name="beneficiaryPersonAccountNumber"
                        onChange={ this._handleChange }/> ) }
          </Form.Item></Col>
          <Col xs={ 24 } sm={ 12 }>
            <React.Fragment>
              <Col xs={ 24 } sm={ 12 }>
                <Form.Item label="Nombre">
                  { getFieldDecorator( 'beneficiaryPersonFirstName', {
                    initialValue: beneficiaryPersonFirstNameInitValue,
                    rules: [
                      {
                        required: true,
                        message: 'Por favor ingrese Nombre',
                      },
                    ],
                  } )( <Input placeholder="Nombre" name="beneficiaryPersonFirstName"
                              onChange={ this._handleChange }/> ) }
                </Form.Item>
              </Col>
              <Col xs={ 24 } sm={ 12 }>
                <Form.Item label="Apellido">
                  { getFieldDecorator( 'beneficiaryPersonLastName', {
                    initialValue: beneficiaryPersonLastNameInitValue,
                    rules: [
                      {
                        required: false,
                        message: 'Por favor ingrese Apellido',
                      },
                    ],
                  } )( <Input placeholder="Apellido" name="beneficiaryPersonLastName"
                              onChange={ this._handleChange }/> ) }
                </Form.Item>
              </Col>
            </React.Fragment>
          </Col>
        </Row>
        <Row gutter={ 16 }>
          <Col>
            <Form.Item label={ `Dirección` }>
              { getFieldDecorator( 'beneficiaryPersonAddress', {
                initialValue: beneficiaryPersonAddressInitValue,
                rules: [
                  {
                    required: true,
                    message: `Requerido Dirección`,
                  },
                ],
              } )(
                <TextArea rows={ 4 }
                          name="beneficiaryPersonAddress"
                          onChange={ this._handleChange }
                          placeholder={ `Dirección` }
                />
              ) }

            </Form.Item>
          </Col>
        </Row>


        <Divider orientation="left">Banco Beneficiario</Divider>
        <Row>
          <Col xs={ 24 } sm={ 24 }>
            <Form.Item label="Nombre del Banco">
              { getFieldDecorator( 'beneficiaryBankName', {
                initialValue: beneficiaryBankNameInitValue,
                rules: [
                  {
                    required: true,
                    message: 'Por favor ingrese su Nombre del Banco',
                  },
                ],
              } )( <Input placeholder="Nombre del Banco" name="beneficiaryBankName"
                          onChange={ this._handleChange }/> ) }
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={ 16 }>
          <Form.Item label="Swift">
            { getFieldDecorator( 'beneficiaryBankSwift', {
              initialValue: beneficiaryBankSwiftInitValue,
              rules: [
                {
                  required: false,
                  message: 'Por favor ingrese Swift',
                },
              ],
            } )( <Input placeholder="Swift" name="beneficiaryBankSwift"
                        onChange={ this._handleChange }/> ) }
          </Form.Item>
        </Row>
        <Row gutter={ 16 }>
          <Form.Item label="ABA">
            { getFieldDecorator( 'beneficiaryBankABA', {
              initialValue: beneficiaryBankABAInitValue,
              rules: [
                {
                  required: false,
                  message: 'Por favor ingrese ABA',
                },
              ],
            } )( <Input placeholder="ABA" name="beneficiaryBankABA"
                        onChange={ this._handleChange }/> ) }
          </Form.Item>
        </Row>
        <Row gutter={ 16 }>
          <Col>
            <Form.Item label={ `Dirección` }>
              { getFieldDecorator( 'beneficiaryBankAddress', {
                initialValue: beneficiaryBankAddressInitValue,
                rules: [
                  {
                    required: true,
                    message: `Requerida Dirección`,
                  },
                ],
              } )(
                <TextArea rows={ 4 }
                          name="beneficiaryBankAddress"
                          onChange={ this._handleChange }
                          placeholder={ `Dirección` }
                />
              ) }

            </Form.Item>
          </Col>
        </Row>


        <Divider orientation="left">Banco Intermediario</Divider>
        <Row>
          <Col xs={ 24 } sm={ 24 }>
            <Form.Item label="Nombre del Banco">
              { getFieldDecorator( 'intermediaryBankName', {
                initialValue: intermediaryBankNameInitValue,
                rules: [
                  {
                    required: false,
                  },
                ],
              } )( <Input placeholder="Nombre del Banco" name="intermediaryBankName"
                          onChange={ this._handleChange }/> ) }
            </Form.Item>
          </Col>
          <Col xs={ 24 } sm={ 24 }>
            <Form.Item label="Swift">
              { getFieldDecorator( 'intermediaryBankSwift', {
                initialValue: intermediaryBankSwiftInitValue,
                rules: [
                  {
                    required: false,
                    message: 'Por favor ingrese Swift',
                  },
                ],
              } )( <Input placeholder="Swift" name="intermediaryBankSwift"
                          onChange={ this._handleChange }/> ) }
            </Form.Item>
          </Col>
          <Col xs={ 24 } sm={ 24 }>
            <Form.Item label="ABA">
              { getFieldDecorator( 'intermediaryBankABA', {
                initialValue: intermediaryBankABAInitValue,
                rules: [
                  {
                    required: false,
                    message: 'Por favor ingrese ABA',
                  },
                ],
              } )( <Input placeholder="ABA" name="intermediaryBankABA"
                          onChange={ this._handleChange }/> ) }
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={ 16 }>
          <Col xs={ 24 } sm={ 24 }>
            <Form.Item label={ `Dirección` }>
              { getFieldDecorator( 'intermediaryBankAddress', {
                initialValue: intermediaryBankAddressInitValue,
                rules: [
                  {
                    required: true,
                    message: `Requerida Dirección`,
                  },
                ],
              } )(
                <Input
                  name="intermediaryBankAddress"
                  onChange={ this._handleChange }
                  placeholder={ `Dirección` }
                />
              ) }

            </Form.Item>
          </Col>
          <Col xs={ 24 } sm={ 24 }>
            <Form.Item label="Cuenta entre bancos">
              { getFieldDecorator( 'intermediaryBankAccountInterBank', {
                initialValue: intermediaryBankAccountInterBankInitValue,
                rules: [
                  {
                    required: false,
                  },
                ],
              } )( <Input placeholder="Nombre del Banco" name="intermediaryBankAccountInterBank"
                          onChange={ this._handleChange }/> ) }
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={ 16 }>

        </Row>


        <Row>
          <Col xs={ 24 } sm={ 12 }></Col>
          <Col xs={ 24 } sm={ 12 }></Col>
        </Row>


        <hr/>
        <Row>
          <Col>
            <Form.Item label="Estado">
              { getFieldDecorator( 'status', {
                initialValue: statusInitValue,
                rules: [ { required: true, message: 'Por favor indique el estado' } ],
              } )(
                <Select
                  name="status"
                  onChange={ value => this._handleChangeSelect( { name: 'status', value } ) }
                  placeholder="Estado"
                  showArrow={ isAddAction }
                >
                  <Option value={ 1 }>Activo</Option>
                  <Option value={ 4 }>Cancelado</Option>
                </Select>
              ) }
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Notas Administrativas">
          { getFieldDecorator( 'notes', {
            initialValue: notesInitValue,
            rules: [
              {
                required: false,
                message: 'Por favor ingrese su nota',
              },
            ],
          } )( <TextArea rows={ 8 } placeholder="" name="notes"
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
  return {}
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {}, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Form.create( { name: 'register' } )( AddOrEditForm ) );