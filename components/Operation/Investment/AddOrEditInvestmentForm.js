import React, { PureComponent } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

moment.locale( 'es' ); // Set Lang to Spanish

import { Input, Checkbox, Button, Form, Tag, Select, DatePicker, Icon } from 'antd';

import { accountOperations } from '../../../state/modules/accounts';
import { investmentOperationOperations } from '../../../state/modules/investmentOperation';
import { userAccountOperations } from "../../../state/modules/userAccounts";

import { AmountFormatValidation, AmountOperationValidation } from '../../../common/utils';

const { Option, OptGroup } = Select;

class AddOrEditInvestmentForm extends PureComponent {
  state = {
    operationType: '',
    userAccount: {
      id: null,
      name: ''
    },
    amount: 0,
    initialAmount: 0,
    startDate: null,
    endDate: null,

    confirmDirty: false,
    isInvalid: true,
    status: 1,
    userAccounts: [],
    accountName: '',
    accountPercentage: 0,
    accountAvailable: 0,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let stateUpdated = {};

    if (!_.isEqual( nextProps.userAccounts, prevState.userAccounts )) {
      _.assign( stateUpdated, {
        userAccounts: nextProps.userAccounts
      } )
    }


    return !_.isEmpty( stateUpdated ) ? stateUpdated : null;
  }


  componentDidMount() {
    if (_.isEmpty( this.state.userAccounts )) {
      this.props.fetchGetAllUserAccounts();
    }


    if (!_.isEmpty( this.props.selectedOperation )) {
      const { selectedOperation } = this.props;
      const accountName = _.get( selectedOperation, 'userAccount.account.name', '' );
      this.setState( {
        ...this.state,
        ...selectedOperation,
        accountName
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
        accountPercentage: _.get( selectedUserAccount, 'account.percentage', 0 ),
        accountAvailable: selectedUserAccount.accountValue
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
      startDate: moment.parseZone( date ).format()
    } );
  };

  _setEndDate = (date) => {
    this.setState( {
      endDate: moment.parseZone( date ).format()
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
        const saveState = _.omit( this.state, [ 'userAccounts' ] );

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
    const accountsGrouped = _.chain( this.state.userAccounts ).filter( [ 'account.associatedOperation', 2 ] ).groupBy( 'user.username' ).value();
    return _.map( accountsGrouped, (accounts, user) => {
      return (
        <OptGroup label={ user }>
          { _.map( accounts, account => <Option
            key={ `${ account.id }_${ _.get( account, 'account.name', ' - ' ) }` }>{ _.get( account, 'account.name', ' - ' ) }</Option> ) }
        </OptGroup>
      )
    } )
  };


  _handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState( { confirmDirty: this.state.confirmDirty || !!value } );
  };

  render() {

    const { getFieldDecorator } = this.props.form;
    const isAddAction = _.isEqual( this.props.actionType, 'add' );

    // Default values for edit action
    const statusInitValue = !_.isNil( this.state.status ) ? this.state.status : undefined;
    const userAccountInitValue = !_.isEmpty( this.state.accountName ) ? this.state.accountName : undefined;
    const operationTypeInitValue = !_.isEmpty( this.state.operationType ) ? this.state.operationType : undefined;
    const amountInitValue = !_.isEmpty( this.state.amount ) ? this.state.amount : undefined;
    const initialAmountInitValue = !_.isEmpty( this.state.initialAmount ) ? this.state.initialAmount : undefined;

    const startDateInitValue = !_.isEmpty( this.state.startDate ) ? moment.parseZone( this.state.startDate ) : undefined;
    const endDateInitValue = !_.isEmpty( this.state.endDate ) ? moment.parseZone( this.state.endDate ) : undefined;

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
        <Form.Item label="Tipo de Operación">
          { getFieldDecorator( 'operationType', {
            initialValue: operationTypeInitValue,
            rules: [ { required: true, message: 'Por favor indique el tipo de operación' } ],
          } )(
            <Input name="operationType" onChange={ this._handleChange } placeholder="Tipo de Operación"/>
          ) }
        </Form.Item>
        { _.isEqual( this.props.actionType, 'add' ) ? (
          <Form.Item label="Monto">
            { getFieldDecorator( 'amount', {
              initialValue: amountInitValue,
              value: amountInitValue,
              rules: [ { required: true, message: 'Por favor indique el monto' },
                {
                  validator: (rule, value) => AmountOperationValidation(this.state.accountAvailable, value)
                } ],
            } )(
              <Input name="amount" onChange={ this._handleChange }
                     placeholder="Monto"/>
            ) }
          </Form.Item>
        ) : (
          <Form.Item label="Nuevo Monto">
            { getFieldDecorator( 'initialAmount', {
              initialValue: initialAmountInitValue,
              value: initialAmountInitValue,
              rules: [ { required: true, message: 'Por favor indique el monto' },
                {
                  validator: AmountFormatValidation
                }],
            } )(
              <Input name="initialAmount" onChange={ this._handleChange }
                     placeholder="Monto"/>
            ) }
          </Form.Item>
        ) }

        <Form.Item label="Estado">
          { getFieldDecorator( 'status', {
            initialValue: statusInitValue,
            rules: [ { required: true, message: 'Por favor indique el estado' } ],
          } )(
            <Select
              name="status"
              onChange={ value => this.setState( {
                status: value
              } ) }
              placeholder="Estado"
              showArrow={ isAddAction }
            >
              <Option value={ 1 }>Activo</Option>
              <Option value={ 2 }>Cerrado</Option>
              <Option value={ 3 }>En Pausa</Option>
            </Select>
          ) }
        </Form.Item>
        <Form.Item>
          { getFieldDecorator( 'startDate', {
            initialValue: startDateInitValue
          } )(
            <DatePicker onChange={ this._setStartDate } placeholder="Fecha de Inicio"/>
          ) }
        </Form.Item>
        <Form.Item>
          { getFieldDecorator( 'endDate', {
            initialValue: endDateInitValue
          } )(
            <DatePicker onChange={ this._setEndDate } placeholder="Fecha de Salida"/>
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
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetAllUserAccounts: userAccountOperations.fetchGetAllUserAccounts,
  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Form.create( { name: 'register' } )( AddOrEditInvestmentForm ) );