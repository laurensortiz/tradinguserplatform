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
      return _.map( this.props.accounts, account => <UserAccountInformation userAccount={ account }/> )
    }
  };

  render() {
    const { firstName, lastName, userID, username } = this.props.currentUser;
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
