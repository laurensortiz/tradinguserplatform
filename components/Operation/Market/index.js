import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Row, Col, Button, Drawer, Tabs, notification, Radio } from 'antd';
import _ from 'lodash';

import MarketTable from './MarketTable';
import AddOrEditMarketForm from './AddOrEditMarketForm';

import { userAccountOperations } from "../../../state/modules/userAccounts";

const { TabPane } = Tabs;

class Investment extends Component {
  state = {
    isVisibleAddOrEditUserAccount: false,
    actionType: 'add',
    selectedUserAccount: {},
    isCreatingOperation: false,
    operationType: 'investment',
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.isSuccess && !_.isEmpty( nextProps.message )) {
      let message = 'Cuenta de Usuario Creada',
        description = 'La Cuenta de Usuario se ha creado corrrectamente';

      if (_.isEqual( prevState.actionType, 'edit' )) {
        message = 'Cuenta de Usuario Modificado';
        description = 'La Cuenta de Usuario se ha modificado corrrectamente';
      }

      if (_.isEqual( prevState.actionType, 'delete' )) {
        message = 'Cuenta de Usuario Eliminado';
        description = 'La Cuenta de Usuario se ha eliminado corrrectamente';
      }

      if (_.isEqual( prevState.actionType, 'active' )) {
        message = 'Cuenta de Usuario Activado';
        description = 'La Cuenta de Usuario se ha activado corrrectamente';
      }

      prevState.isVisibleAddOrEditUserAccount = false;
      notification[ 'success' ]( {
        message,
        description,
        onClose: () => {

          prevState.actionType = 'add'; // default value

          nextProps.fetchGetUserAccounts();
          nextProps.resetAfterRequest();
        },
        duration: 1.5
      } );
    }
    if (nextProps.isFailure && !_.isEmpty( nextProps.message )) {
      notification[ 'error' ]( {
        message: 'Ha ocurrido un error',
        description:
          'Por favor verifique la información',
        onClose: () => {
          nextProps.resetAfterRequest();
        },
        duration: 3
      } );
    }
    return null;
  }

  componentDidMount() {
    this.props.fetchGetUserAccounts();
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
    this.props.onClose();
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

  _handleCreateOperation = (operationType) => {

  }

  render() {
    const modalTitle = _.isEqual( this.state.actionType, 'add' )
      ? 'Agregar Operación en la Bolsa'
      : 'Editar Operación en la Bolsa';


    return (
      <>
        <Row>
          <Col>
            <Tabs>
              <TabPane tab="Activos" key="1">
                <MarketTable
                  userAccounts={ _.filter( this.props.userAccounts, { status: 1 } ) }
                  isLoading={ this.props.isLoading }
                  onEdit={ this._onSelectEdit }
                  onDelete={ this._handleDeleteUserAccount }
                  onCreateOperation={ this._handleCreateOperation }
                />
              </TabPane>
              <TabPane tab="Inactivos" key="2">
                <MarketTable
                  userAccounts={ _.filter( this.props.userAccounts, { status: 0 } ) }
                  isLoading={ this.props.isLoading }
                  onActive={ this._onSelectActive }
                  status="inactive"
                />
              </TabPane>
            </Tabs>
          </Col>
        </Row>
        <Drawer
          title={ modalTitle }
          width={ 320 }
          onClose={ this._onClose }
          visible={ this.props.isFormVisible }
          destroyOnClose={ true }
        >
          <AddOrEditMarketForm
            onAddNew={ this._handleAddNewUserAccount }
            onEdit={ this._handleEditUserAccount }
            isLoading={ this.props.isLoading }
            selectedAccount={ this.state.selectedUserAccount }
            actionType={ this.state.actionType }
          />
        </Drawer>
      </>
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
    fetchGetUserAccounts: userAccountOperations.fetchGetUserAccounts,
    fetchAddUserAccount: userAccountOperations.fetchAddUserAccount,
    fetchEditUserAccount: userAccountOperations.fetchEditUserAccount,
    fetchDeleteUserAccount: userAccountOperations.fetchDeleteUserAccount,
    resetAfterRequest: userAccountOperations.resetAfterRequest,
  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Investment );
