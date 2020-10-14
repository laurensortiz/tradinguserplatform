import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Row, Col, Button, Drawer, Tabs, notification, Icon, Radio } from 'antd';
import _ from 'lodash';

import Document from '../components/Document';

import UsersTable from '../components/User/UsersTable';
import AddOrEditUserForm from '../components/User/AddOrEditUserForm';
import Detail from '../components/User/Detail';

import { userOperations } from "../state/modules/users";

const { TabPane } = Tabs;

class Users extends Component {
  state = {
    isVisibleAddOrEditUser: false,
    isVisibleUserDetail: false,
    actionType: 'add',
    selectedUser: {},
    currentUser: {},
    status: 1,
    roleId: 2,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.isSuccess && !_.isEmpty( nextProps.message )) {
      let message = 'Usuario Creado';

      if (_.isEqual( prevState.actionType, 'edit' )) {
        message = 'Usuario Modificado';
      }

      if (_.isEqual( prevState.actionType, 'delete' )) {
        message = 'Usuario Eliminado';
      }

      if (_.isEqual( prevState.actionType, 'active' )) {
        message = 'Usuario Activado';
      }

      prevState.isVisibleAddOrEditUser = false;

      notification.success( {
        message,
        onClose: () => {
          prevState.actionType = 'add'; // default value

          nextProps.fetchGetUsers();
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
      !_.isEqual( prevState.roleId, this.state.roleId )) {
      this.props.fetchGetUsers( {
        roleId: this.state.roleId,
        status: this.state.status
      } );
    }
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
    this._handleTableOnChange();
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

  _onSelectActive = (userId) => {
    this.props.fetchEditUser( {
      id: userId,
      status: 1,
    } );
    this.setState( {
      actionType: 'active'
    } );

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

  _handleSelectEditUser = (userId) => {
    const selectedUser = _.find( this.props.users, { id: userId } );
    this.setState( {
      selectedUser,
      isVisibleAddOrEditUser: true,
    } )
  };

  _onCloseUserDetail = () => {
    this._handleTableOnChange();
    this.setState( {
      isVisibleUserDetail: false,
      currentUser: {}
    } )
  };

  _setCurrentUser = (user) => {
    this.setState( {
      isVisibleUserDetail: true,
      currentUser: user,
    } )
  };

  _handleSelectUserType = ({ target }) => {
    this.setState( {
      roleId: target.value
    } )
  };

  _handleTabChange = ({ target }) => {
    this.setState( {
      status: target.value
    } )
  }

  _handleTableOnChange = () => {
    this.props.fetchGetUsers();
  }

  render() {
    const modalTitle = _.isEqual( this.state.actionType, 'add' )
      ? 'Agregar Usuario'
      : 'Editar Usuario';
    return (
      <Document id="users-page">
        <Row style={ { marginBottom: 30 } }>
          <Radio.Group onChange={ this._handleSelectUserType } defaultValue={ 2 } buttonStyle="solid" size="large">
            <Radio.Button value={ 2 }><Icon type="user"/> Clientes</Radio.Button>
            <Radio.Button value={ 1 }><Icon type="crown"/> Administradores</Radio.Button>
          </Radio.Group>
          <Button style={ { float: 'right' } } type="primary" onClick={ this._addUser } size="large">
            <Icon type="user-add"/> Agregar Usuario
          </Button>
        </Row>
        <Row>
          <Col>
            <UsersTable
              users={ this.props.users }
              isLoading={ this.props.isLoading }
              onActive={this._onSelectActive}
              onEdit={ this._onSelectEdit }
              onDelete={ this._handleDeleteUser }
              onDetail={ this._setCurrentUser }
              onTabChange={ this._handleTabChange }
              dataStatus={ this.state.status  }
              onRequestUpdateTable={ this._handleTableOnChange }
            />
          </Col>
        </Row>
        <Drawer
          title={ modalTitle }
          width="40%"
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
          width="40%"
          onClose={ this._onCloseUserDetail }
          visible={ this.state.isVisibleUserDetail }
          destroyOnClose={ true }
        >
          <Detail
            currentUser={ this.state.currentUser }
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
