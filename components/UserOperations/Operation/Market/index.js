import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withNamespaces } from 'react-i18next';

import { Row, Col, Drawer } from 'antd';
import _ from 'lodash';

import MarketTable from './MarketTable';
import MarketMovementDetail from './detail';

import { AccountInformation, MovementsTable } from '../shared';

import { marketOperationOperations } from "../../../../state/modules/marketOperation";
import { marketMovementOperations } from "../../../../state/modules/marketMovement";


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
    isBulkSuccess: false,
    isBulkProcessCompleted: false,
    dataStatus: 1
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {};
    if (!_.isEqual( nextProps.marketOperations, prevState.marketOperations )) {

      let marketOperationUser;
      if (!nextProps.isAdmin) {
        marketOperationUser = _.filter( nextProps.marketOperations, [ 'userAccount.userId', nextProps.currentUserId ] )
      } else {
        marketOperationUser = nextProps.marketOperations
      }

      _.assignIn( updatedState, {
        marketOperations: marketOperationUser
      } );

    }

    if (!_.isEqual( nextProps.currentOperationDetail, prevState.currentOperationDetail )) {

      _.assignIn( updatedState, {
        currentOperationDetail: nextProps.currentOperationDetail
      } );

    }


    if (nextProps.isSuccessMovements && !_.isEmpty( nextProps.messageMovements ) && !_.isEmpty( prevState.marketMovements )) {
      if (!_.isNil( prevState.currentOperationDetail.id )) {
        nextProps.fetchGetMarketMovements( prevState.currentOperationDetail.id );
      }

      nextProps.fetchGetMarketOperations( 1, nextProps.userAccountId );
      nextProps.resetAfterMovementRequest();
    }

    if (!_.isEqual( nextProps.marketMovements, prevState.marketMovements )) {
      _.assignIn( updatedState, {
        marketMovements: nextProps.marketMovements
      } );

    }


    return !_.isEmpty( updatedState ) ? updatedState : null;
  }

  componentDidMount() {
    this.props.fetchGetMarketOperations( 1, this.props.userAccountId );
  };

  _handleDetailUserOperation = (operationId) => {
    this.setState( {
      isDetailViewVisible: true
    } );
    this.props.fetchGetMarketOperation( operationId );
    this.props.fetchGetMarketMovements( operationId );
  };

  _onCloseDetailView = () => {
    this.setState( {
      isDetailViewVisible: false,
      currentOperationDetail: {}
    } );
    this.props.fetchGetMarketOperations( this.state.dataStatus, this.props.userAccountId );
  };


  render() {
    const {t} = this.props;

    const currentUsername = _.get( this.state.currentOperationDetail, 'userAccount.user.username', '' );
    const currentUserFirstName = _.get( this.state.currentOperationDetail, 'userAccount.user.firstName', '' );
    const currentUserLastName = _.get( this.state.currentOperationDetail, 'userAccount.user.lastName', '' );
    const modalDetailTitle = `${ currentUsername } - ${ currentUserFirstName } ${ currentUserLastName }`;

    return (
      <>
        <Row>
          <Col>
            { this.props.isAdmin ? (
              <>
                <div>
                  <MarketTable
                    marketOperations={ this.state.marketOperations }
                    isLoading={ this.props.isLoading }
                    onEdit={ this._onSelectEdit }
                    onActive={ this._onSelectActive }
                    onDelete={ this._handleDeleteUserOperation }
                    onDetail={ this._handleDetailUserOperation }
                    isAdmin={ true }
                    onFetchBulkUpdate={ this._handleBulkUpdate }
                    isBulkLoading={ this.props.isBulkLoading }
                    isBulkSuccess={ this.props.isBulkSuccess }
                    isBulkCompleted={ this.props.isBulkProcessCompleted }
                    onTabChange={ this._onTabChange }
                    onRequestUpdateTable={ () => this.props.fetchGetMarketOperations( this.state.dataStatus, this.props.userAccountId ) }
                    dataStatus={ this.state.dataStatus }
                  />
                </div>
              </>
            ) : (
              <>
                { !_.isEmpty( this.state.marketOperations ) ? (
                  <Row>
                    <Col sm={ 12 }>
                      <h2>{t('title marketOperations')}</h2>
                    </Col>
                  </Row>
                ) : null }
                <MarketTable
                  marketOperations={ this.state.marketOperations }
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
          title={ modalDetailTitle }
          width="85%"
          onClose={ this._onCloseDetailView }
          visible={ this.state.isDetailViewVisible }
          destroyOnClose={ true }

        >
          <AccountInformation
            currentOperation={ this.state.currentOperationDetail }
          />

          <MarketMovementDetail
            currentOperation={ this.state.currentOperationDetail }
          />

          <MovementsTable
            movements={ this.state.marketMovements }
            onAdd={ this._handleAddMovement }
            onEdit={ this._handleEditMovement }
            onDelete={ this._handleDeleteMovement }
            currentOperation={ this.state.currentOperationDetail }
            isAdmin={ this.props.isAdmin }
            isLoading={ this.props.isLoading }
            isMarketMovement={ true }
          />
        </Drawer>
      </>
    );
  }
}

function mapStateToProps(state) {

  return {
    marketOperations: state.marketOperationsState.list,
    currentOperationDetail: state.marketOperationsState.item,
    isLoading: state.marketOperationsState.isLoading,
    isSuccess: state.marketOperationsState.isSuccess,
    isFailure: state.marketOperationsState.isFailure,

    isBulkLoading: state.marketOperationsState.isBulkLoading,
    isBulkSuccess: state.marketOperationsState.isBulkSuccess,
    isBulkFailure: state.marketOperationsState.isBulkFailure,
    isBulkProcessCompleted: state.marketOperationsState.isBulkProcessCompleted,

    message: state.marketOperationsState.message,

    marketMovements: state.marketMovementsState.list,
    isSuccessMovements: state.marketMovementsState.isSuccess,
    messageMovements: state.marketMovementsState.message,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetMarketOperations: marketOperationOperations.fetchGetMarketOperations,
    fetchGetMarketOperation: marketOperationOperations.fetchGetMarketOperation,
    fetchAddMarketOperation: marketOperationOperations.fetchAddMarketOperation,
    fetchEditMarketOperation: marketOperationOperations.fetchEditMarketOperation,
    fetchDeleteMarketOperation: marketOperationOperations.fetchDeleteMarketOperation,
    fetchBulkUpdateMarketOperation: marketOperationOperations.fetchBulkUpdateMarketOperation,
    resetAfterRequest: marketOperationOperations.resetAfterRequest,

    fetchGetMarketMovements: marketMovementOperations.fetchGetMarketMovements,
    fetchAddMarketMovement: marketMovementOperations.fetchAddMarketMovement,
    fetchEditMarketMovement: marketMovementOperations.fetchEditMarketMovement,
    fetchDeleteMarketMovement: marketMovementOperations.fetchDeleteMarketMovement,
    resetAfterMovementRequest: marketMovementOperations.resetAfterRequest,
  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( withNamespaces()(Market) );
