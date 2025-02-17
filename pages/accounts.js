import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Row, Col, Button, Drawer, Icon, Radio, notification } from 'antd'
import _ from 'lodash'

import Document from '../components/Document'

import UserAccountsTable from '../components/UserAccount/UserAccountsTable'
import AddOrEditUserAccountForm from '../components/UserAccount/AddOrEditUserAccountForm'

import { userAccountOperations } from '../state/modules/userAccounts'
import { marketOperationOperations } from '../state/modules/marketOperation'
import ExportHistoryReport from '../components/Operation/shared/ExportUserAccountHistory'
import ExportUserAccountOTCDetail from '../components/Operation/shared/ExportUserAccountOTCDetail'
import ExportUserAccountProfitMonthDetail from '../components/Operation/shared/ExportUserAccountProfitMonthDetail'

import MovementsTable from '../components/UserAccount/MovementsTable'

class Accounts extends Component {
  state = {
    isVisibleAddOrEditUserAccount: false,
    actionType: 'add',
    selectedUserAccount: {},
    isCreatingOperation: false,
    associatedOperation: 1,
    status: 1,
    isBulkSuccess: false,
    isBulkProcessCompleted: false,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.isHistoryReportSuccess && nextProps.isHistoryReportComplete) {
      if (_.isEmpty(nextProps.historyReportData)) {
        notification.info({
          message: 'No se encontraron Operaciones para esta cuenta',
          onClose: () => {
            nextProps.resetAfterRequest()
          },
          duration: 3,
        })
      } else {
        ExportHistoryReport(nextProps.historyReportData)
        notification.success({
          message: 'Descargando Reporte Historico de la cuenta',
          onClose: () => {
            nextProps.resetAfterRequest()
          },
          duration: 3,
        })
      }
    }

