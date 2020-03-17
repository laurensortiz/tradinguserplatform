import React, { PureComponent } from 'react';
import moment from 'moment';
import { Row, Col, Button, Descriptions, Tag, Card, Statistic, Icon } from 'antd';
import _ from 'lodash';
import classNames from 'classnames';

import { FormatCurrency, FormatStatus, FormatDate, IsOperationPositive } from '../../common/utils';

class AccountInformation extends PureComponent {

  render() {
    const accountValue = _.get( this.props, 'userAccount.accountValue', '0.00' );
    const balanceInitial = _.get( this.props, 'userAccount.balanceInitial', '0.00' );
    const maintenanceMargin = _.get( this.props, 'userAccount.maintenanceMargin', '0.00' );

    const accountName = _.get( this.props, 'userAccount.account.name', '' );
    const accountPercentage = _.get( this.props, 'userAccount.account.percentage', '0' );

    const guaranteeOperation = _.get( this.props, 'userAccount.guaranteeOperation', '0.00' );

    const isOperationPositive = IsOperationPositive( accountValue, balanceInitial );

    return (
      <>
        <Row gutter={ 16 } style={{marginBottom: 50}}>
          <Col span={ 12 }>
            <Card className={ isOperationPositive ? 'positive-bg' : 'negative-bg' }>
              <Statistic
                title="Valor de la Cuenta"
                value={ accountValue }
                prefix={ isOperationPositive ? <Icon type="arrow-up"/> : <Icon type="arrow-down"/> }
                suffix="$"
              />
            </Card>
          </Col>
          <Col span={ 12 }>
            <Card>
              <Statistic
                title="Saldo Inicial"
                value={ balanceInitial }
                prefix={ <Icon type="dollar"/> }
                suffix="$"
              />
            </Card>
          </Col>
        </Row>
        <Row style={{marginBottom: 50}}>
          <Col>
            <Descriptions title="Información de la Cuenta:">
              <Descriptions.Item label="Tipo de cuenta">{ accountName }</Descriptions.Item>
              <Descriptions.Item label="Comisíon sobre ganancias">{ accountPercentage } %</Descriptions.Item>

              <Descriptions.Item
                label="Garantías disponibles">{ FormatCurrency.format( guaranteeOperation ) }</Descriptions.Item>

            </Descriptions>
          </Col>
        </Row>
      </>
    );
  }
}

export default AccountInformation;
