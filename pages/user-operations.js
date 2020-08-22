import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Row, Col, Button, Radio, Icon, notification } from 'antd';
import _ from 'lodash';

import Document from '../components/Document';

import { userAccountOperations } from "../state/modules/userAccounts";
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

  render() {

    return (
      <Document id="userOperations-page">
        <UserAccount
          currentUser={this.state.currentUser}
          accounts={this.state.accounts}
          onRequestStandardOperationsReport={this._requestRequestStandardOperationsReport}
          isLoading={false} />
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
    resetAfterRequest: userAccountOperations.resetAfterRequest,
  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( UserOperations );
