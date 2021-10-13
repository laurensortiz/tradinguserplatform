import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'

moment.locale('es') // Set Lang to Spanish

import { Input, Checkbox, Button, Form, Tag, Select, DatePicker, Icon } from 'antd'

import { userAccountOperations } from '../../../state/modules/userAccounts'

import { AmountFormatValidation, AmountOperationValidation } from '../../../common/utils'
import { productOperations } from '../../../state/modules/products'

const { Option, OptGroup } = Select

class AddOrEditForm extends PureComponent {
  state = {
    operationType: 'Funds FND',
    userAccount: {
      id: null,
      name: '',
    },
    amount: 0,
    initialAmount: 0,
    startDate: null,
    endDate: null,
    expirationDate: null,
    confirmDirty: false,
    isInvalid: true,
    status: 1,
    userAccounts: [],
    products: [],
    accountName: '',
    accountPercentage: 0,
    accountAvailable: 0,
    productId: 0,
    productName: '',
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let stateUpdated = {}
    if (!_.isEqual(nextProps.userAccounts, prevState.userAccounts)) {
      _.assign(stateUpdated, {
        userAccounts: nextProps.userAccounts,
      })
    }

    if (!_.isEqual(nextProps.products, prevState.products)) {
      _.assign(stateUpdated, {
        products: nextProps.products.filter(({ code }) => code.toUpperCase() === 'FND'),
      })
    }

    return !_.isEmpty(stateUpdated) ? stateUpdated : null
  }

  componentDidMount() {
    if (_.isEmpty(this.state.userAccounts)) {
      this.props.fetchGetAllUserAccounts({
        associatedOperation: 3,
      })
    }
    if (_.isEmpty(this.state.products)) {
      this.props.fetchGetProducts()
    }

    if (!_.isEmpty(this.props.selectedOperation)) {
      const { selectedOperation } = this.props
      const accountName = _.get(selectedOperation, 'userAccount.account.name', '')
      const operationType = _.get(selectedOperation, 'operationType', '')
      const productName = _.get(selectedOperation, 'product.name', '')
      const productId = _.get(selectedOperation, 'product.id', 0)
      this.setState({
        ...this.state,
        ...selectedOperation,
        accountName,
        operationType,
        productName,
        productId,
      })
    }
  }

  componentWillUnmount() {
    this.setState({
      userAccounts: [],
    })
  }

  _handleChangeSelect = (event) => {
    const { value } = event
    const fieldName = event.name
    const codeIdName = value.split('_')

    const id = Number(codeIdName[0])
    const name = codeIdName[1]

    if (_.isEqual(fieldName, 'userAccount')) {
      const selectedUserAccount = _.find(this.state.userAccounts, { id })

      this.setState({
        userAccount: {
          id,
          name,
        },
        amount: selectedUserAccount.accountValue,
        accountPercentage: _.get(selectedUserAccount, 'account.percentage', 0),
        accountAvailable: selectedUserAccount.accountValue,
      })
    } else {
      this.setState({
        productName: name,
        productId: id,
      })
    }
  }

  _setStartDate = (date) => {
    this.setState({
      startDate: moment.parseZone(date).format(),
    })
  }

  _setEndDate = (date) => {
    this.setState({
      endDate: moment.parseZone(date).format(),
    })
  }

  _setExpirationDate = (date) => {
    this.setState({
      expirationDate: moment.tz(date, 'America/New_York').format(),
    })
  }

  _handleChange = (e) => {
    const value = _.isEmpty(e.target.value) ? '0.00' : e.target.value
    this.setState({
      [e.target.name]: _.replace(value, ',', ''),
    })
  }

  _handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const saveState = _.omit(this.state, ['userAccounts'])

