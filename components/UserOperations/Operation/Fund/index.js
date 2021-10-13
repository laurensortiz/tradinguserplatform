import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'

import { Row, Col, Drawer, Tabs } from 'antd'
import _ from 'lodash'

import FundTable from './FundTable'
import OperationMovementDetail from './detail'

import { AccountInformation, MovementsTable } from '../shared'

import { investmentOperationOperations } from '../../../../state/modules/investmentOperation'
import { investmentMovementOperations } from '../../../../state/modules/investmentMovement'

const { TabPane } = Tabs

class Investment extends Component {
  state = {
    isVisibleAddOrEditOperation: false,
    actionType: 'add',
    selectedOperation: {},
    isCreatingOperation: false,
    operationType: 'investment',
    investmentOperations: [],
    userAccounts: [],
    isDetailViewVisible: false,
    currentOperationDetail: {},
    investmentMovements: [],
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {}
    if (!_.isEqual(nextProps.investmentOperations, prevState.investmentOperations)) {
      let investmentOperationsUser

      if (!nextProps.isAdmin) {
        investmentOperationsUser = _.filter(nextProps.investmentOperations, [
          'userAccount.userId',
          nextProps.currentUserId,
        ])
      } else {
        investmentOperationsUser = nextProps.investmentOperations
      }

      _.assignIn(updatedState, {
        investmentOperations: investmentOperationsUser,
      })

      if (prevState.isDetailViewVisible) {
        _.assignIn(updatedState, {
          currentOperationDetail: _.find(nextProps.investmentOperations, {
            id: prevState.currentOperationDetail.id,
          }),
        })
      }
    }

    if (
      nextProps.isSuccessMovements &&
      !_.isEmpty(nextProps.messageMovements) &&
      !_.isEmpty(prevState.investmentMovements)
    ) {
      nextProps.fetchGetInvestmentMovements(prevState.currentOperationDetail.id)
      nextProps.fetchGetInvestmentOperations()
      nextProps.resetAfterMovementRequest()
    }

    if (!_.isEqual(nextProps.investmentMovements, prevState.investmentMovements)) {
      _.assignIn(updatedState, {
        investmentMovements: nextProps.investmentMovements,
      })
    }

    return !_.isEmpty(updatedState) ? updatedState : null
  }

  componentDidMount() {
    this.props.fetchGetInvestmentOperations()
  }

  _handleDetailUserOperation = (operationId) => {
    const selectedOperation = _.find(this.props.investmentOperations, { id: operationId })

    this.setState({
      isDetailViewVisible: true,
      currentOperationDetail: selectedOperation,
    })
    this.props.fetchGetInvestmentMovements(operationId)
  }

  _onCloseDetailView = () => {
    this.setState({
      isDetailViewVisible: false,
      currentOperationDetail: {},
    })
    this.props.fetchGetInvestmentOperations()
  }

  render() {
    const currentUsername = _.get(
      this.state.currentOperationDetail,
      'userAccount.user.username',
      ''
    )
    const currentUserFirstName = _.get(
      this.state.currentOperationDetail,
      'userAccount.user.firstName',
      ''
    )
    const currentUserLastName = _.get(
      this.state.currentOperationDetail,
      'userAccount.user.lastName',
      ''
    )
    const modalDetailTitle = `${currentUsername} - ${currentUserFirstName} ${currentUserLastName}`

    const activeInvestmentOperations = _.filter(
      this.state.investmentOperations,
      ({ status }) => !_.isEqual(status, 0)
    )
    return (
      <>
        <Row>
          <Col>
            <>
              {!_.isEmpty(activeInvestmentOperations) ? (
                <h2>{this.props.t('title investmentOperations')}</h2>
              ) : null}
              <FundTable
                investmentOperations={activeInvestmentOperations}
                isLoading={this.props.isLoading}
                onEdit={this._onSelectEdit}
                onDelete={this._handleDeleteUserOperation}
                onDetail={this._handleDetailUserOperation}
                isAdmin={false}
              />
            </>
          </Col>
        </Row>
        <Drawer
          title={modalDetailTitle}
          width="85%"
          onClose={this._onCloseDetailView}
          visible={this.state.isDetailViewVisible}
          destroyOnClose={true}
        >
          <AccountInformation currentOperation={this.state.currentOperationDetail} />
          <OperationMovementDetail currentOperation={this.state.currentOperationDetail} />
          <MovementsTable
            movements={this.state.investmentMovements}
            onAdd={this._handleAddMovement}
            onEdit={this._handleEditMovement}
            onDelete={this._handleDeleteMovement}
            currentOperation={this.state.currentOperationDetail}
            isAdmin={this.props.isAdmin}
            isLoading={this.props.isLoading}
          />
        </Drawer>
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    investmentOperations: state.investmentOperationsState.list,
    isLoading: state.investmentOperationsState.isLoading,
    isSuccess: state.investmentOperationsState.isSuccess,
    isFailure: state.investmentOperationsState.isFailure,
    message: state.investmentOperationsState.message,

    investmentMovements: state.investmentMovementsState.list,
    isSuccessMovements: state.investmentMovementsState.isSuccess,
    messageMovements: state.investmentMovementsState.message,
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchGetInvestmentOperations: investmentOperationOperations.fetchGetInvestmentOperations,
      resetAfterRequest: investmentOperationOperations.resetAfterRequest,

      fetchGetInvestmentMovements: investmentMovementOperations.fetchGetInvestmentMovements,
      resetAfterMovementRequest: investmentMovementOperations.resetAfterRequest,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces()(Investment))
