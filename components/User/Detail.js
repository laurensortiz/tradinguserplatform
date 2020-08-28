import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Descriptions, Tag } from 'antd';
import _ from 'lodash';

import { FormatStatus, FormatDate } from '../../common/utils';


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


  render() {
    const userName = _.get(this.props, 'currentUser.username', '');
    const firstName = _.get(this.props, 'currentUser.firstName', '');
    const lastName = _.get(this.props, 'currentUser.lastName', '');
    const firstName2 = _.get(this.props, 'currentUser.firstName2', '');
    const lastName2 = _.get(this.props, 'currentUser.lastName2', '');
    const firstName3 = _.get(this.props, 'currentUser.firstName3', '');
    const lastName3 = _.get(this.props, 'currentUser.lastName3', '');
    const firstName4 = _.get(this.props, 'currentUser.firstName4', '');
    const lastName4 = _.get(this.props, 'currentUser.lastName4', '');
    const userID = _.get(this.props, 'currentUser.userID', '');
    const email = _.get(this.props, 'currentUser.email', '');
    const phoneNumber = _.get(this.props, 'currentUser.phoneNumber', '');
    const startDate = _.get(this.props, 'currentUser.startDate', null);

    const status = _.get(this.props, 'currentUser.status', 1);
    const {name, color} = FormatStatus(status);

    return (
      <>
        <Descriptions title="" column={1} size="small">
          <Descriptions.Item label="Usuario">{userName}</Descriptions.Item>
          <Descriptions.Item label="Nombre Completo">{firstName} {lastName} <Tag color="#e29524">Principal</Tag></Descriptions.Item>
          {!_.isEmpty(firstName2) ? (
            <Descriptions.Item label="Nombre Completo">{firstName2} {lastName2} <Tag >Adicional</Tag></Descriptions.Item>
          ) : null}
          {!_.isEmpty(firstName3) ? (
            <Descriptions.Item label="Nombre Completo">{firstName3} {lastName3} <Tag >Adicional</Tag></Descriptions.Item>

          ) : null}
          {!_.isEmpty(firstName4) ? (
            <Descriptions.Item label="Nombre Completo">{firstName4} {lastName4} <Tag >Adicional</Tag></Descriptions.Item>

          ) : null}

          <Descriptions.Item label="Usuario ID">{userID}</Descriptions.Item>
          <Descriptions.Item label="Correo Electrónico">{email}</Descriptions.Item>
          <Descriptions.Item label="Número de Teléfono">{phoneNumber}</Descriptions.Item>
          <Descriptions.Item label="Fecha de Inicio">{FormatDate(startDate)}</Descriptions.Item>

        </Descriptions>
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
