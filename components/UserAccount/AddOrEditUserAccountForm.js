import React, { PureComponent } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

moment.locale( 'es' ); // Set Lang to Spanish

import { Input, Checkbox, Button, Form, Tag, Select, DatePicker, Icon } from 'antd';

import { accountOperations } from '../../state/modules/accounts';
import { userOperations } from '../../state/modules/users';

const { Option } = Select;

class AddOrEditUserAccountForm extends PureComponent {
  state = {
    accountValue: 0,
    guaranteeOperation: 0,
    guaranteeCredits: 0,
    balanceInitial: 0,
    balanceFinal: 0,
    maintenanceMargin: 0,
    marginUsed: 0,
    user: {
      id: null,
      username: ''
    },
    account: {
      id: null,
      name: '',
      associatedOperation: 1,
    },
    commissionByReference: 0,
    confirmDirty: false,
    isInvalid: true,
    status: 1,
    accounts: [],
    users: [],
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let stateUpdated = {};

    if (!_.isEqual( nextProps.accounts, prevState.accounts )) {
      _.assign( stateUpdated, {
        accounts: nextProps.accounts
      } )
    }
    if (!_.isEqual( nextProps.users, prevState.users )) {
      _.assign( stateUpdated, {
        users: _.filter( nextProps.users, { roleId: 2, status: 1 } ),
      } )
    }

    return !_.isEmpty( stateUpdated ) ? stateUpdated : null;
  }


  componentDidMount() {
    if (_.isEmpty( this.state.accounts )) {
      this.props.fetchGetAccounts();
    }
    if (_.isEmpty( this.state.users )) {
      this.props.fetchGetUsers();
    }

    if (!_.isEmpty( this.props.selectedAccount )) {
      const { selectedAccount } = this.props;
      this.setState( {
        ...this.state,
        ...selectedAccount,
      } )
    }
  }

