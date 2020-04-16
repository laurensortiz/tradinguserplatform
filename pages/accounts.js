import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Row, Col, Button, Drawer, Tabs, Icon, Radio, notification } from 'antd';
import _ from 'lodash';

import Document from '../components/Document';

import UserAccountsTable from '../components/UserAccount/UserAccountsTable';
import AddOrEditUserAccountForm from '../components/UserAccount/AddOrEditUserAccountForm';

import { userAccountOperations } from "../state/modules/userAccounts";

const { TabPane } = Tabs;

class Accounts extends Component {
  state = {
    isVisibleAddOrEditUserAccount: false,
    actionType: 'add',
    selectedUserAccount: {},
    isCreatingOperation: false,
    operationType: 1,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
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
      notification.success({
        message,
        onClose: () => {
          prevState.actionType = 'add'; // default value

          nextProps.fetchGetAllUserAccounts();
          nextProps.resetAfterRequest();
        },
        duration: 1
      })

    }
    if (nextProps.isFailure && !_.isEmpty( nextProps.message )) {
      notification.error({
        message: 'Ha ocurrido un error',
        description: nextProps.message,
        onClose: () => {
          nextProps.resetAfterRequest();
        },
        duration: 3
      })

    }
    return null;
  }

  componentDidMount() {
    this.props.fetchGetAllUserAccounts();
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

  _onSelectActive = (userId) => {
    this.props.fetchEditUserAccount( {
      id: userId,
      status: 1,
    } );
    this.setState( {
      actionType: 'active'
    } );

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
      operationType: target.value,
    } );
  };

  render() {
    const modalTitle = _.isEqual( this.state.actionType, 'add' )
      ? 'Agregar Cuenta de Usuario'
      : 'Editar Cuenta de Usuario';

    const userAccount  = _.filter(this.props.userAccounts, ['account.associatedOperation', this.state.operationType]);

    return (
      <Document id="userAccounts-page">
        <Row style={{marginBottom:30}}>
          <Radio.Group
            defaultValue={ this.state.operationType }
            size="large"
            style={ { float: 'left' } }
            onChange={ this._onSelectOperationType }
            buttonStyle="solid"
          >
            <Radio.Button value={1}><Icon type="sliders"/> Standard</Radio.Button>
            <Radio.Button value={2}> <Icon type="fund"/> Profit Month</Radio.Button>
          </Radio.Group>
          <Button style={ { float: 'right' } } type="primary" onClick={ this._addUserAccount } size="large">
            <Icon type="plus-circle" /> Agregar Cuenta
          </Button>
        </Row>

        <Row>
          <Col>
            <Tabs animated={false}>
              <TabPane tab="Activos" key="1">
                <UserAccountsTable
                  userAccounts={ _.filter( userAccount, { status: 1 } ) }
                  isLoading={ this.props.isLoading }
                  onEdit={ this._onSelectEdit }
                  onDelete={ this._handleDeleteUserAccount }
                  isOperationStandard={_.isEqual(this.state.operationType, 1)}
                />
              </TabPane>
              <TabPane tab="Eliminados" key="2">
                <UserAccountsTable
                  userAccounts={ _.filter( userAccount, { status: 0 } ) }
                  isLoading={ this.props.isLoading }
                  onActive={ this._onSelectActive }
                  status="inactive"
                  isOperationStandard={_.isEqual(this.state.operationType, 1)}
                />
              </TabPane>
            </Tabs>
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
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetAllUserAccounts: userAccountOperations.fetchGetAllUserAccounts,
    fetchAddUserAccount: userAccountOperations.fetchAddUserAccount,
    fetchEditUserAccount: userAccountOperations.fetchEditUserAccount,
    fetchDeleteUserAccount: userAccountOperations.fetchDeleteUserAccount,
    resetAfterRequest: userAccountOperations.resetAfterRequest,
  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Accounts );
