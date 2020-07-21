import React, { PureComponent } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import _ from 'lodash';

moment.locale( 'es' ); // Set Lang to Spanish

import { Input, Checkbox, Button, Form, Tag, Select, DatePicker, Icon } from 'antd';

import { accountOperations } from '../../../state/modules/accounts';
import { marketOperationOperations } from '../../../state/modules/marketOperation';
import { userAccountOperations } from "../../../state/modules/userAccounts";
import { brokerOperations } from "../../../state/modules/brokers";
import { productOperations } from "../../../state/modules/products";
import { commodityOperations } from "../../../state/modules/commodity";
import { assetClassOperations } from "../../../state/modules/assetClasses";

import { AmountFormatValidation, AmountOperationValidation } from '../../../common/utils';

const { Option, OptGroup } = Select;

class AddOrEditMarketForm extends PureComponent {
  state = {
    longShort: '',
    userAccount: {
      id: null,
      name: ''
    },
    broker: {
      id: null,
      name: ''
    },
    product: {
      id: null,
      name: ''
    },
    commodity: {
      id: null,
      name: ''
    },
    assetClass: {
      id: null,
      name: ''
    },
    commoditiesTotal: 0,
    buyPrice: 0,
    initialAmount: 0,
    takingProfit: 0,
    stopLost: '',
    maintenanceMargin: 0,
    amount: 0,
    orderId: null,
    createdAt: null,
    marginUsed: 0,

    confirmDirty: false,
    isInvalid: true,
    status: 1,
    userAccounts: [],
    brokers: [],
    products: [],
    commodities: [],
    accountName: '',
    brokerName: '',
    productName: '',
    commodityName: '',
    assetClassName: '',
    accountPercentage: 0,
    accountGuarantee: 0,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let stateUpdated = {};

    if (!_.isEqual( nextProps.userAccounts, prevState.userAccounts )) {
      _.assign( stateUpdated, {
        userAccounts: nextProps.userAccounts
      } )
    }

    if (!_.isEqual( nextProps.brokers, prevState.brokers )) {
      _.assign( stateUpdated, {
        brokers: nextProps.brokers
      } )
    }

    if (!_.isEqual( nextProps.products, prevState.products )) {
      _.assign( stateUpdated, {
        products: nextProps.products
      } )
    }

    if (!_.isEqual( nextProps.commodities, prevState.commodities )) {
      _.assign( stateUpdated, {
        commodities: nextProps.commodities
      } )
    }

    if (!_.isEqual( nextProps.assetClasses, prevState.assetClasses )) {
      _.assign( stateUpdated, {
        assetClasses: nextProps.assetClasses
      } )
    }


    return !_.isEmpty( stateUpdated ) ? stateUpdated : null;
  }


  componentDidMount() {
    if (_.isEmpty( this.state.userAccounts )) {
      this.props.fetchGetAllUserAccounts();
    }

    if (_.isEmpty( this.state.brokers )) {
      this.props.fetchGetBrokers();
    }

    if (_.isEmpty( this.state.products )) {
      this.props.fetchGetProducts();
    }

    if (_.isEmpty( this.state.commodities )) {
      this.props.fetchGetCommodities();
    }

    if (_.isEmpty( this.state.assetClasses )) {
      this.props.fetchGetAssetClasses();
    }

    if (!_.isEmpty( this.props.selectedOperation )) {
      const { selectedOperation } = this.props;
      const accountName = _.get(selectedOperation, 'userAccount.account.name', '');
      const accountGuarantee = _.get(selectedOperation, 'userAccount.guaranteeOperation', 0);
      const productName = _.get(selectedOperation, 'product.name', '');
      const productCode = _.get(selectedOperation, 'product.code', '');
      const brokerName = _.get(selectedOperation, 'broker.name', '');
      const commodityName = _.get(selectedOperation, 'commodity.name', '');
      const assetClassName = _.get(selectedOperation, 'assetClass.name', '');
      this.setState( {
        ...this.state,
        ...selectedOperation,
        accountName,
        accountGuarantee,
        productName: `${productName}-${productCode}`,
        brokerName,
        commodityName,
        assetClassName,
      } )
    }
  }

