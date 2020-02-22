import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Row, Col, Button, Drawer, Tabs, notification, Radio, Icon } from 'antd';
import _ from 'lodash';

import Document from '../components/Document';

import { Investment, Market } from '../components/Operation';
import { investmentOperationOperations } from "../state/modules/investmentOperation";

const { TabPane } = Tabs;

class Operations extends Component {
  state = {
    operationType: 'market',
    isFormVisible: false,
    investmentOperations: [],
    marketOperations: [],
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {};

    return !_.isEmpty(updatedState) ? updatedState : null;
  }

  componentDidMount() {
  };

  _onSelectOperationType = ({target}) => {
    this.setState({
      operationType: target.value,
    });
  };

  _handleFormDisplay = (isFormVisible) => {
    this.setState({
      isFormVisible
    })
  };

  render() {
    return (
      <Document id="userOperations-page">
        <Row>
          <Radio.Group
            defaultValue={this.state.operationType}
            size="large"
            style={ { float: 'left' } }
            onChange={this._onSelectOperationType}
          >
            <Radio.Button value="market"><Icon type="sliders" /> Bolsa OTC</Radio.Button>
            <Radio.Button value="investment"> <Icon type="fund" /> Fondo de Interés</Radio.Button>
          </Radio.Group>
          <Button style={ { float: 'right' } } type="primary" onClick={ () => this._handleFormDisplay(true) }>
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
                handleFormVisible={this._handleFormDisplay}
              />
            </TabPane>
            <TabPane tab key="investment">
              <Investment
                isFormVisible={_.isEqual(this.state.operationType, 'investment') && this.state.isFormVisible}
                onClose={this._handleFormDisplay}
                handleFormVisible={this._handleFormDisplay}
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

    isLoading: state.investmentOperationsState.isLoading,
    isSuccess: state.investmentOperationsState.isSuccess,
    isFailure: state.investmentOperationsState.isFailure,
    message: state.investmentOperationsState.message,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetInvestmentOperations: investmentOperationOperations.fetchGetInvestmentOperations,
  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Operations );
