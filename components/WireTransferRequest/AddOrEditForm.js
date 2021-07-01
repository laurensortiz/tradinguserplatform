import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'

moment.locale('es') // Set Lang to Spanish

import { Input, Row, Col, Button, Form, DatePicker, Icon, Select, Divider, Switch } from 'antd'

import { accountOperations } from '../../state/modules/accounts'
import { userOperations } from '../../state/modules/users'
import { userAccountOperations } from '../../state/modules/userAccounts'

const { TextArea } = Input
const { Option } = Select

const NO_MONEY_ERROR_MESSAGE =
  'Su solicitud sobrepasa lo permitido por el exchange o no tiene garantías suficientes en su cuenta.'

class AddOrEditForm extends PureComponent {
  state = {
    currencyType: '',
    accountRCM: '',
    amount: 0.0,
    commissionsCharge: 0.0,
    commissionsReferenceDetail: '',
    beneficiaryPersonID: '',
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
    createdAt: null,
    updatedAt: null,
    closedAt: null,
    confirmDirty: false,
    isInvalid: true,
    username: '',
    status: 1,
    isLoaded: false,
    accounts: [],
    currentUserAccountList: [],
    userAccount: {},
    userAccountId: null,
    isAmountValidationActive: true,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {
      ...prevState,
    }

    if (
      nextProps.actionType === 'edit' &&
      Object.keys(nextProps.selectedWireTransferRequest).length > 0 &&
      nextProps.selectedWireTransferRequest.userAccountId !== prevState.userAccountId
    ) {
      const userAccount = nextProps.accounts.find(
        ({ id }) => id == nextProps.selectedWireTransferRequest.userAccountId
      )
      _.assign(updatedState, {
        userAccount,
      })
    }

    if (!_.isEqual(nextProps.users, prevState.users)) {
      _.assign(updatedState, {
        users: _.filter(nextProps.users, { roleId: 2, status: 1 }),
      })
    }

    if (!_.isEmpty(nextProps.selectedWireTransferRequest) && !prevState.isLoaded) {
      _.assignIn(updatedState, {
        ...nextProps.selectedWireTransferRequest,
        isLoaded: true,
      })
    }

    return !_.isEmpty(updatedState) ? updatedState : null
  }

  componentDidMount() {
    if (_.isEmpty(this.state.users)) {
      this.props.fetchGetUsers()
    }
  }

  _getAccountSelectOption = (options) => {
    return _.map(options, ({ id, account }) => (
      <Option key={`${id}_${account.name}_${account.associatedOperation}`}>{account.name}</Option>
    ))
  }

  _getUserSelectOption = (options) => {
    return _.map(options, ({ id, username }) => (
      <Option key={`${id}_${username}`}>{username}</Option>
    ))
  }

  _handleChange = (e) => {
    let value = ''
    if (e.target.type === 'checkbox') {
      value = e.target.checked ? 1 : 0
    } else {
      value = e.target.value
    }
    this.setState({ [e.target.name]: value })
  }

  _handleSubmit = (e) => {
    e.preventDefault()
    const saveState = _.omit(this.state, [
      'confirmDirty',
      'isInvalid',
      'accounts',
      'users',
      'userAccount',
    ])

    this.props.form.validateFields((err, values) => {
      console.log('[=====  ERR  =====>')
      console.log(err)
      console.log('<=====  /ERR  =====]')
      if (!err) {
        const { id, guaranteeOperation } = this.state.userAccount

        if (_.isEqual(this.props.actionType, 'add')) {
          this.props.onAddNew({
            ...saveState,
            userAccountId: id,
            guaranteeOperationNet:
              Number(guaranteeOperation) -
              (Number(this.state.amount) + Number(this.state.commissionsCharge)),
          })
        } else {
          this.props.onEdit(saveState)
        }
      }
    })
  }

  _handleChangeSelect = (event) => {
    const { value, name } = event

    this.setState({
      [name]: value,
    })
  }