  _handleChangeSelect = (event) => {
    const { value } = event;
    const fieldName = event.name;
    const codeIdName = value.split( '_' );

    const id = Number( codeIdName[ 0 ] );
    const name = codeIdName[ 1 ];

    if (_.isEqual( fieldName, 'userAccount' )) {
      const selectedUserAccount = _.find( this.state.userAccounts, { id } );

      this.setState( {
        userAccount: {
          id,
          name,
        },
        amount: selectedUserAccount.accountValue,
        accountPercentage: _.get(selectedUserAccount, 'account.percentage', 0),
        accountGuarantee: _.get(selectedUserAccount, 'guaranteeOperation', 0)
      } )
    } else {
      this.setState( {
        [ fieldName ]: {
          id,
          name,
        }
      } )
    }
  };

  _setStartDate = (date) => {

    this.setState( {
      createdAt:  moment.tz(date, 'America/New_York').format()
    } );
  };

  _setEndDate = (date) => {
    this.setState( {
      endDate:  moment.tz(date, 'America/New_York').format()
    } );

  };

  _handleChange = e => {
    const value = _.isEmpty(e.target.value) ? '0.00' : e.target.value;

    this.setState( {
      [ e.target.name ]: _.replace( value, ',', '' )
    } );
  };

  _handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields( (err, values) => {
      if (!err) {
        const saveState = _.omit(this.state, ['userAccounts', 'brokers', 'products', 'commodities', 'assetClasses']);

        if (_.isEqual( this.props.actionType, 'add' )) {
          this.props.onAddNew( saveState )
        } else {
          this.props.onEdit( saveState )
        }
      }
    } );

  };

  _getSelectOption = options => {
    return _.map( options, ({ id, name }) => <Option key={ `${ id }_${ name }` }>{ name }</Option> )
  };

  _getAccountUserSelectOption = options => {
    const accountsGrouped = _.chain(this.state.userAccounts).filter(['account.associatedOperation', 1]).groupBy('user.username').value();
    return _.map(accountsGrouped, (accounts, user) => {
      return (
        <OptGroup label={user}>
          {_.map(accounts, account => <Option key={`${ account.id }_${ _.get(account, 'account.name', ' - ') }`}>{_.get(account, 'account.name', ' - ')}</Option>)}
        </OptGroup>
      )
    })
  };

  _getSelectOptions = options => {
    return _.map(options, (option) => {
      return (
        <Option key={`${ option.id }_${option.name}`}>{option.name}</Option>
      )
    })
  };

  _getProductSelectOption = options => {
    return _.map(this.state.products, (product) => {
      return (
        <Option key={`${ product.id }_${product.code}-${product.name}`}>{`${product.code}-${product.name}`}</Option>
      )
    })
  };


  _handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState( { confirmDirty: this.state.confirmDirty || !!value } );
  };
  
  handleInversion = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    const regex = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;

    return new Promise((resolve, reject) => {
      
      if (_.isEqual( this.props.actionType, 'edit') && _.isEqual(parseFloat(this.state.amount ), parseFloat(value))) {
        resolve();
      }

      if (!_.isEmpty(value) && !regex.test(value)) {
        reject( "Formato inválido del monto" );  // reject with error message
      }

      if (parseFloat(value) == 0) {
        reject("La opereración debe ser mayor a 0");
      }

      if ((parseFloat(this.state.accountGuarantee ) - parseFloat(value)) < 0) {
        reject("El usuario no cuenta con Garantías disponibles");  // reject with error message
      } else {
        resolve();
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const isAddAction = _.isEqual( this.props.actionType, 'add' );

    // Default values for edit action

    const longShortInitValue = !_.isNil( this.state.longShort) ? this.state.longShort : undefined;

    const statusInitValue = !_.isNil( this.state.status) ? this.state.status : undefined;
    const userAccountInitValue = !_.isEmpty( this.state.accountName ) ? this.state.accountName : undefined;
    const brokerInitValue = !_.isEmpty( this.state.brokerName ) ? this.state.brokerName : undefined;
    const productInitValue = !_.isEmpty( this.state.productName ) ? this.state.productName : undefined;

    const commoditiesTotalInitValue = !_.isEmpty( this.state.commoditiesTotal ) ? this.state.commoditiesTotal : undefined;
    const commoditiesTypeInitValue = !_.isEmpty( this.state.commodityName ) ? this.state.commodityName : undefined;
    const assetClassInitValue = !_.isEmpty( this.state.assetClassName ) ? this.state.assetClassName : undefined;

    const buyPriceInitValue = !_.isEmpty( this.state.buyPrice ) ? this.state.buyPrice : undefined;
    //const initialAmountInitValue = !_.isEmpty( this.state.initialAmount ) ? this.state.initialAmount : undefined;
    const takingProfitInitValue = !_.isEmpty( this.state.takingProfit ) ? this.state.takingProfit : undefined;
    const stopLostInitValue = !_.isEmpty( this.state.stopLost ) ? this.state.stopLost : undefined;
    const maintenanceMarginInitValue = !_.isEmpty( this.state.maintenanceMargin ) ? this.state.maintenanceMargin : undefined;
    const orderIdInitValue = _.isNumber( this.state.orderId ) ? this.state.orderId : undefined;
    const amountInitValue = !_.isEmpty( this.state.amount ) ? this.state.amount : undefined;
    const createdAtInitValue = !_.isNull( this.state.createdAt ) ? moment.tz(this.state.createdAt, 'America/New_York') : undefined;

    return (
      <Form onSubmit={ this._handleSubmit } className="auth-form">
        <Form.Item label="Cuenta de Usuario">
          { getFieldDecorator( 'userAccount', {
            initialValue: userAccountInitValue,
            rules: [ { required: true, message: 'Por favor seleccione la cuenta de usuario ' } ],
          } )(
            <Select
              showSearch={ true }
              name="user"
              onChange={ value => this._handleChangeSelect( { name: 'userAccount', value } ) }
              placeholder="Cuenta de Usuario"
              disabled={ !isAddAction }
              showArrow={ isAddAction }
            >
              { this._getAccountUserSelectOption( this.state.userAccounts ) }
            </Select>
          ) }
        </Form.Item>
        <Form.Item label="Corredor">
          { getFieldDecorator( 'broker', {
            initialValue: brokerInitValue,
            rules: [ { required: true, message: 'Por favor seleccione el corredor ' } ],
          } )(
            <Select
              showSearch={ true }
              name="broker"
              onChange={ value => this._handleChangeSelect( { name: 'broker', value } ) }
              placeholder="Corredor"
              showArrow={ isAddAction }
            >
              { this._getSelectOptions( this.state.brokers ) }
            </Select>
          ) }
        </Form.Item>
        <Form.Item label="Producto">
          { getFieldDecorator( 'product', {
            initialValue: productInitValue,
            rules: [ { required: true, message: 'Por favor seleccione el producto ' } ],
          } )(
            <Select
              showSearch={ true }
              name="product"
              onChange={ value => this._handleChangeSelect( { name: 'product', value } ) }
              placeholder="Producto"
              showArrow={ isAddAction }
            >
              { this._getProductSelectOption( this.state.products ) }
            </Select>
          ) }
        </Form.Item>
        <Form.Item label="Long / Short">
          { getFieldDecorator( 'longShort', {
            initialValue: longShortInitValue,
            value: longShortInitValue,
            rules: [ { required: false, message: 'Por favor indique Long / Short' } ],
          } )(
            <Input name="longShort" onChange={ this._handleChange }
                   placeholder="Long / Short"/>
          ) }
        </Form.Item>

        <Form.Item label="Cantidad Lotaje">
          { getFieldDecorator( 'commoditiesTotal', {
            initialValue: commoditiesTotalInitValue,
            rules: [ { required: true, message: 'Por favor indique la cantidad lotaje' } ],
          } )(
            <Input type="number" name="commoditiesTotal" onChange={ this._handleChange } placeholder="Cantidad Lotaje"/>
          ) }
        </Form.Item>
        <Form.Item label="Mercados a Operar">
          { getFieldDecorator( 'commodity', {
            initialValue: commoditiesTypeInitValue,
            rules: [ { required: true, message: 'Por favor seleccione el mercado a operar ' } ],
          } )(
            <Select
              showSearch={ true }
              name="commodity"
              onChange={ value => this._handleChangeSelect( { name: 'commodity', value } ) }
              placeholder="Mercados a Operar"

            >
              { this._getSelectOptions( this.state.commodities ) }
            </Select>
          ) }
        </Form.Item>
        <Form.Item label="Derivados de Inversión">
          { getFieldDecorator( 'assetClass', {
            initialValue: assetClassInitValue,
            rules: [ { required: true, message: 'Por favor seleccione el derivado de inversión ' } ],
          } )(
            <Select
              showSearch={ true }
              name="assetClass"
              onChange={ value => this._handleChangeSelect( { name: 'assetClass', value } ) }
              placeholder="Derivados de Inversión"

            >
              { this._getSelectOptions( this.state.assetClasses ) }
            </Select>
          ) }
        </Form.Item>
        <Form.Item label="Precio de Compra">
          { getFieldDecorator( 'buyPrice', {
            initialValue: buyPriceInitValue,
            value: buyPriceInitValue,
            rules: [ { required: false, message: 'Por favor indique el monto de la compra' },
              {
                validator: (rule, amount) => AmountFormatValidation(rule, amount)
              }
            ],
          } )(
            <Input name="buyPrice" onChange={ this._handleChange }
                   placeholder="Precio de compra"/>
          ) }
        </Form.Item>
        <Form.Item label="Taking Profit">
          { getFieldDecorator( 'takingProfit', {
            initialValue: takingProfitInitValue,
            value: takingProfitInitValue,
            rules: [ { required: false, message: 'Por favor indique el taking profit' } ],
          } )(
            <Input name="takingProfit" onChange={ this._handleChange }
                   placeholder="Taking Profit"/>
          ) }
        </Form.Item>
        <Form.Item label="S/L">
          { getFieldDecorator( 'stopLost', {
            initialValue: stopLostInitValue,
            value: stopLostInitValue,
            rules: [ { required: false, message: 'Por favor indique el Stop Lost' } ],
          } )(
            <Input name="stopLost" onChange={ this._handleChange }
                   placeholder="S/L"/>
          ) }
        </Form.Item>
        <Form.Item label="Inversión">
          { getFieldDecorator( 'amount', {
            initialValue: amountInitValue,
            value: amountInitValue,
            rules: [ { required: true, message: 'Por favor indique el monto' },
              {
                validator: this.handleInversion
              }],
          } )(
            <Input name="amount" onChange={ this._handleChange }
                   placeholder="Monto"/>
          ) }
        </Form.Item>
        <Form.Item label="Margen de Mantenimiento">
          { getFieldDecorator( 'maintenanceMargin', {
            initialValue: maintenanceMarginInitValue,
            value: maintenanceMarginInitValue,
            rules: [ { required: false, message: 'Por favor indique el Margen de mantenimiento' },
              {
                validator: (rule, amount) => AmountFormatValidation(rule, amount)
              }
            ],
          } )(
            <Input name="maintenanceMargin" onChange={ this._handleChange }
                   placeholder="Margen de Mantenimiento"/>
          ) }
        </Form.Item>
        <Form.Item label="Número de Orden">
          { getFieldDecorator( 'orderId', {
            initialValue: orderIdInitValue,
            value: orderIdInitValue,
            rules: [ { required: false, message: 'Por favor indique el Número de orden' } ],
          } )(
            <Input name="orderId" onChange={ this._handleChange }
                   placeholder="Número de Orden"/>
          ) }
        </Form.Item>
        <Form.Item label="Estado">
          { getFieldDecorator( 'status', {
            initialValue: statusInitValue,
            rules: [ { required: true, message: 'Por favor indique el estado' } ],
          } )(
            <Select
              name="status"
              onChange={ value => this.setState({
                status: value
              }) }
              placeholder="Estado"
              showArrow={ isAddAction }
            >
              <Option value={1}>Activo</Option>
              <Option value={2}>Cerrado</Option>
              <Option value={3}>On Hold</Option>
              <Option value={4}>Vendido</Option>
            </Select>
          ) }
        </Form.Item>
        <Form.Item>
          { getFieldDecorator( 'createdAt', {
            initialValue: createdAtInitValue
          } )(
            <DatePicker onChange={ this._setStartDate } defaultPickerValue={moment().tz('America/New_York')} placeholder="Fecha de Inicio"/>
          ) }
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button" disabled={ this.props.isLoading }>
            { _.isEqual( this.props.actionType, 'add' ) ? 'Agregar' : 'Editar' }
          </Button>
        </Form.Item>
      </Form>

    );
  }
}

function mapStateToProps(state) {
  
  return {
    userAccounts: state.userAccountsState.list,
    brokers: state.brokersState.list,
    products: state.productsState.list,
    commodities: state.commoditiesState.list,
    assetClasses: state.assetClassesState.list,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetAllUserAccounts: userAccountOperations.fetchGetAllUserAccounts,
    fetchGetBrokers: brokerOperations.fetchGetBrokers,
    fetchGetProducts: productOperations.fetchGetProducts,
    fetchGetCommodities: commodityOperations.fetchGetCommodities,
    fetchGetAssetClasses: assetClassOperations.fetchGetAssetClasses,
  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Form.create( { name: 'register' } )( AddOrEditMarketForm ) );