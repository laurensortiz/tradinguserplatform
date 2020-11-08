import React, { PureComponent } from 'react';
import { Row, Col, Descriptions, Tag } from 'antd';
import { withNamespaces } from 'react-i18next';
import _ from 'lodash';

import { FormatCurrency, FormatStatusLang, FormatDate, IsOperationPositive, AssetClassColor } from '../../../../common/utils';

class Detail extends PureComponent {

  render() {
    const {t} = this.props;
    const productName = _.get(this.props, 'currentOperation.product.name', '');
    const productCode = _.get(this.props, 'currentOperation.product.code', '');

    const amount = _.get(this.props, 'currentOperation.amount', '0.00');
    const initialAmount = _.get(this.props, 'currentOperation.initialAmount', '0.00');
    const startDate = _.get(this.props, 'currentOperation.createdAt', '');
    const longShort = _.get(this.props, 'currentOperation.longShort', '');
    const commoditiesTotal = _.get(this.props, 'currentOperation.commoditiesTotal', '0');
    const buyPrice = _.get(this.props, 'currentOperation.buyPrice', '0.00');
    const holdStatusCommission = _.get(this.props, 'currentOperation.holdStatusCommission', '0.00');
    const takingProfit = _.get(this.props, 'currentOperation.takingProfit', '0.00');
    const maintenanceMargin = _.get(this.props, 'currentOperation.maintenanceMargin', '0.00');
    const stopLost = _.get(this.props, 'currentOperation.stopLost', '0');
    const orderId = _.get(this.props, 'currentOperation.orderId', '-');

    const brokerName = _.get(this.props, 'currentOperation.broker.name', '-');
    const commodityName = _.get(this.props, 'currentOperation.commodity.name', '');
    const assetClassName = _.get(this.props, 'currentOperation.assetClass.name', '');

    const status = _.get(this.props, 'currentOperation.status', 1);
    const {name : statusName, color : statusColor} = FormatStatusLang(status);
    const langStatus = status => t(`status ${status}`)

    return (
      <>
        <Row>
          <Col>
            <Descriptions title={t('title operationInformation')}>
              <Descriptions.Item label={t('product')}><Tag className="product-tag">{productName}</Tag></Descriptions.Item>
              <Descriptions.Item label={ t('createdAt') }>{FormatDate(startDate)} </Descriptions.Item>
              <Descriptions.Item label={ t('investment') }>{FormatCurrency.format(initialAmount)} </Descriptions.Item>
              <Descriptions.Item label={ t('currentAmount') }><span className={IsOperationPositive(amount, initialAmount) ? 'positive txt-highlight' : 'negative txt-highlight'}>{FormatCurrency.format(amount)}</span> </Descriptions.Item>
              <Descriptions.Item label="L/S">{longShort}</Descriptions.Item>
              <Descriptions.Item label={ t('maintenanceMargin') }>{FormatCurrency.format(maintenanceMargin)}</Descriptions.Item>
              <Descriptions.Item label={ t('lotage') }>{commoditiesTotal} <Tag>{commodityName}</Tag> <Tag className={`asset-class ${AssetClassColor(assetClassName).name}`}>{assetClassName}</Tag></Descriptions.Item>
              <Descriptions.Item label={t('buyPrice')}>{FormatCurrency.format(buyPrice)}</Descriptions.Item>
              <Descriptions.Item label={t('takingProfit')}>{FormatCurrency.format(takingProfit)}</Descriptions.Item>
              <Descriptions.Item label={t('stopLost')}>{stopLost}%</Descriptions.Item>
              <Descriptions.Item label={t('orderNumber')}>{orderId}</Descriptions.Item>
              <Descriptions.Item label={ t('broker') }>{brokerName}</Descriptions.Item>


              <Descriptions.Item label={ t('status') }>
                <Tag color={statusColor} >{ langStatus(statusName) }</Tag>
              </Descriptions.Item>
              <Descriptions.Item label={ t('commissionStatusHold') }>{FormatCurrency.format(holdStatusCommission)}</Descriptions.Item>

            </Descriptions>
          </Col>
        </Row>
      </>
    );
  }
}

Detail.defaultProps = {
  currentOperation: {
    userAccount: {
      user: {
        username: '',
        firstName: '',
        lastName: ''
      },
      account: {
        name: '',
        percentage: '0'
      },
      accountValue: '0.00'
    },
    product: {
      name: '',
      code: '',
    },
    broker: {
      name: '',
    },
    longShort: '',
    commoditiesTotal: '',
    amount: '0.00',
    initialAmount: '0.00',
    startDate: '',
    endDate: '',
    status: 1
  }
};



export default withNamespaces()(Detail);
