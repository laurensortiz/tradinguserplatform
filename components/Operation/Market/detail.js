import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from 'moment';

import { Row, Col, Button, Descriptions, Tag } from 'antd';
import _ from 'lodash';

import { FormatCurrency, FormatStatus, FormatDate } from '../../../common/utils';

import { marketOperationOperations } from "../../../state/modules/marketOperation";

import MovementsTable from './movementsTable';

class Detail extends Component {
  state = {
    currentOperation:{
      id: null,
      amount: 0
    },
  };

  static getDerivedStateFromProps(nextProps, prevState) {

    let updatedState = {};
    if (!_.isEqual(nextProps.currentOperation, prevState.currentOperation)) {
      _.assignIn(updatedState, {
        currentOperation: nextProps.currentOperation
      })
    }

    return !_.isEmpty(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    //this.props.fetchGetInvestmentOperations()
  };

  render() {
    const userName = _.get(this.props, 'currentOperation.userAccount.user.username', '');
    const firstName = _.get(this.props, 'currentOperation.userAccount.user.firstName', '');
    const lastName = _.get(this.props, 'currentOperation.userAccount.user.lastName', '');
    const operationType = _.get(this.props, 'currentOperation.operationType', '');
    const amount = _.get(this.props, 'currentOperation.amount', '0.00');
    const initialAmount = _.get(this.props, 'currentOperation.initialAmount', '0.00');

    const startDate = _.get(this.props, 'currentOperation.startDate', '');
    const endDate = _.get(this.props, 'currentOperation.endDate', '');

    const accountName = _.get(this.props, 'currentOperation.userAccount.account.name', '');
    const accountPercentage = _.get(this.props, 'currentOperation.userAccount.account.percentage', '0');
    const status = _.get(this.props, 'currentOperation.status', 1);
    const {name, color} = FormatStatus(status);

    return (
      <>
        <Row>
          <Col>
            <Descriptions title="Información de la Cuenta:">
              <Descriptions.Item label="Usuario">{userName} - {firstName} {lastName} </Descriptions.Item>
              <Descriptions.Item label="Tipo de Cuenta">{accountName}</Descriptions.Item>
              <Descriptions.Item label="Comisíon sobre ganancias">{accountPercentage} %</Descriptions.Item>
            </Descriptions>
          </Col>
          <Col>
            <Descriptions title="Información de la Operación:">
              <Descriptions.Item label="Tipo de Operación">{operationType}</Descriptions.Item>
              <Descriptions.Item label="Fecha de Apertura">{FormatDate(startDate)} </Descriptions.Item>
              <Descriptions.Item label="Fecha de Cierre">{FormatDate(endDate)} </Descriptions.Item>
              <Descriptions.Item label="Saldo Inicial">{FormatCurrency.format(initialAmount)} </Descriptions.Item>
              <Descriptions.Item label="Saldo Actual">{FormatCurrency.format(amount)} </Descriptions.Item>
              <Descriptions.Item label="Estado">
                <Tag color={color} >{ name }</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>

      </>
    );
  }
}

function mapStateToProps(state) {

  return {

  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {

  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Detail );
