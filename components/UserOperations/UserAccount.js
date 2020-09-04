import React, { PureComponent } from 'react';
import { Icon, Typography, Skeleton, Empty, Tag, Row, Col, Avatar } from 'antd';
import _ from 'lodash';

import UserAccountInformation from './UserAccountInformation';
import { ExportUserAccounts } from '../Operation/shared'

const { Title } = Typography;

class UserAccount extends PureComponent {

  _displayData = () => {
    if (_.isEmpty( this.props.accounts )) {
      return <Empty description="No se encontraron cuentas asociadas a su nombre."/>
    } else {
      return _.map( this.props.accounts, account =>
        <UserAccountInformation
          userAccount={ account }
          onRequestStandardOperationsReport={ this.props.onRequestStandardOperationsReport }
          onAddReferral={ this.props.onAddReferral }
          isReferralLoading={ this.props.isReferralLoading }
          isReferralCompleted={ this.props.isReferralCompleted }
          isReferralSuccess={ this.props.isReferralSuccess }
        /> )
    }
  };

  render() {
    const { firstName, lastName, firstName2, lastName2, firstName3, lastName3, firstName4, lastName4, userID, username } = this.props.currentUser;
    return (
      <>
        <Row style={ { marginBottom: 30 } }>
          <Col xs={ 24 } sm={ 16 } style={ { textAlign: 'left', display: 'flex', alignItems: 'center' } }>
            <Avatar size={ 64 } icon="user" style={ { marginRight: 10, backgroundColor: '#2d2d3b' } }/>

            <Title level={ 4 }>

              { firstName } { lastName }
              { !_.isEmpty( firstName2 ) ? (
                ` | ${ firstName2 } ${ lastName2 }`
              ) : null }
              { !_.isEmpty( firstName3 ) ? (
                ` | ${ firstName3 } ${ lastName3 }`
              ) : null }
              { !_.isEmpty( firstName4 ) ? (
                ` | ${ firstName4 } ${ lastName4 }`
              ) : null }
              <br/>
              <Tag style={ { fontSize: 14 } }>  { username }</Tag>
            </Title>
          </Col>
          <Col xs={24} sm={8} >
            { !_.isEmpty( firstName2 ) || !_.isEmpty( firstName3 ) || !_.isEmpty( firstName4 ) ? (
              <Title  level={ 2 }><Icon type="hdd" theme="filled" color="#e29524"/> Cuenta Conjunta </Title>
            ) : null }
            <Title level={ 4 }><Icon type="bank" theme="filled"/> { userID }</Title>
          </Col>
        </Row>

        <Row>
          <Col sm={ 12 }>
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