  _handleCustomChangeSelect = (event) => {
    const { value } = event
    const fieldName = event.name
    const codeIdName = value.split('_')

    const id = Number(codeIdName[0])
    const name = codeIdName[1]

    if (_.isEqual(fieldName, 'username')) {
      const currentUserAccountList = this.props.accounts.filter(({ userId }) => userId === id)
      const accountRCM = currentUserAccountList[0].user.userID || ''

      this.setState({
        username: name,
        currentUserAccountList,
        accountRCM,
      })
    } else if (_.isEqual(fieldName, 'accountWithdrawalRequest')) {
      const userAccount = this.props.accounts.find((account) => account.id === id)
      this.setState({
        accountWithdrawalRequest: name,
        associatedOperation: Number(codeIdName[2] || 1),
        userAccount,
      })
    } else {
      this.setState({
        [fieldName]: value,
      })
    }
  }

  _setCreatedDate = (date) => {
    this.setState({
      createdAt: moment.tz(date, 'America/New_York').format(),
    })
  }
  _setClosedDate = (date) => {
    this.setState({
      closedAt: moment.tz(date, 'America/New_York').format(),
    })
  }

  handleInversion = (rule, value, callback) => {
    const regex = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/
    const userStartedDay = this.state.userAccount.user.startDate
    const { associatedOperation, percentage } = this.state.userAccount.account
    const isOTCAccount = associatedOperation === 1

    const { accountValue, guaranteeOperation } = this.state.userAccount

    const is10percent = moment(userStartedDay).isBefore('2020-12-15', 'day')

    let percentageFromAccount

    if (isOTCAccount) {
      percentageFromAccount = is10percent ? 10 : 7.5
    } else {
      percentageFromAccount = 100
    }

    const amountAvailable = (accountValue / 100) * percentageFromAccount

    return new Promise((resolve, reject) => {
      if (
        !Object.keys(this.state.userAccount).length ||
        this.state.status === 4 ||
        value == this.state.amount
      ) {
        resolve()
      }
      if (!_.isEmpty(value) && !regex.test(value)) {
        reject('Formato inválido del monto') // reject with error message
      }

      if (parseFloat(value) == 0) {
        reject('El monto solicitado debe ser mayor a 0')
      }

      // Next validation only applies to OTC accounts
      if (isOTCAccount) {
        if (parseFloat(guaranteeOperation) < 0) {
          reject(NO_MONEY_ERROR_MESSAGE)
        }
        if (parseFloat(guaranteeOperation) - parseFloat(value) < 0) {
          reject(NO_MONEY_ERROR_MESSAGE)
        }
      }

      if (parseFloat(amountAvailable) - parseFloat(value) < 0) {
        reject(NO_MONEY_ERROR_MESSAGE) // reject with error message
      } else {
        resolve()
      }
    })
  }

  handleCommission = (rule, value, callback) => {
    const regex = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/

    const { commissionByReference } = this.state.userAccount

    return new Promise((resolve, reject) => {
      if (!Object.keys(this.state.userAccount).length || this.state.status === 4) {
        resolve()
        return
      }
      if (Number(value) > 0 && !_.isEmpty(value) && !regex.test(value)) {
        reject('Formato inválido del monto') // reject with error message
      }

      // if (parseFloat(value) == 0) {
      //   reject('La opereración debe ser mayor a 0')
      // }

      if (parseFloat(commissionByReference || 0) - parseFloat(value) < 0) {
        reject(NO_MONEY_ERROR_MESSAGE) // reject with error message
      } else {
        resolve()
      }
    })
  }

  _handleActiveValidation = (e) => {
    this.setState({
      isAmountValidationActive: e,
    })
  }

