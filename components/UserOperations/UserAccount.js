import React, { Component } from 'react';
import { Icon, Typography, Skeleton, Empty, Tag, Row, Col } from 'antd';
import _ from 'lodash';

import UserAccountInformation from './UserAccountInformation';
import { ExportUserAccounts } from '../Operation/shared'

const { Title } = Typography;

function UserAccount({ currentUser, accounts, isLoading }) {

  const _displayData = () => {
    if (_.isEmpty( accounts )) {
      return <Empty description="No se encontraron cuentas asociadas a su nombre."/>
    } else {
      return _.map( accounts, account => <UserAccountInformation userAccount={ account }/> )
    }
  };

  const { firstName, lastName, userID, username } = currentUser;

  return (
    <>
      <Row style={ { marginBottom: 30 } }>
        <Col sm={ 24 } md={ 12 }>
          <Title level={ 4 }><Icon type="user"/> { userID }</Title>
        </Col>
        <Col sm={ 24 } md={ 12 }>
          <Title level={ 3 }>{ firstName } { lastName } <Tag style={ { fontSize: 14 } }>{ username }</Tag></Title>
        </Col>
      </Row>
      <Row>
        <Col>
          <ExportUserAccounts
            userAccounts={ accounts }
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Skeleton active loading={ isLoading }>
            { _displayData() }
          </Skeleton>
        </Col>
      </Row>

    </>
  )
}

export default UserAccount;
