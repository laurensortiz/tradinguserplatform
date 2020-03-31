import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Row, Col, Button, Radio, Icon } from 'antd';
import _ from 'lodash';

import Document from '../components/Document';

import { Investment, Market, UserAccount } from '../components/Operation';
import { userAccountOperations } from "../state/modules/userAccounts";

class Operations extends Component {
  state = {
    operationType: 'market',
    isFormVisible: false,
    isAdmin: false,
    currentUser: {
      id: null
    },
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

    if (!_.isEqual( nextProps.currentUser, prevState.currentUser )) {
      _.assignIn( updatedState, {
        currentUser: nextProps.currentUser
      } );
      
      nextProps.fetchGetUserAccounts(nextProps.currentUser.id)
    }
    if (!_.isEqual( nextProps.accounts, prevState.accounts )) {

      _.assignIn( updatedState, {
        accounts: nextProps.accounts
      } );
    }

    return !_.isEmpty( updatedState ) ? updatedState : null;
  }

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
            <Row style={{marginBottom:30}}>
              <Radio.Group
                defaultValue={ this.state.operationType }
                size="large"
                style={ { float: 'left' } }
                onChange={ this._onSelectOperationType }
                buttonStyle="solid"
              >
                <Radio.Button value="market"><Icon type="sliders"/> Bolsa OTC</Radio.Button>
                <Radio.Button value="investment"> <Icon type="fund"/> Fondo de Interés</Radio.Button>
              </Radio.Group>
              <Button style={ { float: 'right' } } type="primary" onClick={ () => this._handleFormDisplay( true ) } size="large">
                <Icon type="plus-circle" /> Agregar Operación
              </Button>
            </Row>
            <Row>
              <Col className={_.isEqual( this.state.operationType, 'market' ) ? 'show' : 'hidden'}>
                <Market
                  isFormVisible={ _.isEqual( this.state.operationType, 'market' ) && this.state.isFormVisible }
                  onClose={ this._handleFormDisplay }
                  handleFormVisible={ this._handleFormDisplay }
                  isAdmin={ true }
                />
              </Col>
              <Col className={_.isEqual( this.state.operationType, 'investment' ) ? 'show' : 'hidden'}>
                <Investment
                  isFormVisible={ _.isEqual( this.state.operationType, 'investment' ) && this.state.isFormVisible }
                  onClose={ this._handleFormDisplay }
                  handleFormVisible={ this._handleFormDisplay }
                  isAdmin={ true }
                />
              </Col>

            </Row>
          </>
        ) : (
          <div>
            <UserAccount currentUser={this.state.currentUser} />
          </div>
        ) }


      </Document>
    );
  }
}

function mapStateToProps(state) {

  return {
    isAdmin: state.authState.isAdmin,
    currentUser: state.authState.currentUser,
    accounts: state.userAccountsState.list,
    isLoading: state.investmentOperationsState.isLoading,
    isSuccess: state.investmentOperationsState.isSuccess,
    isFailure: state.investmentOperationsState.isFailure,
    message: state.investmentOperationsState.message,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGeAllUserAccounts: userAccountOperations.fetchGetUserAccounts,
    fetchGetUserAccounts: userAccountOperations.fetchGetUserAccounts
  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Operations );