  render() {
    const { getFieldDecorator, resetFields } = this.props.form

    // if (
    //   (!this.state.commissionsCharge && Number(this.state.commissionsCharge) <= 0) ||
    //   !this.state.isAmountValidationActive
    // ) {
    //   resetFields(['commissionsCharge'])
    // }
    //
    // if (!this.state.isAmountValidationActive) {
    //   resetFields(['amount'])
    // }

    // Default values for edit action
    const statusInitValue = !_.isNil(this.state.status) ? this.state.status : undefined

    const usernameInitValue = !_.isEmpty(this.state.username) ? this.state.username : undefined
    const currencyTypeInitValue = !_.isEmpty(this.state.currencyType)
      ? this.state.currencyType
      : undefined
    const accountRCMInitValue = !_.isEmpty(this.state.accountRCM)
      ? this.state.accountRCM
      : undefined
    const transferMethodInitValue = !_.isEmpty(this.state.transferMethod)
      ? this.state.transferMethod
      : undefined
    const accountWithdrawalRequestInitValue = !_.isEmpty(this.state.accountWithdrawalRequest)
      ? this.state.accountWithdrawalRequest
      : undefined

    const amountInitValue = this.state.amount ? this.state.amount : undefined
    const commissionsChargeInitValue = this.state.commissionsCharge
      ? this.state.commissionsCharge
      : undefined
    const commissionsReferenceDetailInitValue = !_.isEmpty(this.state.commissionsReferenceDetail)
      ? this.state.commissionsReferenceDetail
      : undefined
    const beneficiaryPersonAccountNumberInitValue = !_.isEmpty(
      this.state.beneficiaryPersonAccountNumber
    )
      ? this.state.beneficiaryPersonAccountNumber
      : undefined
    const beneficiaryPersonIDInitValue = !_.isEmpty(this.state.beneficiaryPersonID)
      ? this.state.beneficiaryPersonID
      : undefined
    const beneficiaryPersonFirstNameInitValue = !_.isEmpty(this.state.beneficiaryPersonFirstName)
      ? this.state.beneficiaryPersonFirstName
      : undefined
    const beneficiaryPersonLastNameInitValue = !_.isEmpty(this.state.beneficiaryPersonLastName)
      ? this.state.beneficiaryPersonLastName
      : undefined
    const notesInitValue = !_.isEmpty(this.state.notes) ? this.state.notes : undefined

    const beneficiaryPersonAddressInitValue = !_.isEmpty(this.state.beneficiaryPersonAddress)
      ? this.state.beneficiaryPersonAddress
      : undefined
    const beneficiaryBankNameInitValue = !_.isEmpty(this.state.beneficiaryBankName)
      ? this.state.beneficiaryBankName
      : undefined
    const beneficiaryBankSwiftInitValue = !_.isEmpty(this.state.beneficiaryBankSwift)
      ? this.state.beneficiaryBankSwift
      : undefined
    const beneficiaryBankABAInitValue = !_.isEmpty(this.state.beneficiaryBankABA)
      ? this.state.beneficiaryBankABA
      : undefined
    const beneficiaryBankAddressInitValue = !_.isEmpty(this.state.beneficiaryBankAddress)
      ? this.state.beneficiaryBankAddress
      : undefined

    const intermediaryBankNameInitValue = !_.isEmpty(this.state.intermediaryBankName)
      ? this.state.intermediaryBankName
      : undefined
    const intermediaryBankSwiftInitValue = !_.isEmpty(this.state.intermediaryBankSwift)
      ? this.state.intermediaryBankSwift
      : undefined
    const intermediaryBankABAInitValue = !_.isEmpty(this.state.intermediaryBankABA)
      ? this.state.intermediaryBankABA
      : undefined

    const intermediaryBankAddressInitValue = !_.isEmpty(this.state.intermediaryBankAddress)
      ? this.state.intermediaryBankAddress
      : undefined
    const intermediaryBankAccountInterBankInitValue = !_.isEmpty(
      this.state.intermediaryBankAccountInterBank
    )
      ? this.state.intermediaryBankAccountInterBank
      : undefined

    const createdDateInitValue = !_.isNull(this.state.createdAt)
      ? moment.tz(this.state.createdAt, 'America/New_York')
      : undefined

    const closedDateInitValue = !_.isNull(this.state.closedAt)
      ? moment.tz(this.state.closedAt, 'America/New_York')
      : undefined

    return (
      <Form onSubmit={this._handleSubmit} className="auth-form">
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            {this.props.actionType === 'add' ? (
              <Form.Item label="Usuario">
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: 'Por favor ingrese el Usuario' }],
                })(
                  <Select
                    showSearch={true}
                    name="username"
                    onChange={(value) =>
                      this._handleCustomChangeSelect({ name: 'username', value })
                    }
                    placeholder="Usuario"
                    showArrow
                  >
                    {this._getUserSelectOption(this.state.users)}
                  </Select>
                )}
              </Form.Item>
            ) : (
              <Form.Item label="Usuario">
                {getFieldDecorator('username', {
                  initialValue: usernameInitValue,
                  rules: [
                    {
                      required: false,
                    },
                  ],
                })(<Input placeholder="Usuario" name="username" readOnly />)}
              </Form.Item>
            )}
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Seleccione la moneda de transferencia">
              {getFieldDecorator('currencyType', {
                rules: [
                  {
                    required: true,
                    message: `Requerido Moneda`,
                  },
                ],
                initialValue: currencyTypeInitValue,
              })(
                <Select
                  onChange={(value) => this._handleChangeSelect({ name: 'currencyType', value })}
                >
                  <Option value="USD">USD</Option>
                  <Option value="EUR">EUR</Option>
                  <Option value="GBP">GBP</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="Cuenta RCM">
              {getFieldDecorator('accountRCM', {
                initialValue: accountRCMInitValue,
                rules: [
                  {
                    required: true,
                    message: 'Por favor ingrese la cuenta RCM',
                  },
                ],
              })(
                <Input
                  name="accountRCM"
                  type="accountRCM"
                  onChange={this._handleChange}
                  prefix={<Icon type="bank" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Cuenta"
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Método de transferencia">
              {getFieldDecorator('transferMethod', {
                initialValue: transferMethodInitValue,
                rules: [
                  {
                    required: true,
                    message: `Requerido Método de transferencia`,
                  },
                ],
              })(
                <Select
                  name="transferMethod"
                  onChange={(value) => this._handleChangeSelect({ name: 'transferMethod', value })}
                >
                  <Option value="Banco">Banco</Option>
                  <Option value="Remesa">Remesa</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            {this.props.actionType === 'add' ? (
              <Form.Item label="Cuenta para retiro de fondos">
                {getFieldDecorator('accountWithdrawalRequest')(
                  <Select
                    showSearch={true}
                    name="accountWithdrawalRequest"
                    onChange={(value) =>
                      this._handleCustomChangeSelect({ name: 'accountWithdrawalRequest', value })
                    }
                    placeholder="Cuenta para retiro de fondos"
                    showArrow
                  >
                    {this._getAccountSelectOption(this.state.currentUserAccountList)}
                  </Select>
                )}
              </Form.Item>
            ) : (
              <Form.Item label="Cuenta para retiro de fondos">
                {getFieldDecorator('accountWithdrawalRequest', {
                  initialValue: accountWithdrawalRequestInitValue,
                })(
                  <Input
                    name="accountWithdrawalRequest"
                    onChange={this._handleChange}
                    placeholder={`Cuenta para retiro de fondos`}
                  />
                )}
              </Form.Item>
            )}
          </Col>
          <Col xs={24} sm={10}>
            <Col xs={18}>
              <Form.Item label={`Monto USD`}>
                {getFieldDecorator('amount', {
                  initialValue: amountInitValue,
                  value: amountInitValue,
                  rules: [
                    {
                      required: this.state.isAmountValidationActive,
                      message: 'Por favor indique el monto',
                    },
                    {
                      validator: this.handleInversion,
                    },
                  ],
                })(<Input name="amount" onChange={this._handleChange} placeholder={`Monto USD`} />)}
              </Form.Item>
            </Col>
            <Col xs={6}>
              <Switch
                onChange={this._handleActiveValidation}
                checkedChildren="Validar"
                unCheckedChildren="No Validar"
                checked={this.state.isAmountValidationActive}
                style={{ width: '100%', marginTop: 30, minWidth: 115 }}
              />
            </Col>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label={`Cobro de Comisiones USD`}>
              {getFieldDecorator('commissionsCharge', {
                initialValue: commissionsChargeInitValue,
                rules: [
                  {
                    required:
                      !!this.state.commissionsCharge && Number(this.state.commissionsCharge) > 0,
                    message: `Campo requerido`,
                  },
                  {
                    validator: this.handleCommission,
                  },
                ],
              })(
                <Input
                  name="commissionsCharge"
                  onChange={this._handleChange}
                  placeholder={`Cobro de Comisiones USD`}
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Detalle de las referencias que generaron comisiones">
              {getFieldDecorator('description', {
                initialValue: commissionsReferenceDetailInitValue,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(
                <TextArea
                  rows={3}
                  placeholder="Detalle de las referencias que generaron comisiones"
                  name="commissionsReferenceDetail"
                  onChange={this._handleChange}
                />
              )}
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Detalles de Cuenta (Beneficiario)</Divider>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            {this.state.transferMethod === 'Banco' ? (
              <Form.Item label="Número de Cuenta">
                {getFieldDecorator('beneficiaryPersonAccountNumber', {
                  initialValue: beneficiaryPersonAccountNumberInitValue,
                  rules: [
                    {
                      required: true,
                      message: 'Por favor ingrese Número de Cuenta',
                    },
                  ],
                })(
                  <Input
                    placeholder="Número de Cuenta"
                    name="beneficiaryPersonAccountNumber"
                    onChange={this._handleChange}
                  />
                )}
              </Form.Item>
            ) : (
              <Form.Item label="Número de Identificación">
                {getFieldDecorator('beneficiaryPersonID', {
                  initialValue: beneficiaryPersonIDInitValue,
                  rules: [
                    {
                      required: true,
                      message: 'Por favor ingrese Número de identificación',
                    },
                  ],
                })(
                  <Input
                    placeholder="Número de Identificación"
                    name="beneficiaryPersonID"
                    onChange={this._handleChange}
                  />
                )}
              </Form.Item>
            )}
          </Col>
          <Col xs={24} sm={12}>
            <React.Fragment>
              <Col xs={24} sm={12}>
                <Form.Item label="Nombre">
                  {getFieldDecorator('beneficiaryPersonFirstName', {
                    initialValue: beneficiaryPersonFirstNameInitValue,
                    rules: [
                      {
                        required: true,
                        message: 'Por favor ingrese Nombre',
                      },
                    ],
                  })(
                    <Input
                      placeholder="Nombre"
                      name="beneficiaryPersonFirstName"
                      onChange={this._handleChange}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Apellido">
                  {getFieldDecorator('beneficiaryPersonLastName', {
                    initialValue: beneficiaryPersonLastNameInitValue,
                    rules: [
                      {
                        required: false,
                        message: 'Por favor ingrese Apellido',
                      },
                    ],
                  })(
                    <Input
                      placeholder="Apellido"
                      name="beneficiaryPersonLastName"
                      onChange={this._handleChange}
                    />
                  )}
                </Form.Item>
              </Col>
            </React.Fragment>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col>
            <Form.Item label={`Dirección`}>
              {getFieldDecorator('beneficiaryPersonAddress', {
                initialValue: beneficiaryPersonAddressInitValue,
                rules: [
                  {
                    required: true,
                    message: `Requerido Dirección`,
                  },
                ],
              })(
                <TextArea
                  rows={4}
                  name="beneficiaryPersonAddress"
                  onChange={this._handleChange}
                  placeholder={`Dirección`}
                />
              )}
            </Form.Item>
          </Col>
        </Row>

        {/*Conditional Transfer Method*/}
        {this.state.transferMethod === 'Banco' && (
          <React.Fragment>
            <Divider orientation="left">Banco Beneficiario</Divider>
            <Row>
              <Col xs={24} sm={24}>
                <Form.Item label="Nombre del Banco">
                  {getFieldDecorator('beneficiaryBankName', {
                    initialValue: beneficiaryBankNameInitValue,
                    rules: [
                      {
                        required: false,
                        message: 'Por favor ingrese su Nombre del Banco',
                      },
                    ],
                  })(
                    <Input
                      placeholder="Nombre del Banco"
                      name="beneficiaryBankName"
                      onChange={this._handleChange}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Form.Item label="Swift">
                {getFieldDecorator('beneficiaryBankSwift', {
                  initialValue: beneficiaryBankSwiftInitValue,
                  rules: [
                    {
                      required: false,
                      message: 'Por favor ingrese Swift',
                    },
                  ],
                })(
                  <Input
                    placeholder="Swift"
                    name="beneficiaryBankSwift"
                    onChange={this._handleChange}
                  />
                )}
              </Form.Item>
            </Row>
            <Row gutter={16}>
              <Form.Item label="ABA">
                {getFieldDecorator('beneficiaryBankABA', {
                  initialValue: beneficiaryBankABAInitValue,
                  rules: [
                    {
                      required: false,
                      message: 'Por favor ingrese ABA',
                    },
                  ],
                })(
                  <Input
                    placeholder="ABA"
                    name="beneficiaryBankABA"
                    onChange={this._handleChange}
                  />
                )}
              </Form.Item>
            </Row>
            <Row gutter={16}>
              <Col>
                <Form.Item label={`Dirección`}>
                  {getFieldDecorator('beneficiaryBankAddress', {
                    initialValue: beneficiaryBankAddressInitValue,
                    rules: [
                      {
                        required: false,
                        message: `Requerida Dirección`,
                      },
                    ],
                  })(
                    <TextArea
                      rows={4}
                      name="beneficiaryBankAddress"
                      onChange={this._handleChange}
                      placeholder={`Dirección`}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Banco Intermediario</Divider>
            <Row>
              <Col xs={24} sm={24}>
                <Form.Item label="Nombre del Banco">
                  {getFieldDecorator('intermediaryBankName', {
                    initialValue: intermediaryBankNameInitValue,
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  })(
                    <Input
                      placeholder="Nombre del Banco"
                      name="intermediaryBankName"
                      onChange={this._handleChange}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={24}>
                <Form.Item label="Swift">
                  {getFieldDecorator('intermediaryBankSwift', {
                    initialValue: intermediaryBankSwiftInitValue,
                    rules: [
                      {
                        required: false,
                        message: 'Por favor ingrese Swift',
                      },
                    ],
                  })(
                    <Input
                      placeholder="Swift"
                      name="intermediaryBankSwift"
                      onChange={this._handleChange}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={24}>
                <Form.Item label="ABA">
                  {getFieldDecorator('intermediaryBankABA', {
                    initialValue: intermediaryBankABAInitValue,
                    rules: [
                      {
                        required: false,
                        message: 'Por favor ingrese ABA',
                      },
                    ],
                  })(
                    <Input
                      placeholder="ABA"
                      name="intermediaryBankABA"
                      onChange={this._handleChange}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} sm={24}>
                <Form.Item label={`Dirección`}>
                  {getFieldDecorator('intermediaryBankAddress', {
                    initialValue: intermediaryBankAddressInitValue,
                    rules: [
                      {
                        required: false,
                        message: `Requerida Dirección`,
                      },
                    ],
                  })(
                    <Input
                      name="intermediaryBankAddress"
                      onChange={this._handleChange}
                      placeholder={`Dirección`}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={24}>
                <Form.Item label="Cuenta entre bancos">
                  {getFieldDecorator('intermediaryBankAccountInterBank', {
                    initialValue: intermediaryBankAccountInterBankInitValue,
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  })(
                    <Input
                      placeholder="Nombre del Banco"
                      name="intermediaryBankAccountInterBank"
                      onChange={this._handleChange}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}></Row>
          </React.Fragment>
        )}

        <hr />
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="Estado">
              {getFieldDecorator('status', {
                initialValue: statusInitValue,
                rules: [{ required: true, message: 'Por favor indique el estado' }],
              })(
                <Select
                  name="status"
                  onChange={(value) => this._handleChangeSelect({ name: 'status', value })}
                  placeholder="Estado"
                  showArrow
                >
                  <Option value={1}>Activo</Option>
                  <Option value={2}>Liberación Local</Option>
                  <Option value={4}>Cancelado</Option>
                  <Option value={5}>Anulado</Option>
                </Select>
              )}
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item label="Fecha de Creación">
              {getFieldDecorator('createdAt', {
                initialValue: createdDateInitValue,
              })(
                <DatePicker
                  onChange={this._setCreatedDate}
                  defaultPickerValue={createdDateInitValue}
                  placeholder="Fecha de Creación"
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={6}>
            <Form.Item label="Fecha de Cancelación">
              {getFieldDecorator('closedAt', {
                initialValue: closedDateInitValue,
              })(
                <DatePicker
                  onChange={this._setClosedDate}
                  defaultPickerValue={closedDateInitValue}
                  placeholder="Fecha de Cancelación"
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Notas Administrativas">
          {getFieldDecorator('notes', {
            initialValue: notesInitValue,
            rules: [
              {
                required: false,
                message: 'Por favor ingrese su nota',
              },
            ],
          })(<TextArea rows={8} placeholder="" name="notes" onChange={this._handleChange} />)}
        </Form.Item>
        <Form.Item>
          <Button
            style={{ width: '100%' }}
            type="primary"
            htmlType="submit"
            size="large"
            className="login-form-button"
          >
            Guardar Actualización
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

function mapStateToProps(state) {
  const { userAccountsState, usersState } = state
  return {
    users: usersState.list,
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchGetAccounts: accountOperations.fetchGetAccounts,
      fetchGetUsers: userOperations.fetchGetUsers,
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create({ name: 'register' })(AddOrEditForm))
