import React, { PureComponent } from 'react'
import { Row, Col, Descriptions, Tag } from 'antd'
import _ from 'lodash'
import { withNamespaces } from 'react-i18next'

import {
  FormatCurrency,
  FormatStatusLang,
  FormatDate,
  IsOperationPositive,
} from '../../../../common/utils'

class Detail extends PureComponent {
  render() {
    const { t } = this.props
    const operationType = _.get(this.props, 'currentOperation.operationType', '')
    const amount = _.get(this.props, 'currentOperation.amount', '0.00')
    const initialAmount = _.get(this.props, 'currentOperation.initialAmount', '0.00')

    const startDate = _.get(this.props, 'currentOperation.startDate', '')
    const expirationDate = _.get(this.props, 'currentOperation.expirationDate', '')

    const status = _.get(this.props, 'currentOperation.status', 1)
    const { name: statusName, color: statusColor } = FormatStatusLang(status)
    const langStatus = (status) => t(`status ${status}`)
    return (
      <>
        <Row>
          <Col>
            <Descriptions title={t('title operationInformation')}>
              <Descriptions.Item label={t('operationType')}>{operationType}</Descriptions.Item>
              <Descriptions.Item label={t('createdAt')}>{FormatDate(startDate)} </Descriptions.Item>
              <Descriptions.Item label={t('expirationDate')}>
                {FormatDate(expirationDate)}{' '}
              </Descriptions.Item>
              <Descriptions.Item label={t('initialAmount')}>
                {FormatCurrency.format(initialAmount)}{' '}
              </Descriptions.Item>
              <Descriptions.Item label={t('currentAmount')}>
                <span
                  className={
                    IsOperationPositive(amount, initialAmount)
                      ? 'positive txt-highlight'
                      : 'negative txt-highlight'
                  }
                >
                  {FormatCurrency.format(amount)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label={t('status')}>
                <Tag color={statusColor}>{langStatus(statusName)}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </>
    )
  }
}

export default withNamespaces()(Detail)
