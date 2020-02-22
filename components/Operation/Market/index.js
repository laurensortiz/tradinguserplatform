import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Row, Col, Button, Drawer, Tabs, notification, Radio } from 'antd';
import _ from 'lodash';

import MarketTable from './MarketTable';
import AddOrEditMarketForm from './AddOrEditMarketForm';
import MarketMovementDetail from './detail';
import MovementsTable from './movementsTable';

import { marketOperationOperations } from "../../../state/modules/marketOperation";
import { marketMovementOperations } from "../../../state/modules/marketMovement";
import { GetGP } from "../../../common/utils";

const { TabPane } = Tabs;

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
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {};
    if (!_.isEqual( nextProps.marketOperations, prevState.marketOperations )) {
      _.assignIn( updatedState, {
        marketOperations: nextProps.marketOperations
      } )

      if (prevState.isDetailViewVisible) {

        _.assignIn( updatedState, {
          currentOperationDetail: _.find( nextProps.marketOperations, { id: prevState.currentOperationDetail.id } )
        } )

      }
    }


    if (nextProps.isSuccessMovements && !_.isEmpty( nextProps.messageMovements ) && !_.isEmpty(prevState.marketMovements)) {
      nextProps.fetchGetMarketMovements( prevState.currentOperationDetail.id );
      nextProps.fetchGetMarketOperations();
      nextProps.resetAfterMovementRequest();
    }

    if (!_.isEqual( nextProps.marketMovements, prevState.marketMovements )) {
      _.assignIn( updatedState, {
        marketMovements: nextProps.marketMovements
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
      notification[ 'success' ]( {
        message,
        description,
        onClose: () => {

          prevState.actionType = 'add'; // default value

          nextProps.fetchGetMarketOperations();
          nextProps.resetAfterRequest();
          nextProps.onClose(false)
        },
        duration: .5
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
        duration: 2
      } )
    }

    return !_.isEmpty( updatedState ) ? updatedState : null;
  }

  componentDidMount() {
    this.props.fetchGetMarketOperations();
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
    this.props.onClose(false);
  };

  _handleAddNewUserOperation = (userOperation) => {
    this.props.fetchAddMarketOperation( userOperation )
  };

  _handleEditUserOperation = (userAccount) => {
    this.props.fetchEditMarketOperation( userAccount )
  };

  _handleDeleteUserOperation = (operationId) => {
    this.setState( {
      actionType: 'delete'
    } );
    this.props.fetchDeleteMarketOperation( operationId );
  };

  _onSelectEdit = (operationId) => {
    this.setState( {
      actionType: 'edit'
    } );
    this._handleSelectEditUserOperation( operationId )
  };

  _onSelectActive = (userId) => {
    this.props.fetchEditMarketOperation( {
      id: userId,
      status: 1,
    } );
    this.setState( {
      actionType: 'active'
    } );

  };

  _handleSelectEditUserOperation = (operationId) => {
    const selectedOperation = _.find( this.props.marketOperations, { id: operationId } );
    this.setState( {
      selectedOperation,
      isVisibleAddOrEditOperation: true,
    } )
    this.props.handleFormVisible(true);
  };

  _handleDetailUserOperation = (operationId) => {

    const selectedOperation = _.find( this.props.marketOperations, { id: operationId } );

    this.setState( {
      isDetailViewVisible: true,
      currentOperationDetail: selectedOperation
    } );
    this.props.fetchGetMarketMovements( operationId );
  };

  _onCloseDetailView = () => {
    this.setState( {
      isDetailViewVisible: false,
      currentOperationDetail: {}
    } );
    this.props.fetchGetMarketOperations();
  };

  /**
   * Add Movements
   */
  _handleAddMovement = (newMovement) => {
    const { id, amount, userAccount: { account: { percentage } } } = this.state.currentOperationDetail;
    const { gpInversion, gpAmount } = newMovement
    this.props.fetchAddMarketMovement( {
      marketOperationId: id,
      gpInversion,
      gpAmount,
    } )
  };

  render() {
    const modalTitle = _.isEqual( this.state.actionType, 'add' )
      ? 'Agregar Operación de Bolsa'
      : 'Editar Operación de Bolsa';

    return (
      <>
        <Row>
          <Col>
            <Tabs>
              <TabPane tab="Activos" key="1">
                <MarketTable
                  marketOperations={ _.filter( this.props.marketOperations, ({ status }) => !_.isEqual( status, 0 ) ) }
                  isLoading={ this.props.isLoading }
                  onEdit={ this._onSelectEdit }
                  onDelete={ this._handleDeleteUserOperation }
                  onDetail={ this._handleDetailUserOperation }
                />
              </TabPane>
              <TabPane tab="Eliminados" key="2">
                <MarketTable
                  marketOperations={ _.filter( this.props.marketOperations, { status: 0 } ) }
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
          width={340}

          onClose={ this._onClose }
          visible={ this.props.isFormVisible }
          destroyOnClose={ true }
        >
          <AddOrEditMarketForm
            onAddNew={ this._handleAddNewUserOperation }
            onEdit={ this._handleEditUserOperation }
            isLoading={ this.props.isLoading }
            selectedOperation={ this.state.selectedOperation }
            actionType={ this.state.actionType }
          />
        </Drawer>

        <Drawer
          title="Detalle"
          width="70%"
          onClose={ this._onCloseDetailView }
          visible={ this.state.isDetailViewVisible }
          destroyOnClose={ true }

        >
          <MarketMovementDetail
            currentOperation={ this.state.currentOperationDetail }
          />
          <MovementsTable
            movements={ this.state.marketMovements }
            onAdd={ this._handleAddMovement }
            currentOperation={ this.state.currentOperationDetail }
          />
        </Drawer>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    marketOperations: state.marketOperationsState.list,
    isLoading: state.marketOperationsState.isLoading,
    isSuccess: state.marketOperationsState.isSuccess,
    isFailure: state.marketOperationsState.isFailure,
    message: state.marketOperationsState.message,

    marketMovements: state.marketMovementsState.list,
    isSuccessMovements: state.marketMovementsState.isSuccess,
    messageMovements: state.marketMovementsState.message,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetMarketOperations: marketOperationOperations.fetchGetMarketOperations,
    fetchAddMarketOperation: marketOperationOperations.fetchAddMarketOperation,
    fetchEditMarketOperation: marketOperationOperations.fetchEditMarketOperation,
    fetchDeleteMarketOperation: marketOperationOperations.fetchDeleteMarketOperation,
    resetAfterRequest: marketOperationOperations.resetAfterRequest,

    fetchGetMarketMovements: marketMovementOperations.fetchGetMarketMovements,
    fetchAddMarketMovement: marketMovementOperations.fetchAddMarketMovement,
    fetchEditMarketMovement: marketMovementOperations.fetchEditMarketMovement,
    fetchDeleteMarketMovement: marketMovementOperations.fetchDeleteMarketMovement,
    resetAfterMovementRequest: marketMovementOperations.resetAfterRequest,
  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Market );
