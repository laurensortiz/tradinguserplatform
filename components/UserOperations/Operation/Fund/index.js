import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'

import { Row, Col, Drawer, Tabs } from 'antd'
import _ from 'lodash'

import FundTable from './FundTable'
import OperationMovementDetail from './detail'

import { AccountInformation, MovementsTable } from '../shared'

import { fundOperationOperations } from '../../../../state/modules/fundOperation'
import { fundMovementOperations } from '../../../../state/modules/fundMovement'

const { TabPane } = Tabs

class Fund extends Component {
  state = {
    isVisibleAddOrEditOperation: false,
    actionType: 'add',
    selectedOperation: {},
    isCreatingOperation: false,
    operationType: 'fund',
    fundOperations: [],
    userAccounts: [],
    isDetailViewVisible: false,
    currentOperationDetail: {},
    fundMovements: [],
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {}
    if (!_.isEqual(nextProps.fundOperations, prevState.fundOperations)) {
      let fundOperationsUser

      if (!nextProps.isAdmin) {
        fundOperationsUser = _.filter(nextProps.fundOperations, [
          'userAccount.userId',
          nextProps.currentUserId,
        ])
      } else {
        fundOperationsUser = nextProps.fundOperations
      }

      _.assignIn(updatedState, {
        fundOperations: fundOperationsUser,
      })

      if (prevState.isDetailViewVisible) {
        _.assignIn(updatedState, {
          currentOperationDetail: _.find(nextProps.fundOperations, {
            id: prevState.currentOperationDetail.id,
          }),
        })
      }
    }

    if (
      nextProps.isSuccessMovements &&
      !_.isEmpty(nextProps.messageMovements) &&
      !_.isEmpty(prevState.fundMovements)
    ) {
      nextProps.fetchGetFundMovements(prevState.currentOperationDetail.id)
      nextProps.fetchGetFundOperations()
      nextProps.resetAfterMovementRequest()
    }

    if (!_.isEqual(nextProps.fundMovements, prevState.fundMovements)) {
      _.assignIn(updatedState, {
        fundMovements: nextProps.fundMovements,
      })
    }

    return !_.isEmpty(updatedState) ? updatedState : null
  }

  componentDidMount() {
    this.props.fetchGetFundOperations()
  }

  _handleDetailUserOperation = (operationId) => {
    const selectedOperation = _.find(this.props.fundOperations, { id: operationId })

    this.setState({
      isDetailViewVisible: true,
      currentOperationDetail: selectedOperation,
    })
    this.props.fetchGetFundMovements(operationId)
  }

  _onCloseDetailView = () => {
    this.setState({
      isDetailViewVisible: false,
      currentOperationDetail: {},
    })
    this.props.fetchGetFundOperations()
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

    const activeFundOperations = _.filter(
      this.state.fundOperations,
      ({ status, userAccountId }) =>
        !_.isEqual(status, 0) && userAccountId === this.props.userAccountId
    )

    return (
      <>
        <Row>
          <Col>
            <>
              {!_.isEmpty(activeFundOperations) ? <h2>Funds</h2> : null}
              <FundTable
                fundOperations={activeFundOperations}
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
            movements={this.state.fundMovements}
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
    fundOperations: state.fundOperationsState.list,
    isLoading: state.fundOperationsState.isLoading,
    isSuccess: state.fundOperationsState.isSuccess,
    isFailure: state.fundOperationsState.isFailure,
    message: state.fundOperationsState.message,

    fundMovements: state.fundMovementsState.list,
    isSuccessMovements: state.fundMovementsState.isSuccess,
    messageMovements: state.fundMovementsState.message,
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchGetFundOperations: fundOperationOperations.fetchGetFundOperations,
      resetAfterRequest: fundOperationOperations.resetAfterRequest,

      fetchGetFundMovements: fundMovementOperations.fetchGetFundMovements,
      resetAfterMovementRequest: fundMovementOperations.resetAfterRequest,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces()(Fund))