  _handleChangeSelect = (event) => {
    const { value } = event;
    const fieldName = event.name;
    const codeIdName = value.split( '_' );

    const id = Number( codeIdName[ 0 ] );
    const name = codeIdName[ 1 ];

    if (_.isEqual( fieldName, 'user' )) {
      const selectedUser = _.find( this.state.users, { id } );
      this.setState( {
        user: {
          id,
          username: name,
        },
      } )
    } else if (_.isEqual( fieldName, 'account' )) {
      this.setState( {
        account: {
          id,
          name,
          associatedOperation: Number(codeIdName[2] || 1)
        },
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

  _handleChange = e => {
    const value = _.isEmpty(e.target.value) ? '0.00' : e.target.value
    this.setState( {
      [ e.target.name ]: _.replace( value, ',', '' )
    } );
  };

  _handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields( (err, values) => {
      if (!err) {
        const saveState = _.omit(this.state, ['accounts', 'users']);

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

  _getAccountSelectOption = options => {
    return _.map( options, ({ id, name, associatedOperation }) => <Option
      key={ `${ id }_${ name }_${ associatedOperation }` }>{ name }</Option> )
  };

  _getUserSelectOption = options => {
    return _.map( options, ({ id, username }) => <Option key={ `${ id }_${ username }` }>{ username }</Option> )
  };


  _handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState( { confirmDirty: this.state.confirmDirty || !!value } );
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const isAddAction = _.isEqual( this.props.actionType, 'add' );
    const associatedOperation =  _.get(this.state, 'account.associatedOperation', 1);


    // Default values for edit action
    const accountInitValue = !_.isEmpty( this.state.account.name ) ? this.state.account.name : undefined;
    const userInitValue = !_.isEmpty( this.state.user.username ) ? this.state.user.username : undefined;
    const accountValueInitValue = !_.isEmpty( this.state.accountValue ) ? this.state.accountValue : undefined;
    const guaranteeOperationInitValue = !_.isEmpty( this.state.guaranteeOperation ) ? this.state.guaranteeOperation : undefined;
    const guaranteeCreditsInitValue = !_.isEmpty( this.state.guaranteeCredits ) ? this.state.guaranteeCredits : undefined;
    const balanceInitialInitValue = !_.isEmpty( this.state.balanceInitial ) ? this.state.balanceInitial : undefined;
    const balanceFinalInitValue = !_.isEmpty( this.state.balanceFinal ) ? this.state.balanceFinal : undefined;
    const maintenanceMarginInitValue = !_.isEmpty( this.state.maintenanceMargin ) ? this.state.maintenanceMargin : undefined;
    const marginUsedInitValue = !_.isEmpty( this.state.marginUsed ) ? this.state.marginUsed : undefined;
    const commissionByReference = !_.isEmpty( this.state.commissionByReference ) ? this.state.commissionByReference : undefined;


    return (
      <Form onSubmit={ this._handleSubmit } className="auth-form">
        <Form.Item label="Usuario">
          { getFieldDecorator( 'user', {
            initialValue: userInitValue,
            rules: [ { required: true, message: 'Por favor ingrese el Usuario' } ],
          } )(
            <Select
              showSearch={ true }
              name="user"
              onChange={ value => this._handleChangeSelect( { name: 'user', value } ) }
              placeholder="Usuario"
              disabled={ !isAddAction }
              showArrow={ isAddAction }
            >
              { this._getUserSelectOption( this.state.users ) }
            </Select>
          ) }
        </Form.Item>
        <Form.Item label="Cuenta">
          { getFieldDecorator( 'account', {
            initialValue: accountInitValue,
            rules: [ { required: true, message: 'Por favor indique el tipo de Cuenta' } ],
          } )(
            <Select
              showSearch={ true }
              name="user"
              onChange={ value => this._handleChangeSelect( { name: 'account', value } ) }
              placeholder="Cuenta"
              showArrow={ isAddAction }
            >
              { this._getAccountSelectOption( this.state.accounts ) }
            </Select>
          ) }
        </Form.Item>
        <Form.Item label="Valor de la Cuenta">
          { getFieldDecorator( 'accountValue', {
            initialValue: accountValueInitValue,
            rules: [ { required: false, message: 'Por favor indique el valor de la cuenta' } ],
          } )(
            <Input name="accountValue" onChange={ this._handleChange } placeholder="Valor de la Cuenta"/>
          ) }
        </Form.Item>
        {_.isEqual(associatedOperation, 1) ? (
          <Form.Item label="Garantías disponibles">
            { getFieldDecorator( 'guaranteeOperation', {
              initialValue: guaranteeOperationInitValue,
              rules: [ { required: false, message: 'Por favor indique las garatías disponibles' } ],
            } )(
              <Input name="guaranteeOperation" onChange={ this._handleChange }
                     placeholder="Garantías disponibles para operar"/>
            ) }
          </Form.Item>
        ) : null}

        <Form.Item label="Garantía/Créditos">
          { getFieldDecorator( 'guaranteeCredits', {
            initialValue: guaranteeCreditsInitValue,
            rules: [ { required: false, message: 'Por favor ingrese Garantía / Créditos' } ],
          } )(
            <Input name="guaranteeCredits" onChange={ this._handleChange } placeholder="Garantía/Créditos"/>
          ) }
        </Form.Item>

        {_.isEqual(associatedOperation, 1) ? (
          <Form.Item label="Margen Utilizado 10%">
            { getFieldDecorator( 'marginUsed', {
              initialValue: marginUsedInitValue,
              value: marginUsedInitValue,
              rules: [ { required: false, message: 'Por favor indique el margen utilizado' } ],
            } )(
              <Input name="marginUsed" onChange={ this._handleChange }
                     placeholder="Margen Utilizado"/>
            ) }
          </Form.Item>
        ) : null}

        {_.isEqual(associatedOperation, 1) ? (
          <Form.Item label="Comisiones por referencia">
            { getFieldDecorator( 'commissionByReference', {
              initialValue: commissionByReference,
              rules: [ { required: false, message: 'Por favor indique las garatías disponibles' } ],
            } )(
              <Input name="commissionByReference" onChange={ this._handleChange }
                     placeholder="Comisiones por referencia"/>
            ) }
          </Form.Item>
        ) : null}

        <Form.Item label="Saldo Inicial">
          { getFieldDecorator( 'balanceInitial', {
            initialValue: balanceInitialInitValue,
            rules: [ { required: false, message: 'Por favor ingrese el saldo inicial' } ],
          } )(
            <Input name="balanceInitial" onChange={ this._handleChange } placeholder="Saldo Inicial"/>
          ) }
        </Form.Item>
        <Form.Item label="Saldo Final">
          { getFieldDecorator( 'balanceFinal', {
            initialValue: balanceFinalInitValue,
            rules: [ { required: false, message: 'Por favor ingrese el saldo final' } ],
          } )(
            <Input name="balanceFinal" onChange={ this._handleChange } placeholder="Saldo Final"/>
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
  const { accountsState, usersState } = state;
  return {
    accounts: accountsState.list,
    users: usersState.list,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetAccounts: accountOperations.fetchGetAccounts,
    fetchGetUsers: userOperations.fetchGetUsers,
  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Form.create( { name: 'register' } )( AddOrEditUserAccountForm ) );