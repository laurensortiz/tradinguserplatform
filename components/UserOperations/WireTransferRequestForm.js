import React, { PureComponent, useState, useEffect } from 'react'
import { Input, Button, Form, Switch, Icon, Select, Alert, Divider } from 'antd'
import _ from 'lodash'
import { AmountFormatValidation } from '../../common/utils'
import Draggable from 'react-draggable'
import { withNamespaces } from 'react-i18next'
import moment from 'moment'

const { TextArea } = Input
const { Option } = Select

const NO_MONEY_ERROR_MESSAGE = 'Su solicitud sobrepasa lo permitido por el exchange'

class WireTransferRequestForm extends PureComponent {
  state = {
    currencyType: '',
    accountRCM: '',
    amount: 0.0,
    commissionsCharge: 0.0,
    commissionsReferenceDetail: '',
    beneficiaryPersonAccountNumber: '',
    beneficiaryPersonID: '',
    beneficiaryPersonFirstName: '',
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
    confirmDirty: false,
    isInvalid: true,
    disabledSubmitBtn: false,
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
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const saveState = _.omit(this.state, ['confirmDirty', 'isValid', 'disabledSubmitBtn'])
        const { id, user, guaranteeOperation, account } = this.props.userAccount
        const accountWithdrawalRequest =
          account.associatedOperation === 2
            ? `ProfitMonth - ${account.name}`
            : `OTC - ${account.name}`

        this.setState({
          disabledSubmitBtn: true,
        })
        this.props.onWireTransferRequest({
          ...saveState,
          accountWithdrawalRequest,
          userAccountId: id,
          username: user.username,
          accountRCM: user.userID,
          associatedOperation: account.associatedOperation,
          guaranteeOperationNet:
            Number(guaranteeOperation) -
            (Number(this.state.amount) + Number(this.state.commissionsCharge)),
        })
      }
    })
  }

  _handleChangeSelect = (event) => {
    const { value, name } = event

    this.setState({
      [name]: value,
    })
  }

  handleInversion = (rule, value, callback) => {
    const regex = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/
    const userStartedDay = this.props.userAccount.user.startDate
    const { associatedOperation, percentage } = this.props.userAccount.account
    const isOTCAccount = associatedOperation === 1

    const { accountValue, guaranteeOperation } = this.props.userAccount

    const is10percent = moment(userStartedDay).isBefore('2020-12-15', 'day')

    let percentageFromAccount

    if (isOTCAccount) {
      percentageFromAccount = is10percent ? 10 : 7.5
    } else {
      percentageFromAccount = percentage
    }

    const amountAvailable = (accountValue / 100) * percentageFromAccount

    return new Promise((resolve, reject) => {
      if (!_.isEmpty(value) && !regex.test(value)) {
        reject('Formato inválido del monto') // reject with error message
      }

      if (parseFloat(value) == 0) {
        reject('El monto solicitado debe ser mayor a 0')
      }

      // Next validation only applies to OTC accounts
      if (isOTCAccount) {
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

    const { commissionByReference } = this.props.userAccount

    return new Promise((resolve, reject) => {
      if (!_.isEmpty(value) && !regex.test(value)) {
        reject('Formato inválido del monto') // reject with error message
      }

      if (parseFloat(value) == 0) {
        reject('La opereración debe ser mayor a 0')
      }

      if (parseFloat(commissionByReference || 0) - parseFloat(value) < 0) {
        reject(NO_MONEY_ERROR_MESSAGE) // reject with error message
      } else {
        resolve()
      }
    })
  }

  render() {
    const { t } = this.props
    const { getFieldDecorator, resetFields } = this.props.form
    const { user, account } = this.props.userAccount
    const isOTCAccount = account.associatedOperation === 1
    const currentAccountType = isOTCAccount
      ? `OTC - ${account.name}`
      : `ProfitMonth - ${account.name}`

    if (!this.state.commissionsCharge || this.state.commissionsCharge <= 0) {
      resetFields(['commissionsCharge'])
    }

    return (
      <Draggable handle=".handle">
        <div className="modal-main-wrapper ant-modal-content ant-modal-body">
          <Button
            className="ant-modal-close"
            style={{ height: 'auto' }}
            onClick={this.props.onCloseModal}
          >
            <span className="ant-modal-close-x">
              <Icon type="close" />
            </span>
          </Button>
          <div className="handle" style={{ textAlign: 'center' }}>
            <h2>Wire Transfer Request</h2>
            <h3>
              {user.username || ''} <span className="status-online"></span>
            </h3>
          </div>

          <Form onSubmit={this._handleSubmit} className="auth-form">
            <Form.Item label={t('wt transferMethod')}>
              {getFieldDecorator('transferMethod', {
                rules: [
                  {
                    required: true,
                    message: `${t('requiredFieldGeneralMessage')}`,
                  },
                ],
              })(
                <Select
                  onChange={(value) => this._handleChangeSelect({ name: 'transferMethod', value })}
                >
                  <Option value="Banco">{t('wt bank')}</Option>
                  <Option value="Remesa">{t('wt remittance')}</Option>
                </Select>
              )}
            </Form.Item>
            {this.state.transferMethod !== '' && (
              <React.Fragment>
                <Form.Item label={t('wt currencyType')}>
                  {getFieldDecorator('currencyType', {
                    rules: [
                      {
                        required: true,
                        message: `${t('requiredFieldGeneralMessage')}`,
                      },
                    ],
                  })(
                    <Select
                      onChange={(value) =>
                        this._handleChangeSelect({ name: 'currencyType', value })
                      }
                    >
                      <Option value="USD">USD</Option>
                      <Option value="EUR">EUR</Option>
                      <Option value="GBP">GBP</Option>
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label={t('wt accountWithdrawalRequest')}>
                  {getFieldDecorator('accountWithdrawalRequest', {
                    initialValue: currentAccountType,
                    rules: [
                      {
                        required: true,
                        message: `${t('requiredFieldGeneralMessage')}`,
                      },
                    ],
                  })(
                    <Input
                      disabled
                      placeholder={t('wt accountWithdrawalRequest')}
                      name="accountWithdrawalRequest"
                      onChange={this._handleChange}
                    />
                  )}
                </Form.Item>
                <Form.Item label={`RCM ${t('account')}`}>
                  {getFieldDecorator('accountRCM', {
                    initialValue: user.userID || '',
                    rules: [
                      {
                        required: true,
                        message: `${t('requiredFieldGeneralMessage')}`,
                      },
                    ],
                  })(
                    <Input
                      placeholder={`RCM ${t('account')}`}
                      name="accountRCM"
                      onChange={this._handleChange}
                      disabled={!!user.userID}
                    />
                  )}
                </Form.Item>
                <Form.Item label={`${t('amount')} USD`}>
                  {getFieldDecorator('amount', {
                    rules: [
                      { required: true, message: `${t('requiredFieldGeneralMessage')}` },
                      {
                        validator: this.handleInversion,
                      },
                    ],
                  })(
                    <div>
                      <Input
                        name="amount"
                        onChange={this._handleChange}
                        placeholder={`${t('wt amountNote')} $`}
                      />
                    </div>
                  )}
                </Form.Item>
                {isOTCAccount && (
                  <Form.Item label={`${t('commissionsCharge')} USD`}>
                    {getFieldDecorator('commissionsCharge', {
                      rules: [
                        {
                          required:
                            !!this.state.commissionsCharge && this.state.commissionsCharge > 0,
                          message: `${t('requiredFieldMessage')} ${t('commissionsCharge')} USD`,
                        },
                        {
                          validator: this.handleCommission,
                        },
                      ],
                    })(
                      <div>
                        <Input
                          name="commissionsCharge"
                          onChange={this._handleChange}
                          placeholder={`${t('commissionsCharge')} $`}
                        />
                      </div>
                    )}
                  </Form.Item>
                )}

                <Form.Item label={`${t('commissionsReferenceDetail')}`}>
                  {getFieldDecorator('commissionsReferenceDetail', {
                    rules: [
                      {
                        required: false,
                        message: `${t('requiredFieldMessage')} ${t('commissionsReferenceDetail')}`,
                      },
                    ],
                  })(
                    <div>
                      <TextArea
                        rows={4}
                        name="commissionsReferenceDetail"
                        onChange={this._handleChange}
                        placeholder={`${t('commissionsReferenceDetail')}`}
                      />
                    </div>
                  )}
                </Form.Item>
                <Divider orientation="left">{`${t('wt accountDetail')} (${t(
                  'wt beneficiary'
                )})`}</Divider>
                <p>{t('wt beneficiaryMessage')}</p>
                {this.state.transferMethod === 'Banco' ? (
                  <Form.Item label={t('account')}>
                    {getFieldDecorator('beneficiaryPersonAccountNumber', {
                      rules: [
                        {
                          required: true,
                          message: `${t('requiredFieldGeneralMessage')}`,
                        },
                      ],
                    })(
                      <Input
                        placeholder={t('account')}
                        name="beneficiaryPersonAccountNumber"
                        onChange={this._handleChange}
                      />
                    )}
                  </Form.Item>
                ) : (
                  <Form.Item label={t('personIDNumber')}>
                    {getFieldDecorator('beneficiaryPersonID', {
                      rules: [
                        {
                          required: true,
                          message: `${t('requiredFieldGeneralMessage')}`,
                        },
                      ],
                    })(
                      <Input
                        placeholder={t('personIDNumber')}
                        name="beneficiaryPersonID"
                        onChange={this._handleChange}
                      />
                    )}
                  </Form.Item>
                )}

                <Form.Item label={t('firstName')}>
                  {getFieldDecorator('beneficiaryPersonFirstName', {
                    rules: [
                      {
                        required: true,
                        message: `${t('requiredFieldGeneralMessage')}`,
                      },
                    ],
                  })(
                    <Input
                      placeholder={t('firstName')}
                      name="beneficiaryPersonFirstName"
                      onChange={this._handleChange}
                    />
                  )}
                </Form.Item>
                <Form.Item label={t('lastName')}>
                  {getFieldDecorator('beneficiaryPersonLastName', {
                    rules: [
                      {
                        required: true,
                        message: `${t('requiredFieldGeneralMessage')}`,
                      },
                    ],
                  })(
                    <Input
                      placeholder={t('lastName')}
                      name="beneficiaryPersonLastName"
                      onChange={this._handleChange}
                    />
                  )}
                </Form.Item>
                <Form.Item label={t('address')}>
                  {getFieldDecorator('beneficiaryPersonAddress', {
                    rules: [
                      {
                        required: true,
                        message: `${t('requiredFieldGeneralMessage')}`,
                      },
                    ],
                  })(
                    <div>
                      <TextArea
                        rows={4}
                        name="beneficiaryPersonAddress"
                        onChange={this._handleChange}
                        placeholder={t('address')}
                      />
                    </div>
                  )}
                </Form.Item>
                <Divider orientation="left">{`${t('wt bank')} ${t('wt beneficiary')}`}</Divider>
                {/*Starts condition section*/}
                {this.state.transferMethod === 'Banco' && (
                  <React.Fragment>
                    <p>{t('wt beneficiaryBankMessage')}}</p>
                    <Form.Item label={t('wt bankName')}>
                      {getFieldDecorator('beneficiaryBankName')(
                        <Input
                          placeholder={t('wt bankName')}
                          name="beneficiaryBankName"
                          onChange={this._handleChange}
                        />
                      )}
                    </Form.Item>
                    <Form.Item label={`Swift`}>
                      {getFieldDecorator('beneficiaryBankSwift')(
                        <Input
                          placeholder={`Swift`}
                          name="beneficiaryBankSwift"
                          onChange={this._handleChange}
                        />
                      )}
                    </Form.Item>
                    <Form.Item label={`ABA`}>
                      {getFieldDecorator('beneficiaryBankABA')(
                        <Input
                          placeholder={`ABA`}
                          name="beneficiaryBankABA"
                          onChange={this._handleChange}
                        />
                      )}
                    </Form.Item>
                    <Form.Item label={t('address')}>
                      {getFieldDecorator('beneficiaryBankAddress')(
                        <div>
                          <TextArea
                            rows={4}
                            name="beneficiaryBankAddress"
                            onChange={this._handleChange}
                            placeholder={t('address')}
                          />
                        </div>
                      )}
                    </Form.Item>
                    <Divider orientation="left">{`${t('wt bank')} ${t(
                      'wt intermediary'
                    )}`}</Divider>
                    <p>{t('wt intermediaryBankMessage')}</p>
                    <Form.Item label={t('wt bankName')}>
                      {getFieldDecorator('intermediaryBankName')(
                        <Input
                          placeholder={t('wt bankName')}
                          name="intermediaryBankName"
                          onChange={this._handleChange}
                        />
                      )}
                    </Form.Item>
                    <Form.Item label={`Swift`}>
                      {getFieldDecorator('intermediaryBankSwift')(
                        <Input
                          placeholder={`Swift`}
                          name="intermediaryBankSwift"
                          onChange={this._handleChange}
                        />
                      )}
                    </Form.Item>
                    <Form.Item label={`ABA`}>
                      {getFieldDecorator('intermediaryBankABA')(
                        <Input
                          placeholder={`ABA`}
                          name="intermediaryBankABA"
                          onChange={this._handleChange}
                        />
                      )}
                    </Form.Item>
                    <Form.Item label={t('address')}>
                      {getFieldDecorator('intermediaryBankAddress')(
                        <div>
                          <TextArea
                            rows={4}
                            name="intermediaryBankAddress"
                            onChange={this._handleChange}
                            placeholder={t('address')}
                          />
                        </div>
                      )}
                    </Form.Item>
                    <Form.Item label={t('wt crossBankAccounts')}>
                      {getFieldDecorator('intermediaryBankAccountInterBank')(
                        <Input
                          placeholder={t('wt crossBankAccounts')}
                          name="intermediaryBankAccountInterBank"
                          onChange={this._handleChange}
                        />
                      )}
                    </Form.Item>
                  </React.Fragment>
                )}
                {/*Ends condition section*/}
              </React.Fragment>
            )}

            <Alert message={t('wt paymentTimePolitics')} banner style={{ margin: '20px 0' }} />

            <Alert
              message={t('wt paymentPolitics')}
              type="warning"
              style={{ margin: '10px 0 30px', textAlign: 'justify' }}
            />
            <Form.Item label={t('wt agreementPaymentPolitics')}>
              {getFieldDecorator('acceptsWithdrawalRequest', {
                valuePropName: 'checked',
                rules: [
                  {
                    required: true,
                    message: `${t('requiredFieldGeneralMessage')}`,
                  },
                ],
              })(
                <Switch
                  name="acceptsWithdrawalRequest"
                  onChange={(e) =>
                    this._handleChange({
                      target: {
                        type: 'checkbox',
                        checked: e,
                        name: 'acceptsWithdrawalRequest',
                      },
                    })
                  }
                  checkedChildren={t('yes')}
                  unCheckedChildren="No"
                />
              )}
            </Form.Item>

            <Form.Item>
              <Button
                style={{ width: '100%' }}
                type="primary"
                htmlType="submit"
                size="large"
                className="login-form-button"
                disabled={this.props.isWireTransferRequestLoading || this.state.disabledSubmitBtn}
                loading={this.props.isWireTransferRequestLoading}
              >
                {t('btn wireTransferRequest')}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Draggable>
    )
  }
}

export default Form.create({ name: 'register' })(withNamespaces()(WireTransferRequestForm))
