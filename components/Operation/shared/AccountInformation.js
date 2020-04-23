import React, { PureComponent } from 'react';
import moment from 'moment';
import { Row, Col, Button, Descriptions, Tag } from 'antd';
import _ from 'lodash';

import { FormatCurrency, FormatStatus, FormatDate, IsOperationPositive } from '../../../common/utils';

class AccountInformation extends PureComponent {

  render() {
console.log('[=====  test  =====>');
console.log(this.props.currentOperation);
console.log('<=====  /test  =====]');
    const accountValue = _.get(this.props, 'currentOperation.userAccount.accountValue', '0.00');
    const balanceInitial = _.get(this.props, 'currentOperation.userAccount.balanceInitial', '0.00');
    const maintenanceMargin = _.get(this.props, 'currentOperation.userAccount.maintenanceMargin', '0.00');

    const accountName = _.get(this.props, 'currentOperation.userAccount.account.name', '');
    const accountPercentage = _.get(this.props, 'currentOperation.userAccount.account.percentage', '0');
    const marginUsed = _.get(this.props, 'currentOperation.userAccount.marginUsed', '0.00');

    const guaranteeOperation = _.get(this.props, 'currentOperation.userAccount.guaranteeOperation', '0.00');
    const guaranteeCredits = _.get(this.props, 'currentOperation.userAccount.guaranteeCredits', '0.00');


    const productName = _.get(this.props, 'currentOperation.product.name', '');
    const productCode = _.get(this.props, 'currentOperation.product.code', '');


    const amount = _.get(this.props, 'currentOperation.amount', '0.00');
    const initialAmount = _.get(this.props, 'currentOperation.initialAmount', '0.00');

    const startDate = _.get(this.props, 'currentOperation.startDate', '');
    const endDate = _.get(this.props, 'currentOperation.endDate', '');


    const status = _.get(this.props, 'currentOperation.status', 1);
    const {name : statusName, color : statusColor} = FormatStatus(status);
    
    const associatedOperation = _.get(this.props, 'currentOperation.userAccount.account.associatedOperation', 1);

    return (
      <>
        <Row>
          <Col>
            <Descriptions title="Información de la Cuenta:">
              <Descriptions.Item label="Valor de la cuenta"><span className={IsOperationPositive(accountValue, balanceInitial) ? 'positive' : 'negative'}>{FormatCurrency.format(accountValue)}</span> </Descriptions.Item>

              <Descriptions.Item label="Tipo de cuenta">{accountName}</Descriptions.Item>
              <Descriptions.Item label="Comisíon sobre ganancias">{accountPercentage} %</Descriptions.Item>
              {_.isEqual(associatedOperation, 1) ? (
                <Descriptions.Item label="Garantías disponibles">{FormatCurrency.format(guaranteeOperation)}</Descriptions.Item>
              ) : null}
              <Descriptions.Item label="Saldo Inicial">{FormatCurrency.format(balanceInitial)}</Descriptions.Item>
              <Descriptions.Item label="Garantías / Créditos">{FormatCurrency.format(guaranteeCredits)}</Descriptions.Item>
              {_.isEqual(associatedOperation, 1) ? (
                <Descriptions.Item label="Margen utilizado 10%">{FormatCurrency.format(marginUsed)}</Descriptions.Item>
              ) : null}
            </Descriptions>
          </Col>
        </Row>

      </>
    );
  }
}

export default AccountInformation;
