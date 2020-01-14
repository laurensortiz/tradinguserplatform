import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Row, Col, Button, Drawer, Tabs, notification, Radio } from 'antd';
import _ from 'lodash';

import Document from '../components/Document';

import { userAccountOperations } from "../state/modules/userAccounts";
import { Investment, Market } from '../components/Operation';

const { TabPane } = Tabs;

class Accounts extends Component {
  state = {
    operationType: 'investment',
    isFormVisible: false,
    userAccounts: [],
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {};

    if (!_.isEqual(nextProps.userAccounts, prevState.userAccounts)) {
      _.assignIn(updatedState, {
        userAccounts: nextProps.userAccounts
      })
    }

    return !_.isEmpty(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    this.props.fetchGetUserAccounts();
  };

  _onSelectOperationType = ({target}) => {
    this.setState({
      operationType: target.value,
    });
  };

  _handleFormDisplay = () => {
    this.setState({
      isFormVisible: !this.state.isFormVisible
    })
  };

  render() {
    return (
      <Document id="userOperations-page">
        <Row>
          <Radio.Group
            defaultValue="investment"
            size="large"
            style={ { float: 'left' } }
            onChange={this._onSelectOperationType}
          >
            <Radio.Button value="market">Bolsa</Radio.Button>
            <Radio.Button value="investment">Inversión</Radio.Button>
          </Radio.Group>
          <Button style={ { float: 'right' } } type="primary" onClick={ this._handleFormDisplay }>
            Agregar Operación
          </Button>
        </Row>
        <Row>
          <Tabs
            defaultActiveKey={this.state.operationType}
            activeKey={this.state.operationType}
            animated={false}
          >
            <TabPane tab key="market">
              <Market
                isFormVisible={_.isEqual(this.state.operationType, 'market') && this.state.isFormVisible}
                onClose={this._handleFormDisplay}
                userAccounts={this.state.userAccounts}
              />
            </TabPane>
            <TabPane tab key="investment">
              <Investment
                isFormVisible={_.isEqual(this.state.operationType, 'investment') && this.state.isFormVisible}
                onClose={this._handleFormDisplay}
                userAccounts={this.state.userAccounts}
              />
            </TabPane>
          </Tabs>
        </Row>

      </Document>
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
  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Accounts );
