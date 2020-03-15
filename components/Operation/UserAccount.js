import React, { Component } from 'react';
import moment from 'moment';
import { Row, Col, Button, Descriptions, Tag, Statistic, Card, Icon } from 'antd';
import _ from 'lodash';

import { FormatCurrency, FormatStatus, FormatDate, IsOperationPositive } from '../../common/utils';
import { bindActionCreators } from "redux";

import { userAccountOperations } from "../../state/modules/userAccounts";
import { connect } from "react-redux";

import UserAccountInformation from './UserAccountInformation';

class UserAccount extends Component {
  
  state = {
    accounts: [],
    currentUserId: null
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {};
    
    if (!_.isEqual( nextProps.currentUserId, prevState.currentUserId )) {
      _.assignIn( updatedState, {
        currentUserId: nextProps.currentUserId
      } );

      nextProps.fetchGetUserAccounts(nextProps.currentUserId)
    }
    if (!_.isEqual( nextProps.accounts, prevState.accounts )) {

      _.assignIn( updatedState, {
        accounts: nextProps.accounts
      } );
    }

    return !_.isEmpty( updatedState ) ? updatedState : null;
  }

  render() {

    if (_.isEmpty(this.state.accounts)) {
      return `No hay registros`
    } else {
      return _.map(this.state.accounts, account => <UserAccountInformation userAccount={account} />)
    }
  }
}

function mapStateToProps(state) {

  return {
    accounts: state.userAccountsState.list,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetUserAccounts: userAccountOperations.fetchGetUserAccounts
  }, dispatch );

export default connect( mapStateToProps, mapDispatchToProps )( UserAccount );
