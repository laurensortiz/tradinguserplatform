import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Row, Col, Drawer, Tabs, notification, Button, Dropdown, Menu, Icon } from 'antd'
import _ from 'lodash'
import moment from 'moment'

import MarketTable from './MarketTable'
import AddOrEditMarketForm from './AddOrEditMarketForm'
import MarketMovementDetail from './detail'

import { AccountInformation, MovementsTable } from '../shared'

import { marketOperationOperations } from '../../../state/modules/marketOperation'
import { marketMovementOperations } from '../../../state/modules/marketMovement'

class Market extends Component {
  state = {
    isVisibleAddOrEditOperation: false,
    actionType: 'add',
    selectedOperation: {},
    isCreatingOperation: false,
    operationType: 'market',
    marketOperations: [],
    userAccounts: [],
    isDetailViewVisible: false,
    currentOperationDetail: {},
    marketMovements: [],
    isBulkSuccess: false,
    isBulkProcessCompleted: false,
    dataStatus: 1,
    pagination: {
      current: 1,
      pageSize: 10,
      defaultPageSize: 10,
      total: 0,
      showSizeChanger: true,
      pageSizeOptions: ['10', '30', '50'],
    },
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {}
    if (!_.isEqual(nextProps.marketOperations.rows, prevState.marketOperations)) {
      _.assignIn(updatedState, {
        marketOperations: nextProps.marketOperations.rows,
        pagination: {
          ...prevState.pagination,
          total: nextProps.marketOperations.totalItems,
        },
      })
    }

    if (!_.isEqual(nextProps.currentOperationDetail, prevState.currentOperationDetail)) {
      _.assignIn(updatedState, {
        currentOperationDetail: nextProps.currentOperationDetail,
      })
    }

    if (
      nextProps.isSuccessMovements &&
      !_.isEmpty(nextProps.messageMovements) &&
      !_.isEmpty(prevState.marketMovements)
    ) {
      if (!_.isNil(prevState.currentOperationDetail.id)) {
        nextProps.fetchGetMarketMovements(prevState.currentOperationDetail.id)
      }

      nextProps.fetchGetMarketOperations({
        pagination: prevState.pagination,
        status: prevState.dataStatus,
      })
      nextProps.resetAfterMovementRequest()
    }

    if (!_.isEqual(nextProps.marketMovements, prevState.marketMovements)) {
      _.assignIn(updatedState, {
        marketMovements: nextProps.marketMovements,
      })
    }

    if (nextProps.isBulkSuccess && nextProps.isBulkProcessCompleted) {
      const message = 'Actualización exitosa!'
      _.assignIn(updatedState, {
        isVisibleAddOrEditOperation: false,
      })

      notification.success({
        message,
        onClose: () => {
          prevState.actionType = 'add' // default value
          nextProps.resetAfterRequest()
          nextProps.fetchGetMarketOperations({
            pagination: prevState.pagination,
            status: prevState.dataStatus,
          })
          nextProps.onClose(false)
        },
        duration: 1,
      })
    } else {
      if (nextProps.isSuccess && !_.isEmpty(nextProps.message)) {
        let message = 'Operación de Bolsa OTC Creada'

        if (_.isEqual(prevState.actionType, 'edit')) {
          message = 'Operación de Bolsa OTC Modificado'
        }

        if (_.isEqual(prevState.actionType, 'delete')) {
          message = 'Operación de Bolsa OTC Eliminado'
        }

        if (_.isEqual(prevState.actionType, 'active')) {
          message = 'Operación de Bolsa OTC Activado'
        }
        _.assignIn(updatedState, {
          isVisibleAddOrEditOperation: false,
        })

        notification.success({
          message,
          onClose: () => {
            prevState.actionType = 'add' // default value

            nextProps.fetchGetMarketOperations({
              pagination: prevState.pagination,
              status: prevState.dataStatus,
            })
            nextProps.resetAfterRequest()
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
    this.props.fetchGetMarketOperations({
      pagination: this.state.pagination,
      status: this.state.dataStatus,
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
    this.props.fetchAddMarketOperation(userOperation)
  }

  _handleEditUserOperation = (userAccount) => {
    this.props.fetchEditMarketOperation(userAccount)
  }

  _handleDeleteUserOperation = (operationId) => {
    this.setState({
      actionType: 'delete',
    })
    this.props.fetchDeleteMarketOperation(operationId)
  }

  _onSelectEdit = (operationId) => {
    this.setState({
      actionType: 'edit',
    })
    this._handleSelectEditUserOperation(operationId)
  }

  _onSelectActive = (operationId) => {
    this.props.fetchEditMarketOperation({
      id: operationId,
      status: 1,
    })
    this.setState({
      actionType: 'active',
    })
  }

  _handleSelectEditUserOperation = (operationId) => {
    const selectedOperation = _.find(this.props.marketOperations.rows, { id: operationId })
    this.setState({
      selectedOperation,
      isVisibleAddOrEditOperation: true,
    })
    this.props.handleFormVisible(true)
  }

  _handleDetailUserOperation = (operationId) => {
    this.setState({
      isDetailViewVisible: true,
    })
    this.props.fetchGetMarketOperation(operationId)
    this.props.fetchGetMarketMovements(operationId)
  }

  _onCloseDetailView = () => {
    this.setState({
      isDetailViewVisible: false,
      currentOperationDetail: {},
    })
    this.props.fetchGetMarketOperations({
      pagination: this.state.pagination,
      status: this.state.dataStatus,
    })
  }

  _onTabChange = ({ target }) => {
    this.setState({
      dataStatus: target.value,
    })
    this.props.fetchGetMarketOperations({
      pagination: this.state.pagination,
      status: target.value,
    })
  }

  /**
   * Add Movements
   */
  _handleAddMovement = (newMovement) => {
    const { id: marketOperationId } = this.state.currentOperationDetail
    const { gpInversion, gpAmount } = newMovement

    this.props.fetchAddMarketMovement({
      ...newMovement,
      marketOperationId,
      gpInversion: parseFloat(gpInversion).toFixed(2),
      gpAmount: parseFloat(gpAmount).toFixed(2),
    })
  }

  /**
   * Edit Movements
   */
  _handleEditMovement = (newMovement) => {
    const { gpInversion, gpAmount, marketPrice, createdAt, id } = newMovement
    this.props.fetchEditMarketMovement({
      id,
      gpInversion: parseFloat(gpInversion).toFixed(2),
      gpAmount: parseFloat(gpAmount).toFixed(2),
      marketPrice: parseFloat(marketPrice).toFixed(2),
      createdAt: moment.parseZone(createdAt),
    })
  }

  /**
   * Delete Movements
   */
  _handleDeleteMovement = (movementId) => {
    this.props.fetchDeleteMarketMovement(movementId)
  }
  /**
   * Bulk Update
   */
  _handleBulkUpdate = (bulkData) => {
    this.props.fetchBulkUpdateMarketOperation(bulkData)
  }

  handlePaginationChange = (pagination) => {
    const paginationState = {
      ...this.state.pagination,
      ...pagination,
    }

    this.setState({
      pagination: paginationState,
    })

    this.props.fetchGetMarketOperations({
      pagination: paginationState,
      status: this.state.dataStatus,
    })
  }

  render() {
    const modalTitle = _.isEqual(this.state.actionType, 'add')
      ? 'Agregar Operación de Bolsa'
      : 'Editar Operación de Bolsa'

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

    console.log('[=====  oppe  =====>')
    console.log(this.state.selectedOperation)
    console.log('<=====  /oppe  =====]')

    return (
      <>
        <Row>
          <Col>
            <MarketTable
              marketOperations={this.state.marketOperations}
              isLoading={this.props.isLoading}
              onEdit={this._onSelectEdit}
              onActive={this._onSelectActive}
              onDelete={this._handleDeleteUserOperation}
              onDetail={this._handleDetailUserOperation}
              isAdmin={true}
              onFetchBulkUpdate={this._handleBulkUpdate}
              isBulkLoading={this.props.isBulkLoading}
              isBulkSuccess={this.props.isBulkSuccess}
              isBulkCompleted={this.props.isBulkProcessCompleted}
              onTabChange={this._onTabChange}
              onRequestUpdateTable={this.handlePaginationChange}
              dataStatus={this.state.dataStatus}
              pagination={this.state.pagination}
              onChangePagination={this.handlePaginationChange}
            />
          </Col>
        </Row>
        <Drawer
          title={modalTitle}
          width={340}
          onClose={this._onClose}
          visible={this.props.isFormVisible}
          destroyOnClose={true}
        >
          <AddOrEditMarketForm
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

          <MarketMovementDetail currentOperation={this.state.currentOperationDetail} />

          <MovementsTable
            movements={this.state.marketMovements}
            onAdd={this._handleAddMovement}
            onEdit={this._handleEditMovement}
            onDelete={this._handleDeleteMovement}
            currentOperation={this.state.currentOperationDetail}
            isAdmin={this.props.isAdmin}
            isLoading={this.props.isLoading}
            isMarketMovement={true}
          />
        </Drawer>
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    marketOperations: state.marketOperationsState.list,
    currentOperationDetail: state.marketOperationsState.item,
    isLoading: state.marketOperationsState.isLoading,
    isSuccess: state.marketOperationsState.isSuccess,
    isFailure: state.marketOperationsState.isFailure,

    isBulkLoading: state.marketOperationsState.isBulkLoading,
    isBulkSuccess: state.marketOperationsState.isBulkSuccess,
    isBulkFailure: state.marketOperationsState.isBulkFailure,
    isBulkProcessCompleted: state.marketOperationsState.isBulkProcessCompleted,

    message: state.marketOperationsState.message,

    marketMovements: state.marketMovementsState.list,
    isSuccessMovements: state.marketMovementsState.isSuccess,
    messageMovements: state.marketMovementsState.message,
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchGetMarketOperations: marketOperationOperations.fetchGetMarketOperations,
      fetchGetMarketOperation: marketOperationOperations.fetchGetMarketOperation,
      fetchAddMarketOperation: marketOperationOperations.fetchAddMarketOperation,
      fetchEditMarketOperation: marketOperationOperations.fetchEditMarketOperation,
      fetchDeleteMarketOperation: marketOperationOperations.fetchDeleteMarketOperation,
      fetchBulkUpdateMarketOperation: marketOperationOperations.fetchBulkUpdateMarketOperation,
      resetAfterRequest: marketOperationOperations.resetAfterRequest,

      fetchGetMarketMovements: marketMovementOperations.fetchGetMarketMovements,
      fetchAddMarketMovement: marketMovementOperations.fetchAddMarketMovement,
      fetchEditMarketMovement: marketMovementOperations.fetchEditMarketMovement,
      fetchDeleteMarketMovement: marketMovementOperations.fetchDeleteMarketMovement,
      resetAfterMovementRequest: marketMovementOperations.resetAfterRequest,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Market)
