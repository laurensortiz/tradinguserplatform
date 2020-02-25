import React, { PureComponent } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

moment.locale( 'es' ); // Set Lang to Spanish

import { Input, Checkbox, Button, Form, Tag, Select, DatePicker, Icon } from 'antd';

import { accountOperations } from '../../../state/modules/accounts';
import { marketOperationOperations } from '../../../state/modules/marketOperation';
import { userAccountOperations } from "../../../state/modules/userAccounts";
import { brokerOperations } from "../../../state/modules/brokers";
import { productOperations } from "../../../state/modules/products";
import { commodityOperations } from "../../../state/modules/commodity";

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
    commoditiesTotal: 0,
    buyPrice: 0,
    initialAmount: 0,
    takingProfit: 0,
    stopLost: '',
    maintenanceMargin: 0,
    amount: 0,
    orderId: '',
    createdAt: null,

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
    accountPercentage: 0
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


    return !_.isEmpty( stateUpdated ) ? stateUpdated : null;
  }


  componentDidMount() {
    if (_.isEmpty( this.state.userAccounts )) {
      this.props.fetchGetUserAccounts();
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


    if (!_.isEmpty( this.props.selectedOperation )) {
      const { selectedOperation } = this.props;
      const accountName = _.get(selectedOperation, 'userAccount.account.name', '');
      const productName = _.get(selectedOperation, 'product.name', '');
      const productCode = _.get(selectedOperation, 'product.code', '');
      const brokerName = _.get(selectedOperation, 'broker.name', '');
      const commodityName = _.get(selectedOperation, 'commodity.name', '');
      this.setState( {
        ...this.state,
        ...selectedOperation,
        accountName,
        productName: `${productName}-${productCode}`,
        brokerName,
        commodityName,
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
        accountPercentage: _.get(selectedUserAccount, 'account.percentage', 0)
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
      createdAt: moment.utc( date ).format()
    } );
  };

  _setEndDate = (date) => {
    this.setState( {
      endDate: moment.utc( date ).format()
    } );

  };

  _handleChange = e => {
    this.setState( {
      [ e.target.name ]: _.replace( e.target.value, ',', '' )
    } );
  };

  _handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields( (err, values) => {
      if (!err) {

        if (_.isEqual( this.props.actionType, 'add' )) {
          this.props.onAddNew( this.state )
        } else {
          this.props.onEdit( this.state )
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

    const buyPriceInitValue = !_.isEmpty( this.state.buyPrice ) ? this.state.buyPrice : undefined;
    //const initialAmountInitValue = !_.isEmpty( this.state.initialAmount ) ? this.state.initialAmount : undefined;
    const takingProfitInitValue = !_.isEmpty( this.state.takingProfit ) ? this.state.takingProfit : undefined;
    const stopLostInitValue = !_.isEmpty( this.state.stopLost ) ? this.state.stopLost : undefined;
    const maintenanceMarginInitValue = !_.isEmpty( this.state.maintenanceMargin ) ? this.state.maintenanceMargin : undefined;
    const orderIdInitValue = _.isNumber( this.state.orderId ) ? this.state.orderId : undefined;
    const amountInitValue = !_.isEmpty( this.state.amount ) ? this.state.amount : undefined;
    const createdAtInitValue = !_.isEmpty( this.state.createdAt ) ? moment.utc( this.state.createdAt ) : undefined;

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
              disabled={ !isAddAction }
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
              disabled={ !isAddAction }
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
            rules: [ { required: true, message: 'Por favor indique Long / Short' } ],
          } )(
            <Input name="longShort" onChange={ this._handleChange }
                   placeholder="Long / Shorta"/>
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
        <Form.Item label="Tipo de Lotage">
          { getFieldDecorator( 'commodity', {
            initialValue: commoditiesTypeInitValue,
            rules: [ { required: true, message: 'Por favor seleccione el tipo de lotage ' } ],
          } )(
            <Select
              showSearch={ true }
              name="commodity"
              onChange={ value => this._handleChangeSelect( { name: 'commodity', value } ) }
              placeholder="Tipo de Lotage"
              disabled={ !isAddAction }
              showArrow={ isAddAction }
            >
              { this._getSelectOptions( this.state.commodities ) }
            </Select>
          ) }
        </Form.Item>
        <Form.Item label="Precio de Compra">
          { getFieldDecorator( 'buyPrice', {
            initialValue: buyPriceInitValue,
            value: buyPriceInitValue,
            rules: [ { required: true, message: 'Por favor indique el monto de la compra' } ],
          } )(
            <Input name="buyPrice" onChange={ this._handleChange }
                   placeholder="Precio de compra"/>
          ) }
        </Form.Item>
        <Form.Item label="Taking Profit">
          { getFieldDecorator( 'takingProfit', {
            initialValue: takingProfitInitValue,
            value: takingProfitInitValue,
            rules: [ { required: true, message: 'Por favor indique el taking profit' } ],
          } )(
            <Input name="takingProfit" onChange={ this._handleChange }
                   placeholder="Taking Profit"/>
          ) }
        </Form.Item>
        <Form.Item label="S/L">
          { getFieldDecorator( 'stopLost', {
            initialValue: stopLostInitValue,
            value: stopLostInitValue,
            rules: [ { required: true, message: 'Por favor indique el Stop Lost' } ],
          } )(
            <Input name="stopLost" onChange={ this._handleChange }
                   placeholder="S/L"/>
          ) }
        </Form.Item>
        <Form.Item label="Margen de Mantenimiento">
          { getFieldDecorator( 'maintenanceMargin', {
            initialValue: maintenanceMarginInitValue,
            value: maintenanceMarginInitValue,
            rules: [ { required: true, message: 'Por favor indique el Margen de mantenimiento' } ],
          } )(
            <Input name="maintenanceMargin" onChange={ this._handleChange }
                   placeholder="Margen de Mantenimiento"/>
          ) }
        </Form.Item>
        <Form.Item label="Número de Orden">
          { getFieldDecorator( 'orderId', {
            initialValue: orderIdInitValue,
            value: orderIdInitValue,
            rules: [ { required: true, message: 'Por favor indique el Número de orden' } ],
          } )(
            <Input name="orderId" onChange={ this._handleChange }
                   placeholder="Número de Orden"/>
          ) }
        </Form.Item>
        <Form.Item label="Monto">
          { getFieldDecorator( 'amount', {
            initialValue: amountInitValue,
            value: amountInitValue,
            rules: [ { required: true, message: 'Por favor indique el monto' } ],
          } )(
            <Input name="amount" onChange={ this._handleChange }
                   placeholder="Monto"/>
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
              <Option value={3}>En Pausa</Option>
            </Select>
          ) }
        </Form.Item>
        <Form.Item>
          { getFieldDecorator( 'createdAt', {
            initialValue: createdAtInitValue
          } )(
            <DatePicker onChange={ this._setStartDate } placeholder="Fecha de Inicio"/>
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
    commodities: state.commoditiesState.list
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetUserAccounts: userAccountOperations.fetchGetUserAccounts,
    fetchGetBrokers: brokerOperations.fetchGetBrokers,
    fetchGetProducts: productOperations.fetchGetProducts,
    fetchGetCommodities: commodityOperations.fetchGetCommodities,
  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Form.create( { name: 'register' } )( AddOrEditMarketForm ) );