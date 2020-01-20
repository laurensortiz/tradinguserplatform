import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Row, Col, Button, Drawer, Tabs, notification, Radio } from 'antd';
import _ from 'lodash';

import InvestmentTable from './InvestmentTable';
import AddOrEditInvestmentForm from './AddOrEditInvestmentForm';

import { investmentOperationOperations } from "../../../state/modules/investmentOperation";
import { fetchAddInvestmentOperation } from "../../../state/modules/investmentOperation/actions";

const { TabPane } = Tabs;

class Investment extends Component {
  state = {
    isVisibleAddOrEditUserAccount: false,
    actionType: 'add',
    selectedOperation: {},
    isCreatingOperation: false,
    operationType: 'investment',
    investmentOperations: [],
    userAccounts: [],
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {};
    if (!_.isEqual(nextProps.investmentOperations, prevState.investmentOperations)) {
      _.assignIn(updatedState, {
        investmentOperations: nextProps.investmentOperations
      })
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

      prevState.isVisibleAddOrEditUserAccount = false;
      notification[ 'success' ]( {
        message,
        description,
        onClose: () => {

          prevState.actionType = 'add'; // default value

          nextProps.fetchGetInvestmentOperations();
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
    return !_.isEmpty(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    this.props.fetchGetInvestmentOperations();
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
      selectedOperation: {}
    } )
    this.props.onClose();
  };

  _handleAddNewUserOperation = (userOperation) => {
    this.props.fetchAddInvestmentOperation( userOperation )
  };

  _handleEditUserOperation = (userAccount) => {
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
    const selectedOperation = _.find( this.props.investmentOperations, { id: userId } );
    this.setState( {
      selectedOperation,
      isVisibleAddOrEditUserAccount: true,
    } )
  };

  render() {
    const modalTitle = _.isEqual( this.state.actionType, 'add' )
      ? 'Agregar Operación de Inversión'
      : 'Editar Operación de Inversión';

    return (
      <>
        <Row>
          <Col>
            <Tabs>
              <TabPane tab="Activos" key="1">
                <InvestmentTable
                  investmentOperations={ _.filter( this.props.investmentOperations, { status: 1 } ) }
                  isLoading={ this.props.isLoading }
                  onEdit={ this._onSelectEdit }
                  onDelete={ this._handleDeleteUserAccount }
                />
              </TabPane>
              <TabPane tab="Inactivos" key="2">
                <InvestmentTable
                  investmentOperations={ _.filter( this.props.investmentOperations, { status: 0 } ) }
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
          <AddOrEditInvestmentForm
            onAddNew={ this._handleAddNewUserOperation }
            onEdit={ this._handleEditUserOperation }
            isLoading={ this.props.isLoading }
            selectedOperation={ this.state.selectedOperation }
            actionType={ this.state.actionType }
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
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetInvestmentOperations: investmentOperationOperations.fetchGetInvestmentOperations,
    fetchAddInvestmentOperation: investmentOperationOperations.fetchAddInvestmentOperation,
    fetchEditInvestmentOperation: investmentOperationOperations.fetchEditInvestmentOperation,
    resetAfterRequest: investmentOperationOperations.resetAfterRequest,
  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Investment );
