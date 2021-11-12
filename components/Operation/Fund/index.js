import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Row, Col, Drawer, Tabs, notification, Radio } from 'antd'
import _ from 'lodash'

import Table from './Table'
import AddOrEditForm from './AddOrEditForm'
import OperationMovementDetail from './detail'

import { AccountInformation, MovementsTable } from '../shared'

import { fundOperationOperations } from '../../../state/modules/fundOperation'
import { fundMovementOperations } from '../../../state/modules/fundMovement'
import { FormatDate, GetGP } from '../../../common/utils'
import MarketTable from '../Market/MarketTable'
import moment from 'moment'

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
      nextProps.resetAfterRequest()
    }

    if (!_.isEqual(nextProps.fundMovements, prevState.fundMovements)) {
      _.assignIn(updatedState, {
        fundMovements: nextProps.fundMovements,
      })
    }

    if (nextProps.isBulkSuccess && nextProps.isBulkProcessCompleted) {
      const message = 'Actualización exitosa!'
      _.assignIn(updatedState, {
        isVisibleAddOrEditOperation: false,
      })
      nextProps.resetAfterRequest()
      notification.success({
        message,
        onClose: () => {
          prevState.actionType = 'add' // default value

          nextProps.fetchGetFundOperations()
          nextProps.onClose(false)
        },
        duration: 1,
      })
    } else {
      if (nextProps.isSuccess && !_.isEmpty(nextProps.message)) {
        let message = 'Operación de Fund Creada'

        if (_.isEqual(prevState.actionType, 'edit')) {
          message = 'Operación de Fund Modificado'
        }

        if (_.isEqual(prevState.actionType, 'delete')) {
          message = 'Operación de Fund Eliminado'
        }

        if (_.isEqual(prevState.actionType, 'active')) {
          message = 'Operación de Fund Activado'
        }

        prevState.isVisibleAddOrEditOperation = false
        nextProps.resetAfterRequest()
        notification.success({
          message,
          onClose: () => {
            prevState.actionType = 'add' // default value

            nextProps.fetchGetFundOperations()

            nextProps.onClose(false)
          },
          duration: 1,
        })
      }
    }

    if (nextProps.isBulkFailure && nextProps.isBulkProcessCompleted) {
      notification.error({
        message: 'Ha ocurrido un error en el proceso de actualización',
        description: nextProps.message,
        onClose: () => {
          nextProps.resetAfterRequest()
        },
        duration: 3,
      })
    } else {
      if (nextProps.isFailure && !_.isEmpty(nextProps.message)) {
        notification.error({
          message: 'Ha ocurrido un error',
          description: nextProps.message,
          onClose: () => {
            nextProps.resetAfterRequest()
          },
          duration: 3,
        })
      }
    }

    return !_.isEmpty(updatedState) ? updatedState : null
  }

  componentDidMount() {
    this.props.fetchGetFundOperations()
  }

  _addOperation = () => {
    this.setState({
      actionType: 'add',
      isVisibleAddOrEditOperation: true,
    })
  }

  _onClose = () => {
    this.setState({
      isVisibleAddOrEditOperation: false,
      selectedOperation: {},
      actionType: 'add',
    })
    this.props.onClose(false)
  }

  _handleAddNewUserOperation = (userOperation) => {
    this.props.fetchAddFundOperation(userOperation)
  }

  _handleEditUserOperation = (userAccount) => {
    this.props.fetchEditFundOperation(userAccount)
  }

  _handleDeleteUserOperation = (operationId) => {
    this.setState({
      actionType: 'delete',
    })
    this.props.fetchDeleteFundOperation(operationId)
  }

  _onSelectEdit = (operationId) => {
    this.setState({
      actionType: 'edit',
    })
    this._handleSelectEditUserOperation(operationId)
  }

  _onSelectActive = (userId) => {
    this.props.fetchEditFundOperation({
      id: userId,
      status: 1,
    })
    this.setState({
      actionType: 'active',
    })
  }

  _handleSelectEditUserOperation = (operationId) => {
    const selectedOperation = _.find(this.props.fundOperations, { id: operationId })
    this.setState({
      selectedOperation,
      isVisibleAddOrEditOperation: true,
    })
    this.props.handleFormVisible(true)
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

  /**
   * Add Movements
   */
  _handleAddMovement = (newMovement) => {
    const { id: fundOperationId } = this.state.currentOperationDetail
    const { gpInversion, gpAmount, createdAt, percentage } = newMovement
    this.props.fetchAddFundMovement({
      ...newMovement,
      fundOperationId,
      gpInversion: parseFloat(gpInversion).toFixed(2),
      gpAmount: parseFloat(gpAmount).toFixed(2),
      percentage: parseFloat(percentage).toFixed(2),
      createdAt,
    })
  }

  /**
   * Edit Movements
   */
  _handleEditMovement = (newMovement) => {
    const { gpInversion, gpAmount, createdAt, id, percentage } = newMovement
    this.props.fetchEditFundMovement({
      id,
      gpInversion: parseFloat(gpInversion).toFixed(2),
      gpAmount: parseFloat(gpAmount).toFixed(2),
      percentage: parseFloat(percentage).toFixed(2),
      createdAt: moment.parseZone(createdAt),
    })
  }

  /**
   * Delete Movements
   */
  _handleDeleteMovement = (movementId) => {
    this.props.fetchDeleteFundMovement(movementId)
  }

  /**
   * Bulk Update
   */
  _handleBulkUpdate = (bulkData) => {
    this.props.fetchBulkUpdateFundOperation(bulkData)
  }

  render() {
    const modalTitle = _.isEqual(this.state.actionType, 'add')
      ? 'Agregar Operación de Fund'
      : 'Editar Operación de Fund'

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
      ({ status }) => !_.isEqual(status, 0)
    )
    const deletedFundOperations = _.filter(this.state.fundOperations, { status: 0 })
    return (
      <>
        <Row>
          <Col>
            {this.props.isAdmin ? (
              <Tabs animated={false}>
                <TabPane tab="Activos" key="1">
                  <Table
                    fundOperations={activeFundOperations}
                    onRequestUpdateTable={this.props.fetchGetFundOperations}
                    isLoading={this.props.isLoading}
                    onEdit={this._onSelectEdit}
                    onDelete={this._handleDeleteUserOperation}
                    onDetail={this._handleDetailUserOperation}
                    onFetchBulkUpdate={this._handleBulkUpdate}
                    isBulkLoading={this.props.isBulkLoading}
                    isBulkSuccess={this.props.isBulkSuccess}
                    isBulkCompleted={this.props.isBulkProcessCompleted}
                    isAdmin={true}
                  />
                </TabPane>
                <TabPane tab="Eliminados" key="2">
                  <Table
                    fundOperations={deletedFundOperations}
                    isLoading={this.props.isLoading}
                    onActive={this._onSelectActive}
                    status="inactive"
                    isAdmin={true}
                  />
                </TabPane>
              </Tabs>
            ) : (
              <>
                {!_.isEmpty(activeFundOperations) ? <h2>Operaciones Founds</h2> : null}
                <Table
                  fundOperations={activeFundOperations}
                  isLoading={this.props.isLoading}
                  onEdit={this._onSelectEdit}
                  onDelete={this._handleDeleteUserOperation}
                  onDetail={this._handleDetailUserOperation}
                  isAdmin={false}
                />
              </>
            )}
          </Col>
        </Row>
        <Drawer
          title={modalTitle}
          width={340}
          onClose={this._onClose}
          visible={this.props.isFormVisible}
          destroyOnClose={true}
        >
          <AddOrEditForm
            onAddNew={this._handleAddNewUserOperation}
            onEdit={this._handleEditUserOperation}
            isLoading={this.props.isLoading}
            selectedOperation={this.state.selectedOperation}
            actionType={this.state.actionType}
          />
        </Drawer>

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

    isBulkLoading: state.fundOperationsState.isBulkLoading,
    isBulkSuccess: state.fundOperationsState.isBulkSuccess,
    isBulkFailure: state.fundOperationsState.isBulkFailure,
    isBulkProcessCompleted: state.fundOperationsState.isBulkProcessCompleted,

    fundMovements: state.fundMovementsState.list,
    isSuccessMovements: state.fundMovementsState.isSuccess,
    messageMovements: state.fundMovementsState.message,
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchGetFundOperations: fundOperationOperations.fetchGetFundOperations,
      fetchAddFundOperation: fundOperationOperations.fetchAddFundOperation,
      fetchEditFundOperation: fundOperationOperations.fetchEditFundOperation,
      fetchDeleteFundOperation: fundOperationOperations.fetchDeleteFundOperation,
      resetAfterRequest: fundOperationOperations.resetAfterRequest,
      fetchBulkUpdateFundOperation: fundOperationOperations.fetchBulkUpdateFundOperation,

      fetchGetFundMovements: fundMovementOperations.fetchGetFundMovements,
      fetchAddFundMovement: fundMovementOperations.fetchAddFundMovement,
      fetchEditFundMovement: fundMovementOperations.fetchEditFundMovement,
      fetchDeleteFundMovement: fundMovementOperations.fetchDeleteFundMovement,
      //resetAfterRequest: fundOperationOperations.resetAfterRequest,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Fund)