    if (nextProps.isListReportSuccess && nextProps.isListReportComplete) {
      if (_.isEmpty(nextProps.listReportData)) {
        notification.info({
          message: 'No se encontraron Operaciones para esta cuenta',
          onClose: () => {
            nextProps.resetAfterRequest()
          },
          duration: 3,
        })
      } else {
        if (prevState.associatedOperation === 1) {
          ExportUserAccountOTCDetail(nextProps.listReportData)
        } else {
          ExportUserAccountProfitMonthDetail(nextProps.listReportData)
        }

        notification.success({
          message: 'Descargando Reporte de cuentas',
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

    if (nextProps.isBulkSuccess && nextProps.isBulkProcessCompleted) {
      const message = 'Actualización exitosa!'

      notification.success({
        message,
        onClose: () => {
          nextProps.resetAfterRequest()
          nextProps.resetAfterBulkRequest()
          nextProps.fetchGetAllUserAccounts({
            associatedOperation: prevState.associatedOperation,
            status: prevState.status,
          })
        },
        duration: 1,
      })
    } else {
      if (nextProps.isSuccess && !_.isEmpty(nextProps.message)) {
        let message = 'Cuenta de Usuario Creada'

        if (_.isEqual(prevState.actionType, 'edit')) {
          message = 'Cuenta de Usuario Modificado'
        }

        if (_.isEqual(prevState.actionType, 'delete')) {
          message = 'Cuenta de Usuario Eliminado'
        }

        if (_.isEqual(prevState.actionType, 'active')) {
          message = 'Cuenta de Usuario Activado'
        }

        prevState.isVisibleAddOrEditUserAccount = false
        notification.success({
          message,
          onClose: () => {
            prevState.actionType = 'add' // default value

            nextProps.fetchGetAllUserAccounts({
              associatedOperation: prevState.associatedOperation,
              status: prevState.status,
            })
            nextProps.resetAfterRequest()
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

    if (
      !_.isEmpty(nextProps.userAccount) &&
      !_.isEqual(nextProps.userAccount, prevState.selectedUserAccount)
    ) {
      return {
        selectedUserAccount: {
          ...prevState.selectedUserAccount,
          ...nextProps.userAccount,
        },
      }
    }
    return null
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !_.isEqual(prevState.status, this.state.status) ||
      !_.isEqual(prevState.associatedOperation, this.state.associatedOperation)
    ) {
      this.props.fetchGetAllUserAccounts({
        associatedOperation: this.state.associatedOperation,
        status: this.state.status,
      })
    }
  }

  componentDidMount() {
    this.props.fetchGetAllUserAccounts({
      associatedOperation: this.state.associatedOperation,
      status: this.state.status,
    })
  }

  _addUserAccount = () => {
    this.setState({
      actionType: 'add',
      isVisibleAddOrEditUserAccount: true,
    })
  }

  _onClose = () => {
    this._handleTableOnChange()
    this.props.resetAfterRequest()
    this.setState({
      isVisibleAddOrEditUserAccount: false,
      selectedUserAccount: {},
    })
  }

  _handleFetchUserAccount = (accountId) => {
    this.props.fetchGetUserAccount(accountId)
  }

  _handleAddNewUserAccount = (userAccount) => {
    this.props.fetchAddUserAccount(userAccount)
  }

  _handleEditUserAccount = (userAccount) => {
    this.props.fetchEditUserAccount(userAccount)
  }

  _handleDeleteUserAccount = (userId) => {
    this.setState({
      actionType: 'delete',
    })
    this.props.fetchDeleteUserAccount(userId)
  }

  _onSelectEdit = (userId) => {
    this.setState({
      actionType: 'edit',
    })
    this._handleSelectEditUserAccount(userId)
  }

  _onSelectActive = (accountId) => {
    this.props.fetchEditUserAccount({
      id: accountId,
      status: 1,
    })
    this.setState({
      actionType: 'active',
    })
  }

  _handleSelectEditUserAccount = (userId) => {
    const selectedUserAccount = _.find(this.props.userAccounts, { id: userId })
    this.setState({
      selectedUserAccount,
      isVisibleAddOrEditUserAccount: true,
    })
  }

  _onSelectOperationType = ({ target }) => {
    this.setState({
      associatedOperation: target.value,
    })
  }

  _handleExportHistoryReport = (accountId) => {
    this.props.fetchGetUserAccountHistoryReport(accountId)
  }

  _handleExportAccountReport = (accountsSelected) => {
    const accountsSelectedIds = accountsSelected.reduce((result, account) => {
      result.push(account.id)
      return result
    }, [])
    const associatedOperation = this.state.associatedOperation
    this.props.fetchGetUserAccountListReport({ accountsSelectedIds, associatedOperation })
  }

  _handleTabChange = ({ target }) => {
    this.setState({
      status: target.value,
    })
  }

  _handleTableOnChange = () => {
    this.props.fetchGetAllUserAccounts({
      associatedOperation: this.state.associatedOperation,
      status: this.state.status,
    })
  }

  /**
   * Bulk Update
   */
  _handleBulkUpdate = (bulkData) => {
    this.props.fetchBulkUpdateMarketOperation(bulkData)
  }

  render() {
    const modalTitle = _.isEqual(this.state.actionType, 'add')
      ? 'Agregar Cuenta de Usuario'
      : 'Editar Cuenta de Usuario'

    return (
      <Document id="userAccounts-page">
        <Row style={{ marginBottom: 30 }}>
          <Radio.Group
            defaultValue={this.state.associatedOperation}
            size="large"
            style={{ float: 'left' }}
            onChange={this._onSelectOperationType}
            buttonStyle="solid"
          >
            <Radio.Button value={1}>
              <Icon type="sliders" /> Standard
            </Radio.Button>
            <Radio.Button value={2}>
              {' '}
              <Icon type="bank" /> Profit Month
            </Radio.Button>
            <Radio.Button value={3}>
              <Icon type="fund" /> Funds FND
            </Radio.Button>
          </Radio.Group>
          <Button
            style={{ float: 'right' }}
            type="primary"
            onClick={this._addUserAccount}
            size="large"
          >
            <Icon type="plus-circle" /> Agregar Cuenta
          </Button>
        </Row>
        <Row>
          <Col>
            <UserAccountsTable
              userAccounts={this.props.userAccounts}
              isLoading={
                this.props.isLoading ||
                this.props.isHistoryReportLoading ||
                this.props.isListReportLoading
              }
              onActive={this._onSelectActive}
              onEdit={this._onSelectEdit}
              onDelete={this._handleDeleteUserAccount}
              isOperationStandard={_.isEqual(this.state.associatedOperation, 1)}
              onRequestUpdateTable={this._handleTableOnChange}
              onReqeuestExportHistoryReport={this._handleExportHistoryReport}
              onReqeuestExportAccountReport={this._handleExportAccountReport}
              onTabChange={this._handleTabChange}
              dataStatus={this.state.status}
              onFetchBulkUpdate={this._handleBulkUpdate}
              isBulkLoading={this.props.isBulkLoading}
              isBulkSuccess={this.state.isBulkSuccess}
              isBulkCompleted={this.state.isBulkCompleted}
            />
          </Col>
        </Row>
        <Drawer
          title={modalTitle}
          width="85%"
          onClose={this._onClose}
          visible={this.state.isVisibleAddOrEditUserAccount}
          destroyOnClose={true}
        >
          <AddOrEditUserAccountForm
            onAddNew={this._handleAddNewUserAccount}
            onEdit={this._handleEditUserAccount}
            isLoading={this.props.isLoading}
            selectedAccount={this.state.selectedUserAccount}
            actionType={this.state.actionType}
            isMovementCompleted={this.props.isMovementCompleted}
          />
          <MovementsTable
            selectedAccount={this.state.selectedUserAccount}
            onFetchUserAccount={this._handleFetchUserAccount}
            isProfitMonth={this.state.associatedOperation === 2}
            isAdmin={true}
          />
        </Drawer>
      </Document>
    )
  }
}

function mapStateToProps(state) {
  return {
    userAccounts: state.userAccountsState.list,
    userAccount: state.userAccountsState.item,
    isLoading: state.userAccountsState.isLoading,
    isSuccess: state.userAccountsState.isSuccess,
    isFailure: state.userAccountsState.isFailure,
    message: state.userAccountsState.message,
    isHistoryReportLoading: state.userAccountsState.isHistoryReportLoading,
    isHistoryReportSuccess: state.userAccountsState.isHistoryReportSuccess,
    isHistoryReportComplete: state.userAccountsState.isHistoryReportComplete,
    historyReportData: state.userAccountsState.historyReportData,

    listReportData: state.userAccountsState.listReportData,
    isListReportLoading: state.userAccountsState.isListReportLoading,
    isListReportSuccess: state.userAccountsState.isListReportSuccess,
    isListReportComplete: state.userAccountsState.isListReportComplete,

    isMovementCompleted: state.userAccountMovementsState.isCompleted,

    isBulkLoading: state.marketOperationsState.isBulkLoading,
    isBulkSuccess: state.marketOperationsState.isBulkSuccess,
    isBulkFailure: state.marketOperationsState.isBulkFailure,
    isBulkProcessCompleted: state.marketOperationsState.isBulkProcessCompleted,
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchGetAllUserAccounts: userAccountOperations.fetchGetAllUserAccounts,
      fetchGetUserAccount: userAccountOperations.fetchGetUserAccount,
      fetchAddUserAccount: userAccountOperations.fetchAddUserAccount,
      fetchEditUserAccount: userAccountOperations.fetchEditUserAccount,
      fetchDeleteUserAccount: userAccountOperations.fetchDeleteUserAccount,
      fetchGetUserAccountHistoryReport: userAccountOperations.fetchGetUserAccountHistoryReport,
      fetchGetUserAccountListReport: userAccountOperations.fetchGetUserAccountListReport,
      resetAfterRequest: userAccountOperations.resetAfterRequest,

      fetchBulkUpdateMarketOperation: marketOperationOperations.fetchBulkUpdateMarketOperation,
      resetAfterBulkRequest: marketOperationOperations.resetAfterRequest,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Accounts)
