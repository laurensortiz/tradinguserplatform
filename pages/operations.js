import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Row, Col, Button, Drawer, Tabs, notification, Radio, Icon } from 'antd';
import _ from 'lodash';

import Document from '../components/Document';

import { Investment, Market } from '../components/Operation';
import { userAccountOperations } from "../state/modules/userAccounts";

const { TabPane } = Tabs;

class Operations extends Component {
  state = {
    operationType: 'market',
    isFormVisible: false,
    isAdmin: false,
    currentUser: {},
    operations: {},
    hasMarketOperations: false,
    hasInvestmentOperations: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {};

    if (!_.isEqual( nextProps.isAdmin, prevState.isAdmin )) {
      _.assignIn( updatedState, {
        isAdmin: nextProps.isAdmin
      } )
    }

    if (!_.isEqual( nextProps.operations, prevState.operations )) {
      _.assignIn( updatedState, {
        operations: nextProps.operations,
        hasMarketOperations: !_.isEmpty( nextProps.operations.marketOperations ),
        hasInvestmentOperations: !_.isEmpty( nextProps.operations.investmentOperations ),
      } )
    }

    if (!_.isEqual( nextProps.currentUser, prevState.currentUser )) {

      if (!_.isEqual( nextProps.currentUser.roleId, 1 )) {
        nextProps.fetchGetUserAccounts( nextProps.currentUser.id )
      }
      _.assignIn( updatedState, {
        currentUser: nextProps.currentUser
      } );


    }

    return !_.isEmpty( updatedState ) ? updatedState : null;
  }

  componentDidMount() {
  };

  _onSelectOperationType = ({ target }) => {
    this.setState( {
      operationType: target.value,
    } );
  };

  _handleFormDisplay = (isFormVisible) => {
    this.setState( {
      isFormVisible
    } )
  };

  render() {

    return (
      <Document id="userOperations-page">
        { this.state.isAdmin ? (
          <>
            <Row>
              <Radio.Group
                defaultValue={ this.state.operationType }
                size="large"
                style={ { float: 'left' } }
                onChange={ this._onSelectOperationType }
              >
                <Radio.Button value="market"><Icon type="sliders"/> Bolsa OTC</Radio.Button>
                <Radio.Button value="investment"> <Icon type="fund"/> Fondo de Interés</Radio.Button>
              </Radio.Group>
              <Button style={ { float: 'right' } } type="primary" onClick={ () => this._handleFormDisplay( true ) }>
                Agregar Operación
              </Button>
            </Row>
            <Row>
              <Tabs
                defaultActiveKey={ this.state.operationType }
                activeKey={ this.state.operationType }
                animated={ false }
              >
                <TabPane tab key="market">
                  <Market
                    isFormVisible={ _.isEqual( this.state.operationType, 'market' ) && this.state.isFormVisible }
                    onClose={ this._handleFormDisplay }
                    handleFormVisible={ this._handleFormDisplay }
                    isAdmin={ this.state.isAdmin }
                  />
                </TabPane>
                <TabPane tab key="investment">
                  <Investment
                    isFormVisible={ _.isEqual( this.state.operationType, 'investment' ) && this.state.isFormVisible }
                    onClose={ this._handleFormDisplay }
                    handleFormVisible={ this._handleFormDisplay }
                    isAdmin={ this.state.isAdmin }
                  />
                </TabPane>
              </Tabs>
            </Row>
          </>
        ) : (
          <div>
            { this.state.hasMarketOperations ? (
              <div>
                <Market
                  marketOperationsUser={_.get(this.state.operations, 'marketOperations', [])}
                  isFormVisible={ _.isEqual( this.state.operationType, 'market' ) && this.state.isFormVisible }
                  onClose={ this._handleFormDisplay }
                  handleFormVisible={ this._handleFormDisplay }
                  isAdmin={ this.state.isAdmin }
                />
              </div>
            ) : null }

            { this.state.hasInvestmentOperations ? (
              <div>
                <Investment
                  investmentOperationsUser={_.get(this.state.operations, 'investmentOperations', [])}
                  isFormVisible={ _.isEqual( this.state.operationType, 'investment' ) && this.state.isFormVisible }
                  onClose={ this._handleFormDisplay }
                  handleFormVisible={ this._handleFormDisplay }
                  isAdmin={ this.state.isAdmin }
                />
              </div>
            ) : null }
          </div>
        ) }


      </Document>
    );
  }
}

function mapStateToProps(state) {

  return {
    isAdmin: state.authState.isAdmin,
    operations: state.userAccountsState.list,
    currentUser: state.authState.currentUser,
    isLoading: state.investmentOperationsState.isLoading,
    isSuccess: state.investmentOperationsState.isSuccess,
    isFailure: state.investmentOperationsState.isFailure,
    message: state.investmentOperationsState.message,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetUserAccounts: userAccountOperations.fetchGetUserAccounts
  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Operations );
