import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Row, Col, Button, message, Icon, notification } from 'antd';
import _ from 'lodash';

import Document from '../components/Document';

import { userAccountOperations } from "../state/modules/userAccounts";
import { referralOperations } from "../state/modules/referrals";
import UserAccount from '../components/UserOperations/UserAccount'
import ExportHistoryReport from "../components/Operation/shared/ExportUserAccountHistory";

class UserOperations extends Component {
  state = {
    accounts: [],
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

    if (!nextProps.isReferralCompleted && nextProps.isReferralLoading) {
      message.loading('Creando Referral Ticket', [60])
    }

    if (nextProps.isReferralCompleted && nextProps.isReferralSuccess) {
      message.destroy()
      message.success('Referral Ticket Creado ', [3], () => {
        nextProps.resetReferralAfterRequest();

      })
    }

    if (nextProps.isReferralCompleted && !nextProps.isReferralSuccess) {
      message.destroy()
      message.error(nextProps.referralMessage, [6], () => {
        nextProps.resetReferralAfterRequest();

      })
    }


    if (nextProps.isHistoryReportSuccess && nextProps.isHistoryReportComplete) {
      if (_.isEmpty( nextProps.historyReportData )) {
        notification.info( {
          message: 'No se encontraron Operaciones para esta cuenta',
          onClose: () => {
            nextProps.resetAfterRequest();
          },
          duration: 3
        } )
      } else {
        ExportHistoryReport( nextProps.historyReportData )
        notification.success( {
          message: 'Descargando Reporte Historico de la cuenta',
          onClose: () => {
            nextProps.resetAfterRequest();
          },
          duration: 3
        } )
      }

    }

    if (!nextProps.isHistoryReportSuccess && nextProps.isHistoryReportComplete) {
      notification.error( {
        message: 'Ha ocurrido un error al generar el reporte',
        description: nextProps.message,
        onClose: () => {
          nextProps.resetAfterRequest();
        },
        duration: 3
      } )

    }

    if (!_.isEqual( nextProps.currentUser.id, prevState.currentUser.id )) {
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

  _requestRequestStandardOperationsReport = (userOperation) => {
    this.props.fetchGetUserAccountHistoryReport(userOperation)
  }

  _onRequestAddReferral = (referral) => {
    this.props.fetchAddReferral(referral)
  }

  render() {
    return (
      <Document id="userOperations-page">
        <UserAccount
          currentUser={this.state.currentUser}
          accounts={this.state.accounts}
          onRequestStandardOperationsReport={this._requestRequestStandardOperationsReport}
          onAddReferral={this._onRequestAddReferral}
          isReferralLoading={this.props.isReferralLoading}
          isReferralCompleted={this.props.isReferralCompleted}
          isReferralSuccess={this.props.isReferralSuccess}
          isLoading={false} />
      </Document>
    );
  }
}

function mapStateToProps(state) {

  return {
    currentUser: state.authState.currentUser,
    accounts: state.userAccountsState.list,
    isLoading: state.userAccountsState.isLoading,
    isSuccess: state.userAccountsState.isSuccess,
    isFailure: state.userAccountsState.isFailure,
    message: state.userAccountsState.message,

    isReferralLoading: state.referralsState.isLoading,
    isReferralSuccess: state.referralsState.isSuccess,
    referralMessage: state.referralsState.message,
    isReferralCompleted: state.referralsState.isCompleted,

    isHistoryReportLoading: state.userAccountsState.isHistoryReportLoading,
    isHistoryReportSuccess: state.userAccountsState.isHistoryReportSuccess,
    isHistoryReportComplete: state.userAccountsState.isHistoryReportComplete,
    historyReportData: state.userAccountsState.historyReportData,


  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetUserAccounts: userAccountOperations.fetchGetUserAccounts,
    fetchGetUserAccountHistoryReport: userAccountOperations.fetchGetUserAccountHistoryReport,

    fetchAddReferral: referralOperations.fetchAddReferral,
    fetchGetReferrals: referralOperations.fetchGetReferrals,
    fetchGetUserAccountReferrals: referralOperations.fetchGetUserAccountReferrals,
    resetReferralAfterRequest: referralOperations.resetAfterRequest,

    resetAfterRequest: userAccountOperations.resetAfterRequest,
  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( UserOperations );
