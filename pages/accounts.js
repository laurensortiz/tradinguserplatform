import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Row, Col, Button, Drawer, Tabs, Icon, Radio, notification } from 'antd';
import _ from 'lodash';

import Document from '../components/Document';

import UserAccountsTable from '../components/UserAccount/UserAccountsTable';
import AddOrEditUserAccountForm from '../components/UserAccount/AddOrEditUserAccountForm';

import { userAccountOperations } from "../state/modules/userAccounts";
import ExportHistoryReport from '../components/Operation/shared/ExportUserAccountHistory';

const { TabPane } = Tabs;

class Accounts extends Component {
  state = {
    isVisibleAddOrEditUserAccount: false,
    actionType: 'add',
    selectedUserAccount: {},
    isCreatingOperation: false,
    associatedOperation: 1,
    status: 1
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.isHistoryReportSuccess && nextProps.isHistoryReportComplete) {
      if (_.isEmpty( nextProps.historyReportData )) {
        notification.info( {
          message: 'No se encontraron Operaciones Cerradas para esta cuenta',
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

    if (nextProps.isSuccess && !_.isEmpty( nextProps.message )) {
      let message = 'Cuenta de Usuario Creada';

      if (_.isEqual( prevState.actionType, 'edit' )) {
        message = 'Cuenta de Usuario Modificado';
      }

      if (_.isEqual( prevState.actionType, 'delete' )) {
        message = 'Cuenta de Usuario Eliminado';
      }

      if (_.isEqual( prevState.actionType, 'active' )) {
        message = 'Cuenta de Usuario Activado';
      }

      prevState.isVisibleAddOrEditUserAccount = false;
      notification.success( {
        message,
        onClose: () => {
          prevState.actionType = 'add'; // default value

          nextProps.fetchGetAllUserAccounts( {
            associatedOperation: prevState.associatedOperation,
            status: prevState.status
          } );
          nextProps.resetAfterRequest();
        },
        duration: 1
      } )

    }

    if (nextProps.isFailure && !_.isEmpty( nextProps.message )) {
      notification.error( {
        message: 'Ha ocurrido un error',
        description: nextProps.message,
        onClose: () => {
          nextProps.resetAfterRequest();
        },
        duration: 3
      } )

    }

    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual( prevState.status, this.state.status ) ||
      !_.isEqual( prevState.associatedOperation, this.state.associatedOperation )) {
      this.props.fetchGetAllUserAccounts( {
        associatedOperation: this.state.associatedOperation,
        status: this.state.status
      } );
    }
  }

  componentDidMount() {
    this.props.fetchGetAllUserAccounts( {
      associatedOperation: this.state.associatedOperation,
      status: this.state.status
    } );
  };

  _addUserAccount = () => {
    this.setState( {
      actionType: 'add',
      isVisibleAddOrEditUserAccount: true
    } )
  };

  _onClose = () => {
    this.setState( {
      isVisibleAddOrEditUserAccount: false,
      selectedUserAccount: {}
    } )
  };

  _handleAddNewUserAccount = (userAccount) => {
    this.props.fetchAddUserAccount( userAccount )
  };

  _handleEditUserAccount = (userAccount) => {
    this.props.fetchEditUserAccount( userAccount )
  };

  _handleDeleteUserAccount = (userId) => {
    this.setState( {
      actionType: 'delete'
    } );
    this.props.fetchDeleteUserAccount( userId );
  };

  _onSelectEdit = (userId) => {
    this.setState( {
      actionType: 'edit'
    } );
    this._handleSelectEditUserAccount( userId )
  };

  _handleSelectEditUserAccount = (userId) => {
    const selectedUserAccount = _.find( this.props.userAccounts, { id: userId } );
    this.setState( {
      selectedUserAccount,
      isVisibleAddOrEditUserAccount: true,
    } )
  };

  _onSelectOperationType = ({ target }) => {
    this.setState( {
      associatedOperation: target.value,
    } );

  };

  _handleExportHistoryReport = (accountId) => {
    this.props.fetchGetUserAccountHistoryReport( accountId )
  }

  _handleTabChange = ({ target }) => {
    this.setState( {
      status: target.value
    } )
  }

  render() {
    const modalTitle = _.isEqual( this.state.actionType, 'add' )
      ? 'Agregar Cuenta de Usuario'
      : 'Editar Cuenta de Usuario';


    return (
      <Document id="userAccounts-page">
        <Row style={ { marginBottom: 30 } }>
          <Radio.Group
            defaultValue={ this.state.associatedOperation }
            size="large"
            style={ { float: 'left' } }
            onChange={ this._onSelectOperationType }
            buttonStyle="solid"
          >
            <Radio.Button value={ 1 }><Icon type="sliders"/> Standard</Radio.Button>
            <Radio.Button value={ 2 }> <Icon type="fund"/> Profit Month</Radio.Button>
          </Radio.Group>
          <Button style={ { float: 'right' } } type="primary" onClick={ this._addUserAccount } size="large">
            <Icon type="plus-circle"/> Agregar Cuenta
          </Button>
        </Row>
        <Row>
          <Col>
            <UserAccountsTable
              userAccounts={ this.props.userAccounts }
              isLoading={ this.props.isLoading || this.props.isHistoryReportLoading }
              onEdit={ this._onSelectEdit }
              onDelete={ this._handleDeleteUserAccount }
              isOperationStandard={ _.isEqual( this.state.associatedOperation, 1 ) }
              onRequestUpdateTable={ this.props.fetchGetAllUserAccounts }
              onReqeuestExportHistoryReport={ this._handleExportHistoryReport }
              onTabChange={ this._handleTabChange }
              dataStatus={ this.state.status }
            />
          </Col>
        </Row>
        <Drawer
          title={ modalTitle }
          width={ 320 }
          onClose={ this._onClose }
          visible={ this.state.isVisibleAddOrEditUserAccount }
          destroyOnClose={ true }
        >
          <AddOrEditUserAccountForm
            onAddNew={ this._handleAddNewUserAccount }
            onEdit={ this._handleEditUserAccount }
            isLoading={ this.props.isLoading }
            selectedAccount={ this.state.selectedUserAccount }
            actionType={ this.state.actionType }
          />
        </Drawer>
      </Document>
    );
  }
}

function mapStateToProps(state) {
  return {
    userAccounts: state.userAccountsState.list,
    isLoading: state.userAccountsState.isLoading,
    isSuccess: state.userAccountsState.isSuccess,
    isFailure: state.userAccountsState.isFailure,
    message: state.userAccountsState.message,
    isHistoryReportLoading: state.userAccountsState.isHistoryReportLoading,
    isHistoryReportSuccess: state.userAccountsState.isHistoryReportSuccess,
    isHistoryReportComplete: state.userAccountsState.isHistoryReportComplete,
    historyReportData: state.userAccountsState.historyReportData,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetAllUserAccounts: userAccountOperations.fetchGetAllUserAccounts,
    fetchAddUserAccount: userAccountOperations.fetchAddUserAccount,
    fetchEditUserAccount: userAccountOperations.fetchEditUserAccount,
    fetchDeleteUserAccount: userAccountOperations.fetchDeleteUserAccount,
    fetchGetUserAccountHistoryReport: userAccountOperations.fetchGetUserAccountHistoryReport,
    resetAfterRequest: userAccountOperations.resetAfterRequest,
  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Accounts );
