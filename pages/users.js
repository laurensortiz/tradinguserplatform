import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Row, Col, Button, Drawer, Tabs, notification, message as antMessage, Icon } from 'antd';
import _ from 'lodash';

import Document from '../components/Document';

import UsersTable from '../components/User/UsersTable';
import AddOrEditUserForm from '../components/User/AddOrEditUserForm';
import Detail from '../components/User/Detail';

import { userOperations } from "../state/modules/users";
import AddOrEditUserAccountForm from "../components/UserAccount/AddOrEditUserAccountForm";

const { TabPane } = Tabs;

class Users extends Component {
  state = {
    isVisibleAddOrEditUser: false,
    isVisibleUserDetail: false,
    actionType: 'add',
    selectedUser: {},
    currentUser: {},
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.isSuccess && !_.isEmpty( nextProps.message )) {
      let message = 'Usuario Creado',
        description = 'El Usuario se ha creado corrrectamente';

      if (_.isEqual( prevState.actionType, 'edit' )) {
        message = 'Usuario Modificado';
        description = 'El Usuario se ha modificado corrrectamente';
      }

      if (_.isEqual( prevState.actionType, 'delete' )) {
        message = 'Usuario Eliminado';
        description = 'El Usuario se ha eliminado corrrectamente';
      }

      if (_.isEqual( prevState.actionType, 'active' )) {
        message = 'Usuario Activado';
        description = 'El Usuario se ha activado corrrectamente';
      }

      prevState.isVisibleAddOrEditUser = false;

      antMessage.success(message, 1.5, () => {
        prevState.actionType = 'add'; // default value

        nextProps.fetchGetUsers();
        nextProps.resetAfterRequest();
      });

    }
    if (nextProps.isFailure && !_.isEmpty( nextProps.message )) {

      antMessage.error('Ha ocurrido un error', 1.5, () => {
        nextProps.resetAfterRequest();
      });

    }
    return null;
  }

  componentDidMount() {
    this.props.fetchGetUsers();
  };

  _addUser = () => {
    this.setState( {
      actionType: 'add',
      isVisibleAddOrEditUser: true
    } )
  };

  _onClose = () => {
    this.setState( {
      isVisibleAddOrEditUser: false,
      selectedUser: {}
    } )
  };

  _handleAddNewUser = (user) => {
    this.props.fetchAddUser( user )
  };

  _handleEditUser = (user) => {
    this.props.fetchEditUser( user )
  };

  _handleDeleteUser = (userId) => {
    this.setState( {
      actionType: 'delete'
    } );
    this.props.fetchDeleteUser( userId );
  };

  _onSelectEdit = (userId) => {
    this.setState( {
      actionType: 'edit'
    } );
    this._handleSelectEditUser( userId )
  };

  _onSelectActive = (userId) => {
    this.props.fetchEditUser( {
      id: userId,
      status: 1,
    } );
    this.setState( {
      actionType: 'active'
    } );

  };

  _handleSelectEditUser = (userId) => {
    const selectedUser = _.find( this.props.users, { id: userId } );
    this.setState( {
      selectedUser,
      isVisibleAddOrEditUser: true,
    } )
  };

  _onCloseUserDetail = () => {
    this.setState({
      isVisibleUserDetail: false,
      currentUser: {}
    })
  };

  _setCurrentUser = (user) => {
    this.setState({
      isVisibleUserDetail: true,
      currentUser: user,
    })
  };

  render() {
    const modalTitle = _.isEqual( this.state.actionType, 'add' )
      ? 'Agregar Usuario'
      : 'Editar Usuario';
    return (
      <Document id="users-page">
        <Row>
          <Button style={ { float: 'right' } } type="primary" onClick={ this._addUser } size="large">
            <Icon type="user-add" /> Agregar Usuario
          </Button>
        </Row>
        <Row>
          <Col>
            <Tabs>
              <TabPane tab="Activos" key="1">
                <UsersTable
                  users={ _.filter( this.props.users, { status: 1 } ) }
                  isLoading={ this.props.isLoading }
                  onEdit={ this._onSelectEdit }
                  onDelete={ this._handleDeleteUser }
                  onDetail={ this._setCurrentUser }
                />
              </TabPane>
              <TabPane tab="Eliminados" key="2">
                <UsersTable
                  users={ _.filter( this.props.users, { status: 0 } ) }
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
          visible={ this.state.isVisibleAddOrEditUser }
          destroyOnClose={ true }
        >
          <AddOrEditUserForm
            onAddNew={ this._handleAddNewUser }
            onEdit={ this._handleEditUser }
            isLoading={ this.props.isLoading }
            selectedProject={ this.state.selectedUser }
            actionType={ this.state.actionType }
          />
        </Drawer>
        <Drawer
          title="Detalle de Usuario"
          width={320}
          onClose={ this._onCloseUserDetail }
          visible={ this.state.isVisibleUserDetail }
          destroyOnClose={ true }
        >
          <Detail
            currentUser={this.state.currentUser}
          />
        </Drawer>
      </Document>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: state.usersState.list,
    isLoading: state.usersState.isLoading,
    isSuccess: state.usersState.isSuccess,
    isFailure: state.usersState.isFailure,
    message: state.usersState.message,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetUsers: userOperations.fetchGetUsers,
    fetchAddUser: userOperations.fetchAddUser,
    fetchEditUser: userOperations.fetchEditUser,
    fetchDeleteUser: userOperations.fetchDeleteUser,
    resetAfterRequest: userOperations.resetAfterRequest,
  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Users );
