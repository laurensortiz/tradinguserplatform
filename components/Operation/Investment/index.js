import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Row, Col, Button, Drawer, Tabs, notification, Radio, message as antMessage } from 'antd';
import _ from 'lodash';

import InvestmentTable from './InvestmentTable';
import AddOrEditInvestmentForm from './AddOrEditInvestmentForm';
import OperationMovementDetail from './detail';

import { AccountInformation, MovementsTable } from '../shared';

import { investmentOperationOperations } from "../../../state/modules/investmentOperation";
import { investmentMovementOperations } from "../../../state/modules/investmentMovement";
import { GetGP } from "../../../common/utils";

const { TabPane } = Tabs;

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
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {};
    if (!_.isEqual( nextProps.investmentOperations, prevState.investmentOperations )) {
      let investmentOperationsUser;

      if (!nextProps.isAdmin) {
        investmentOperationsUser = _.filter( nextProps.investmentOperations, [ 'userAccount.userId', nextProps.currentUserId ] )
      } else {
        investmentOperationsUser = nextProps.investmentOperations
      }

      _.assignIn( updatedState, {
        investmentOperations: investmentOperationsUser
      } );

      if (prevState.isDetailViewVisible) {
        _.assignIn( updatedState, {
          currentOperationDetail: _.find( nextProps.investmentOperations, { id: prevState.currentOperationDetail.id } )
        } )

      }
    }


    if (nextProps.isSuccessMovements && !_.isEmpty( nextProps.messageMovements ) && !_.isEmpty( prevState.investmentMovements )) {
      nextProps.fetchGetInvestmentMovements( prevState.currentOperationDetail.id );
      nextProps.fetchGetInvestmentOperations();
      nextProps.resetAfterMovementRequest();
    }

    if (!_.isEqual( nextProps.investmentMovements, prevState.investmentMovements )) {
      _.assignIn( updatedState, {
        investmentMovements: nextProps.investmentMovements
      } );

    }


    if (nextProps.isSuccess && !_.isEmpty( nextProps.message )) {
      let message = 'Operación de Inversión Creada',
        description = 'La Operación de Inversión se ha creado corrrectamente';

      if (_.isEqual( prevState.actionType, 'edit' )) {
        message = 'Operación de Inversión Modificado';
        description = 'La Operación de Inversión se ha modificado corrrectamente';
      }

      if (_.isEqual( prevState.actionType, 'delete' )) {
        message = 'Operación de Inversión Eliminado';
        description = 'La Operación de Inversión se ha eliminado corrrectamente';
      }

      if (_.isEqual( prevState.actionType, 'active' )) {
        message = 'Operación de Inversión Activado';
        description = 'La Operación de Inversión se ha activado corrrectamente';
      }

      prevState.isVisibleAddOrEditOperation = false;

      antMessage.success( message, 1.5, () => {
        prevState.actionType = 'add'; // default value

        nextProps.fetchGetInvestmentOperations();
        nextProps.resetAfterRequest();
        nextProps.onClose( false )
      } );

    }
    if (nextProps.isFailure && !_.isEmpty( nextProps.message )) {
      antMessage.error( 'Ha ocurrido un error', 1.5, () => {
        nextProps.resetAfterRequest();
      } );


    }

    return !_.isEmpty( updatedState ) ? updatedState : null;
  }

  componentDidMount() {
    this.props.fetchGetInvestmentOperations();

  };

  _addOperation = () => {
    this.setState( {
      actionType: 'add',
      isVisibleAddOrEditOperation: true
    } )
  };

  _onClose = () => {
    this.setState( {
      isVisibleAddOrEditOperation: false,
      selectedOperation: {},
      actionType: 'add'
    } )
    this.props.onClose( false );
  };

  _handleAddNewUserOperation = (userOperation) => {
    this.props.fetchAddInvestmentOperation( userOperation )
  };

  _handleEditUserOperation = (userAccount) => {
    this.props.fetchEditInvestmentOperation( userAccount )
  };

  _handleDeleteUserOperation = (operationId) => {
    this.setState( {
      actionType: 'delete'
    } );
    this.props.fetchDeleteInvestmentOperation( operationId );
  };

  _onSelectEdit = (operationId) => {
    this.setState( {
      actionType: 'edit'
    } );
    this._handleSelectEditUserOperation( operationId )
  };

  _onSelectActive = (userId) => {
    this.props.fetchEditInvestmentOperation( {
      id: userId,
      status: 1,
    } );
    this.setState( {
      actionType: 'active'
    } );

  };

  _handleSelectEditUserOperation = (operationId) => {
    const selectedOperation = _.find( this.props.investmentOperations, { id: operationId } );
    this.setState( {
      selectedOperation,
      isVisibleAddOrEditOperation: true,
    } )
    this.props.handleFormVisible( true );
  };

  _handleDetailUserOperation = (operationId) => {
    const selectedOperation = _.find( this.props.investmentOperations, { id: operationId } );

    this.setState( {
      isDetailViewVisible: true,
      currentOperationDetail: selectedOperation
    } );
    this.props.fetchGetInvestmentMovements( operationId );
  };

  _onCloseDetailView = () => {
    this.setState( {
      isDetailViewVisible: false,
      currentOperationDetail: {}
    } );
    this.props.fetchGetInvestmentOperations();
  };

  /**
   * Add Movements
   */
  _handleAddMovement = (newMovement) => {
    const { id, amount, userAccount: { account: { percentage } } } = this.state.currentOperationDetail;
    const { gpInversion, gpAmount, createdAt } = newMovement;
    this.props.fetchAddInvestmentMovement( {
      investmentOperationId: id,
      gpInversion,
      gpAmount,
      createdAt,
    } )
  };

  render() {
    const modalTitle = _.isEqual( this.state.actionType, 'add' )
      ? 'Agregar Operación de Inversión'
      : 'Editar Operación de Inversión';

    const currentUsername = _.get( this.state.currentOperationDetail, 'userAccount.user.username', '' );
    const currentUserFirstName = _.get( this.state.currentOperationDetail, 'userAccount.user.firstName', '' );
    const currentUserLastName = _.get( this.state.currentOperationDetail, 'userAccount.user.lastName', '' );
    const modalDetailTitle = `${ currentUsername } - ${ currentUserFirstName } ${ currentUserLastName }`;

    const activeInvestmentOperations = _.filter( this.state.investmentOperations, ({ status }) => !_.isEqual( status, 0 ) );
    const deletedInvestmentOperations = _.filter( this.state.investmentOperations, { status: 0 } );
    return (
      <>
        <Row>
          <Col>
            { this.props.isAdmin ? (
              <Tabs>
                <TabPane tab="Activos" key="1">
                  <InvestmentTable
                    investmentOperations={ activeInvestmentOperations }
                    isLoading={ this.props.isLoading }
                    onEdit={ this._onSelectEdit }
                    onDelete={ this._handleDeleteUserOperation }
                    onDetail={ this._handleDetailUserOperation }
                    isAdmin={ true }
                  />
                </TabPane>
                <TabPane tab="Eliminados" key="2">
                  <InvestmentTable
                    investmentOperations={ deletedInvestmentOperations }
                    isLoading={ this.props.isLoading }
                    onActive={ this._onSelectActive }
                    status="inactive"
                    isAdmin={ true }
                  />
                </TabPane>
              </Tabs>
            ) : (
              <>
                { !_.isEmpty( activeInvestmentOperations ) ? <h2>Operciones Fondo de Interés</h2> : null }
                <InvestmentTable
                  investmentOperations={ _.filter( this.state.investmentOperations, ({ status }) => !_.isEqual( status, 0 ) ) }
                  isLoading={ this.props.isLoading }
                  onEdit={ this._onSelectEdit }
                  onDelete={ this._handleDeleteUserOperation }
                  onDetail={ this._handleDetailUserOperation }
                  isAdmin={ false }
                />
              </>

            ) }

          </Col>
        </Row>
        <Drawer
          title={ modalTitle }
          width={ 340 }
          onClose={ this._onClose }
          visible={ this.props.isFormVisible }
          destroyOnClose={ true }
        >
          <AddOrEditInvestmentForm
            onAddNew={ this._handleAddNewUserOperation }
            onEdit={ this._handleEditUserOperation }
            isLoading={ this.props.isLoading }
            selectedOperation={ this.state.selectedOperation }
            actionType={ this.state.actionType }
          />
        </Drawer>

        <Drawer
          title={ modalDetailTitle }
          width="85%"
          onClose={ this._onCloseDetailView }
          visible={ this.state.isDetailViewVisible }
          destroyOnClose={ true }

        >
          <AccountInformation
            currentOperation={ this.state.currentOperationDetail }
          />
          <OperationMovementDetail
            currentOperation={ this.state.currentOperationDetail }
          />
          <MovementsTable
            movements={ this.state.investmentMovements }
            onAdd={ this._handleAddMovement }
            currentOperation={ this.state.currentOperationDetail }
            isAdmin={ this.props.isAdmin }
          />
        </Drawer>
      </>
    );
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

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetInvestmentOperations: investmentOperationOperations.fetchGetInvestmentOperations,
    fetchAddInvestmentOperation: investmentOperationOperations.fetchAddInvestmentOperation,
    fetchEditInvestmentOperation: investmentOperationOperations.fetchEditInvestmentOperation,
    fetchDeleteInvestmentOperation: investmentOperationOperations.fetchDeleteInvestmentOperation,
    resetAfterRequest: investmentOperationOperations.resetAfterRequest,

    fetchGetInvestmentMovements: investmentMovementOperations.fetchGetInvestmentMovements,
    fetchAddInvestmentMovement: investmentMovementOperations.fetchAddInvestmentMovement,
    fetchEditInvestmentMovement: investmentMovementOperations.fetchEditInvestmentMovement,
    fetchDeleteInvestmentMovement: investmentMovementOperations.fetchDeleteInvestmentMovement,
    resetAfterMovementRequest: investmentMovementOperations.resetAfterRequest,
  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Investment );
