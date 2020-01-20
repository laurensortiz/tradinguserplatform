import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Row, Col, Button, Drawer, Tabs, notification, Radio } from 'antd';
import _ from 'lodash';

import Document from '../components/Document';

import { Investment, Market } from '../components/Operation';
import { investmentOperationOperations } from "../state/modules/investmentOperation";

const { TabPane } = Tabs;

class Operations extends Component {
  state = {
    operationType: 'investment',
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

              />
            </TabPane>
            <TabPane tab key="investment">
              <Investment
                isFormVisible={_.isEqual(this.state.operationType, 'investment') && this.state.isFormVisible}
                onClose={this._handleFormDisplay}

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