        if (_.isEqual(this.props.actionType, 'add')) {
          this.props.onAddNew(saveState)
        } else {
          this.props.onEdit(saveState)
        }
      }
    })
  }

  _getSelectOption = (options) => {
    return _.map(options, ({ id, name }) => <Option key={`${id}_${name}`}>{name}</Option>)
  }

  _getAccountUserSelectOption = (options) => {
    const accountsGrouped = _.chain(this.state.userAccounts)
      .filter(['account.associatedOperation', 3])
      .groupBy('user.username')
      .value()
    return _.map(accountsGrouped, (accounts, user) => {
      return (
        <OptGroup label={user}>
          {_.map(accounts, (account) => (
            <Option key={`${account.id}_${_.get(account, 'account.name', ' - ')}`}>
              {_.get(account, 'account.name', ' - ')}
            </Option>
          ))}
        </OptGroup>
      )
    })
  }

  _handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  _getProductSelectOption = (options) => {
    return _.map(this.state.products, (product) => {
      return <Option key={`${product.id}_${product.name}`}>{`${product.name}`}</Option>
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const isAddAction = _.isEqual(this.props.actionType, 'add')

    // Default values for edit action
    const statusInitValue = !_.isNil(this.state.status) ? this.state.status : undefined
    const userAccountInitValue = !_.isEmpty(this.state.accountName)
      ? this.state.accountName
      : undefined
    const operationTypeInitValue = !_.isEmpty(this.state.operationType)
      ? this.state.operationType
      : undefined
    const amountInitValue = !_.isEmpty(this.state.amount) ? this.state.amount : undefined
    const initialAmountInitValue = !_.isEmpty(this.state.initialAmount)
      ? this.state.initialAmount
      : undefined

    const startDateInitValue = !_.isNull(this.state.startDate)
      ? moment.parseZone(this.state.startDate)
      : undefined
    const endDateInitValue = !_.isNull(this.state.endDate)
      ? moment.parseZone(this.state.endDate)
      : undefined

    const expirationDateInitValue = !_.isNull(this.state.expirationDate)
      ? moment.parseZone(this.state.expirationDate)
      : undefined

    const productInitValue = !_.isEmpty(this.state.productName) ? this.state.productName : undefined

    console.log('[=====  products  =====>')
    console.log(this.state)
    console.log('<=====  /products  =====]')

    return (
      <Form onSubmit={this._handleSubmit} className="auth-form">
        {isAddAction && (
          <Form.Item label="Cuenta de Usuario">
            {getFieldDecorator('userAccount', {
              initialValue: userAccountInitValue,
              rules: [{ required: true, message: 'Por favor seleccione la cuenta de usuario ' }],
            })(
              <Select
                showSearch={true}
                name="user"
                onChange={(value) => this._handleChangeSelect({ name: 'userAccount', value })}
                placeholder="Cuenta de Usuario"
                disabled={!isAddAction}
                showArrow={isAddAction}
              >
                {this._getAccountUserSelectOption()}
              </Select>
            )}
          </Form.Item>
        )}
        <Form.Item label="Producto">
          {getFieldDecorator('product', {
            initialValue: productInitValue,
            rules: [{ required: true, message: 'Por favor seleccione el producto ' }],
          })(
            <Select
              showSearch={true}
              name="product"
              onChange={(value) => this._handleChangeSelect({ name: 'product', value })}
              placeholder="Producto"
              showArrow={isAddAction}
            >
              {this._getProductSelectOption(this.state.products)}
            </Select>
          )}
        </Form.Item>

        {/*<Form.Item label="Tipo de Operación">*/}
        {/*  {getFieldDecorator('operationType', {*/}
        {/*    initialValue: operationTypeInitValue,*/}
        {/*    rules: [{ required: true, message: 'Por favor indique el tipo de operación' }],*/}
        {/*  })(*/}
        {/*    <Input*/}
        {/*      name="operationType"*/}
        {/*      onChange={this._handleChange}*/}
        {/*      placeholder="Tipo de Operación"*/}
        {/*    />*/}
        {/*  )}*/}
        {/*</Form.Item>*/}
        {_.isEqual(this.props.actionType, 'add') ? (
          <Form.Item label="Monto">
            {getFieldDecorator('amount', {
              initialValue: amountInitValue,
              value: amountInitValue,
              rules: [
                { required: true, message: 'Por favor indique el monto' },
                {
                  validator: (rule, value) =>
                    AmountOperationValidation(this.state.accountAvailable, value),
                },
              ],
            })(<Input name="amount" onChange={this._handleChange} placeholder="Monto" />)}
          </Form.Item>
        ) : (
          <Form.Item label="Nuevo Monto">
            {getFieldDecorator('initialAmount', {
              initialValue: initialAmountInitValue,
              value: initialAmountInitValue,
              rules: [
                { required: true, message: 'Por favor indique el monto' },
                {
                  validator: AmountFormatValidation,
                },
              ],
            })(<Input name="initialAmount" onChange={this._handleChange} placeholder="Monto" />)}
          </Form.Item>
        )}

        <Form.Item label="Estado">
          {getFieldDecorator('status', {
            initialValue: statusInitValue,
            rules: [{ required: true, message: 'Por favor indique el estado' }],
          })(
            <Select
              name="status"
              onChange={(value) =>
                this.setState({
                  status: value,
                })
              }
              placeholder="Estado"
              showArrow={isAddAction}
            >
              <Option value={1}>Activo</Option>
              <Option value={2}>Market Close</Option>
              <Option value={3}>En Pausa</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('startDate', {
            initialValue: startDateInitValue,
          })(
            <DatePicker
              onChange={this._setStartDate}
              defaultPickerValue={moment.parseZone()}
              placeholder="Fecha de Inicio"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('expirationDate', {
            initialValue: expirationDateInitValue,
          })(
            <DatePicker
              onChange={this._setExpirationDate}
              defaultPickerValue={moment.parseZone()}
              placeholder="Fecha de Expiración"
            />
          )}
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            disabled={this.props.isLoading}
          >
            {_.isEqual(this.props.actionType, 'add') ? 'Agregar' : 'Actualizar'}
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

function mapStateToProps(state) {
  return {
    userAccounts: state.userAccountsState.list,
    products: state.productsState.list,
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchGetAllUserAccounts: userAccountOperations.fetchGetAllUserAccounts,
      fetchGetProducts: productOperations.fetchGetProducts,
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create({ name: 'register' })(AddOrEditForm))
