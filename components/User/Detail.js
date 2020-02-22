import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from 'moment';

import { Row, Col, Button, Descriptions, Tag } from 'antd';
import _ from 'lodash';

import { FormatCurrency, FormatStatus, FormatDate } from '../../common/utils';

import { marketOperationOperations } from "../../state/modules/marketOperation";

class Detail extends Component {
  state = {
    currentOperation:{
      id: null,
      amount: 0
    },
  };

  static getDerivedStateFromProps(nextProps, prevState) {

    let updatedState = {};


    return !_.isEmpty(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    //this.props.fetchGetInvestmentOperations()
  };

  render() {
    const userName = _.get(this.props, 'currentUser.username', '');
    const firstName = _.get(this.props, 'currentUser.firstName', '');
    const lastName = _.get(this.props, 'currentUser.lastName', '');
    const userID = _.get(this.props, 'currentUser.userID', '');
    const email = _.get(this.props, 'currentUser.email', '');
    const phoneNumber = _.get(this.props, 'currentUser.phoneNumber', '');
    const startDate = _.get(this.props, 'currentUser.startDate', null);
    const account = _.get(this.props, 'currentUser.account.name', '');

    const status = _.get(this.props, 'currentUser.status', 1);
    const {name, color} = FormatStatus(status);

    return (
      <>
        <Row>
          <Col>
            <Descriptions title="">
              <Descriptions.Item label="Usuario">{userName}</Descriptions.Item>
              <Descriptions.Item label="Nombre Completo">{firstName} {lastName}</Descriptions.Item>
              <Descriptions.Item label="Número de Cédula">{userID}</Descriptions.Item>
              <Descriptions.Item label="Correo Electrónico">{email}</Descriptions.Item>
              <Descriptions.Item label="Número de Teléfono">{phoneNumber}</Descriptions.Item>
              <Descriptions.Item label="Fecha de Inicio">{FormatDate(startDate)}</Descriptions.Item>
              <Descriptions.Item label="Cuenta Asociada">{account}</Descriptions.Item>

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
