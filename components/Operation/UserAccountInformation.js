import React, { PureComponent } from 'react';
import moment from 'moment';
import { Row, Col, Button, Descriptions, Tag, Card, Statistic, Icon, Divider } from 'antd';
import _ from 'lodash';
import classNames from 'classnames';

import { FormatCurrency, FormatStatus, FormatDate, IsOperationPositive } from '../../common/utils';
import { Investment, Market } from "./index";

class AccountInformation extends PureComponent {

  render() {
    const userId = _.get( this.props, 'userAccount.user.id', 0 );
    const userAccountId = _.get( this.props, 'userAccount.id');
    const accountValue = _.get( this.props, 'userAccount.accountValue', '0.00' );
    const accountType = _.get( this.props, 'userAccount.account.associatedOperation', 1 );
    const balanceInitial = _.get( this.props, 'userAccount.balanceInitial', '0.00' );
    const maintenanceMargin = _.get( this.props, 'userAccount.maintenanceMargin', '0.00' );

    const accountName = _.get( this.props, 'userAccount.account.name', '' );
    const accountPercentage = _.get( this.props, 'userAccount.account.percentage', '0' );

    const guaranteeOperation = _.get( this.props, 'userAccount.guaranteeOperation', '0.00' );
    const guaranteeCredits = _.get( this.props, 'userAccount.guaranteeCredits', '0.00' );

    const isOperationPositive = IsOperationPositive( accountValue, balanceInitial );

    return (
      <Card title={`Información de la Cuenta: ${accountName}`} headStyle={{backgroundColor: '#2D2D3B'}} bodyStyle={{backgroundColor: '#0E0E0E'}} style={{marginBottom: 20}}>
        <Row style={{marginBottom: 20}}>
          <Col>
            <Descriptions title="">
              <Descriptions.Item label="Tipo de cuenta">{ accountName }</Descriptions.Item>
              <Descriptions.Item label="Comisíon sobre ganancias">{ accountPercentage } %</Descriptions.Item>

              <Descriptions.Item
                label="Garantías disponibles">{ FormatCurrency.format( guaranteeOperation ) }</Descriptions.Item>

              <Descriptions.Item
                label="Garantías / Créditos">{ FormatCurrency.format( guaranteeCredits ) }</Descriptions.Item>

            </Descriptions>
          </Col>
        </Row>
        <Row gutter={12} style={{marginBottom: 50}}>
          <Col sm={24} md={12}>
            <Card className={ isOperationPositive ? 'positive-bg' : 'negative-bg' }>
              <Statistic
                title="Valor de la Cuenta"
                value={ accountValue }
                prefix={ isOperationPositive ? <Icon type="arrow-up"/> : <Icon type="arrow-down"/> }
                suffix="$"
              />
            </Card>
          </Col>
          <Col sm={24} md={12}>
            <Card className="neutral-bg">
              <Statistic
                title="Saldo Inicial"
                value={ balanceInitial }
                prefix={ <Icon type="dollar"/> }
                suffix="$"
              />
            </Card>
          </Col>
        </Row>
        <Row>
          {_.isEqual(accountType, 1) ? (
            <Market
              isAdmin={ false }
              currentUserId={userId}
              userAccountId={userAccountId}
            />
          ) : (
            <Investment
              isAdmin={ false }
              currentUserId={userId}
              userAccountId={userAccountId}
            />
          )}
        </Row>
      </Card>
    );
  }
}

export default AccountInformation;
