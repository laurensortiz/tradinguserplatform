import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'

import { message, notification } from 'antd'
import _ from 'lodash'

import Document from '../components/Document'

import { userAccountOperations } from '../state/modules/userAccounts'
import { referralOperations } from '../state/modules/referrals'
import { wireTransferRequestOperations } from '../state/modules/wireTransferRequests'

import UserAccount from '../components/UserOperations/UserAccount'
import ExportHistoryReport from '../components/UserOperations/Operation/shared/ExportUserAccountHistory'

class UserOperations extends Component {
  state = {
    accounts: [],
    operationType: 'market',
    isFormVisible: false,
    currentUser: {
      id: null,
    },
    operations: {},
    hasMarketOperations: false,
    hasInvestmentOperations: false,

  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {}

    if (!nextProps.isReferralCompleted && nextProps.isReferralLoading) {
      message.loading(nextProps.t('actionMessage creatingTicket'), [60])
    }

    if (nextProps.isReferralCompleted && nextProps.isReferralSuccess) {
      message.destroy()
      message.success(nextProps.t('actionMessage ticketCreated'), [3], () => {
        nextProps.resetReferralAfterRequest()
      })
    }

    if (nextProps.isReferralCompleted && !nextProps.isReferralSuccess) {
      message.destroy()
      message.error(nextProps.referralMessage, [6], () => {
        nextProps.resetReferralAfterRequest()
      })
    }

    // WireTransfer

    if (nextProps.isWireTransferRequestAddCompleted && nextProps.isWireTransferRequestSuccess) {
      message.destroy()
      message.success(nextProps.t('actionMessage wireTransferCreated'), 3, () => {
        nextProps.resetWireTransferRequestAfterRequest()
      })
    }

    // if (nextProps.isWireTransferRequestAddCompleted && !nextProps.isWireTransferRequestSuccess) {
    //   message.destroy()
    //   message.error(nextProps.referralMessage, 6, () => {
    //     nextProps.resetWireTransferRequestAfterRequest()
    //   })
    // }
    // -- end
    if (nextProps.isHistoryReportSuccess && nextProps.isHistoryReportComplete) {
      if (_.isEmpty(nextProps.historyReportData)) {
        notification.info({
          message: nextProps.t('actionMessage noOperationFound'),
          onClose: () => {
            nextProps.resetAfterRequest()
          },
          duration: 3,
        })
      } else {
        ExportHistoryReport(nextProps.historyReportData, nextProps.t)
        notification.success({
          message: nextProps.t('actionMessage downloadingHistoryReport'),
          onClose: () => {
            nextProps.resetAfterRequest()
          },
          duration: 3,
        })
      }
    }

    if (!nextProps.isHistoryReportSuccess && nextProps.isHistoryReportComplete) {
      notification.error({
        message: 'Ha ocurrido un error al generar el reporte',
        description: nextProps.message,
        onClose: () => {
          nextProps.resetAfterRequest()
        },
        duration: 3,
      })
    }

    if (!_.isEqual(nextProps.currentUser.id, prevState.currentUser.id)) {
      _.assignIn(updatedState, {
        currentUser: nextProps.currentUser,
      })

      nextProps.fetchGetUserAccounts(nextProps.currentUser.id)
    }

    if (!_.isEqual(nextProps.accounts, prevState.accounts)) {
      _.assignIn(updatedState, {
        accounts: nextProps.accounts,
      })
    }

    return !_.isEmpty(updatedState) ? updatedState : null
  }

  _requestRequestStandardOperationsReport = (userOperation) => {
    this.props.fetchGetUserAccountHistoryReport(userOperation)
  }

  _onRequestAddReferral = (referral) => {
    this.props.fetchAddReferral(referral)
  }

  _onWireTransferRequest = (request) => {
    this.props.fetchAddWireTransferRequest(request)
  }

  render() {
    return (
      <Document id="userOperations-page">
        <UserAccount
          currentUser={this.state.currentUser}
          accounts={this.state.accounts}
          onRequestStandardOperationsReport={this._requestRequestStandardOperationsReport}
          onAddReferral={this._onRequestAddReferral}
          onWireTransferRequest={this._onWireTransferRequest}

          isReferralLoading={this.props.isReferralLoading}
          isReferralCompleted={this.props.isReferralCompleted}
          isReferralSuccess={this.props.isReferralSuccess}

          isWireTransferRequestLoading={ this.props.isWireTransferRequestLoading }
          isWireTransferRequestCompleted={ this.props.isWireTransferRequestCompleted }
          isWireTransferRequestSuccess={ this.props.isWireTransferRequestSuccess }
          isWireTransferRequestAddCompleted={ this.props.isWireTransferRequestAddCompleted }

          isLoading={false}
        />
      </Document>
    )
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

    isWireTransferRequestLoading: state.wireTransferRequestsState.isLoading,
    isWireTransferRequestSuccess: state.wireTransferRequestsState.isSuccess,
    wireTransferRequestMessage: state.wireTransferRequestsState.message,
    isWireTransferRequestCompleted: state.wireTransferRequestsState.isCompleted,
    isWireTransferRequestAddCompleted: state.wireTransferRequestsState.isAddCompleted,

    isHistoryReportLoading: state.userAccountsState.isHistoryReportLoading,
    isHistoryReportSuccess: state.userAccountsState.isHistoryReportSuccess,
    isHistoryReportComplete: state.userAccountsState.isHistoryReportComplete,
    historyReportData: state.userAccountsState.historyReportData,
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchGetUserAccounts: userAccountOperations.fetchGetUserAccounts,
      fetchGetUserAccountHistoryReport: userAccountOperations.fetchGetUserAccountHistoryReport,

      fetchAddWireTransferRequest: wireTransferRequestOperations.fetchAddWireTransferRequest,
      resetWireTransferRequestAfterRequest: wireTransferRequestOperations.resetAfterRequest,

      fetchAddReferral: referralOperations.fetchAddReferral,
      fetchGetReferrals: referralOperations.fetchGetReferrals,
      fetchGetUserAccountReferrals: referralOperations.fetchGetUserAccountReferrals,
      resetReferralAfterRequest: referralOperations.resetAfterRequest,

      resetAfterRequest: userAccountOperations.resetAfterRequest,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces()(UserOperations))
