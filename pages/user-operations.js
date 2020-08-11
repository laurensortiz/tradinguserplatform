import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Row, Col, Button, Radio, Icon } from 'antd';
import _ from 'lodash';

import Document from '../components/Document';

import { userAccountOperations } from "../state/modules/userAccounts";
import UserAccount from '../components/UserOperations/UserAccount'

class UserOperations extends Component {
  state = {
    operationType: 'market',
    isFormVisible: false,
    currentUser: {
      id: null
    },
    operations: {},
    hasMarketOperations: false,
    hasInvestmentOperations: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {};

    if (!_.isEqual( nextProps.currentUser, prevState.currentUser )) {
      _.assignIn( updatedState, {
        currentUser: nextProps.currentUser
      } );

      nextProps.fetchGetUserAccounts(nextProps.currentUser.id)
    }

    if (!_.isEqual( nextProps.accounts, prevState.accounts )) {

      _.assignIn( updatedState, {
        accounts: nextProps.accounts
      } );
    }

    return !_.isEmpty( updatedState ) ? updatedState : null;
  }


  render() {

    return (
      <Document id="userOperations-page">
        <UserAccount currentUser={this.state.currentUser} accounts={this.state.accounts} isLoading={this.props.isLoading} />
      </Document>
    );
  }
}

function mapStateToProps(state) {

  return {
    currentUser: state.authState.currentUser,
    accounts: state.userAccountsState.list,
    isLoading: state.investmentOperationsState.isLoading,
    isSuccess: state.investmentOperationsState.isSuccess,
    isFailure: state.investmentOperationsState.isFailure,
    message: state.investmentOperationsState.message,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetUserAccounts: userAccountOperations.fetchGetUserAccounts
  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( UserOperations );
