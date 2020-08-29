import React, { PureComponent } from 'react';
import { Icon, Typography, Skeleton, Empty, Tag, Row, Col } from 'antd';
import _ from 'lodash';

import UserAccountInformation from './UserAccountInformation';
import { ExportUserAccounts } from '../Operation/shared'

const { Title } = Typography;

class UserAccount extends PureComponent  {

  _displayData = () => {
    if (_.isEmpty( this.props.accounts )) {
      return <Empty description="No se encontraron cuentas asociadas a su nombre."/>
    } else {
      return _.map( this.props.accounts, account =>
        <UserAccountInformation
          userAccount={ account }
          onRequestStandardOperationsReport={this.props.onRequestStandardOperationsReport}
      /> )
    }
  };

  render() {
    const { firstName, lastName, firstName2, lastName2, firstName3, lastName3, firstName4, lastName4, userID, username } = this.props.currentUser;
    return (
      <>
        <Row style={ { marginBottom: 30 } }>
          <Col sm={ 24 }>
            {!_.isEmpty(firstName2) || !_.isEmpty(firstName3) || !_.isEmpty(firstName4) ? (
              <Title level={ 2 }><Icon type="hdd" theme="filled" color="#e29524" /> Cuenta Conjunta </Title>
            ) : null}
          </Col>
          <Col sm={ 24 } md={ 10 } style={{textAlign: 'left'}}>
            <Title level={ 4 }>
              { firstName } { lastName }
              {!_.isEmpty(firstName2) ? (
                ` | ${firstName2} ${lastName2}`
              ) : null}
              {!_.isEmpty(firstName3) ? (
                ` | ${firstName3} ${lastName3}`
              ) : null}
              {!_.isEmpty(firstName4) ? (
                ` | ${firstName4} ${lastName4}`
              ) : null}
            </Title>
          </Col>
          <Col sm={ 24 }  md={ 10 }>
            <Title level={ 4 }><Icon type="bank" theme="filled" /> { userID }</Title>

          </Col>
          <Col sm={ 24 } md={ 4 }>
            <Title level={ 4 }><Icon type="user"/> <Tag style={ { fontSize: 14 } }>  { username }</Tag></Title>

          </Col>

        </Row>
        <Row>
          <Col sm={12}>
            <ExportUserAccounts
              userAccounts={ this.props.accounts }
            />
          </Col>

        </Row>
        <Row>
          <Col>
            <Skeleton active loading={ this.props.isLoading }>
              { this._displayData() }
            </Skeleton>
          </Col>
        </Row>

      </>
    )
  }


}

export default UserAccount;
