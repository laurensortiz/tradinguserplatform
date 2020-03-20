import React, { Component } from 'react';
import moment from 'moment';
import {  Icon, Typography , Skeleton, Empty, Tag, Row, Col} from 'antd';
import _ from 'lodash';

import { FormatCurrency, FormatStatus, FormatDate, IsOperationPositive } from '../../common/utils';
import { bindActionCreators } from "redux";

import { userAccountOperations } from "../../state/modules/userAccounts";
import { connect } from "react-redux";

import UserAccountInformation from './UserAccountInformation';

const { Title } = Typography;

class UserAccount extends Component {
  
  state = {
    accounts: [],
    currentUser: {
      firstName: '',
      lastName: '',
      userID: '',
      username: ''
    },
    isLoading: false,
    isSuccess: false,
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

    if (!_.isEqual( nextProps.isLoading, prevState.isLoading )) {

      _.assignIn( updatedState, {
        isLoading: nextProps.isLoading
      } );
    }
    if (!_.isEqual( nextProps.isSuccess, prevState.isSuccess )) {

      _.assignIn( updatedState, {
        isSuccess: nextProps.isSuccess
      } );
    }

    return !_.isEmpty( updatedState ) ? updatedState : null;
  }

  _displayData = () => {
    if (this.state.isSuccess) {
      if (_.isEmpty(this.state.accounts)) {
        return <Empty description="No se encontraron cuentas asociadas a su nombre." />
      } else {
        return _.map(this.state.accounts, account => <UserAccountInformation userAccount={account} />)
      }
    }
  }

  render() {
    const {firstName, lastName, userID, username} = this.state.currentUser;
    return (
      <>
        <Row style={{marginBottom: 30}}>
          <Col sm={24} md={12}>
            <Title level={4}><Icon type="user"  /> {userID}</Title>
          </Col>
          <Col sm={24} md={12}>
            <Title level={3}>{ firstName } {lastName} <Tag style={{fontSize: 14} }>{username}</Tag></Title>
          </Col>
        </Row>
        <Row>
          <Col>
            <Skeleton active loading={this.state.isLoading}>
              {this._displayData()}
            </Skeleton>
          </Col>
        </Row>

      </>

    )
  }
}

function mapStateToProps(state) {

  return {
    accounts: state.userAccountsState.list,
    isLoading: state.userAccountsState.isLoading,
    isSuccess: state.userAccountsState.isSuccess,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetUserAccounts: userAccountOperations.fetchGetUserAccounts
  }, dispatch );

export default connect( mapStateToProps, mapDispatchToProps )( UserAccount );
