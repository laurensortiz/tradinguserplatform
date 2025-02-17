import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Row, Col, Drawer, Tabs, notification, Radio } from 'antd';
import _ from 'lodash';

import InvestmentTable from './InvestmentTable';
import AddOrEditInvestmentForm from './AddOrEditInvestmentForm';
import OperationMovementDetail from './detail';

import { AccountInformation, MovementsTable } from '../shared';

import { investmentOperationOperations } from "../../../state/modules/investmentOperation";
import { investmentMovementOperations } from "../../../state/modules/investmentMovement";
import { FormatDate, GetGP } from "../../../common/utils";
import MarketTable from "../Market/MarketTable";
import moment from "moment";

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
      let message = 'Operación de Inversión Creada';

      if (_.isEqual( prevState.actionType, 'edit' )) {
        message = 'Operación de Inversión Modificado';
      }

      if (_.isEqual( prevState.actionType, 'delete' )) {
        message = 'Operación de Inversión Eliminado';
      }

      if (_.isEqual( prevState.actionType, 'active' )) {
        message = 'Operación de Inversión Activado';
      }

      prevState.isVisibleAddOrEditOperation = false;

      notification.success({
        message,
        onClose: () => {
          prevState.actionType = 'add'; // default value

          nextProps.fetchGetInvestmentOperations();
          nextProps.resetAfterRequest();
          nextProps.onClose( false )
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
    } );
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
    } );
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
    const { id : investmentOperationId } = this.state.currentOperationDetail;
    const { gpInversion, gpAmount, createdAt } = newMovement;
    this.props.fetchAddInvestmentMovement( {
      ...newMovement,
      investmentOperationId,
      gpInversion: parseFloat(gpInversion).toFixed(2),
      gpAmount: parseFloat(gpAmount).toFixed(2),
      createdAt,
    } )
  };

  /**
   * Edit Movements
   */
  _handleEditMovement = (newMovement) => {
    const { gpInversion, gpAmount, createdAt, id } = newMovement;
    this.props.fetchEditInvestmentMovement( {
      id,
      gpInversion: parseFloat(gpInversion).toFixed(2),
      gpAmount: parseFloat(gpAmount).toFixed(2),
      createdAt: moment.parseZone(createdAt),
    } )
  };

  /**
   * Delete Movements
   */
  _handleDeleteMovement = (movementId) => {
    this.props.fetchDeleteInvestmentMovement( movementId)
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
              <Tabs animated={false}>
                <TabPane tab="Activos" key="1">
                  <InvestmentTable
                    investmentOperations={ activeInvestmentOperations }
                    onRequestUpdateTable={ this.props.fetchGetInvestmentOperations }
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
                { !_.isEmpty( activeInvestmentOperations ) ? <h2>Operaciones Fondo de Interés</h2> : null }
                <InvestmentTable
                  investmentOperations={ activeInvestmentOperations  }
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
            onEdit={ this._handleEditMovement }
            onDelete={ this._handleDeleteMovement }
            currentOperation={ this.state.currentOperationDetail }
            isAdmin={ this.props.isAdmin }
            isLoading={this.props.isLoading}
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
