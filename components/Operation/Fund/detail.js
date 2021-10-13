import React, { PureComponent } from 'react'
import moment from 'moment'
import { Row, Col, Button, Descriptions, Tag } from 'antd'
import _ from 'lodash'

import {
  FormatCurrency,
  FormatStatus,
  FormatDate,
  IsOperationPositive,
} from '../../../common/utils'

class Detail extends PureComponent {
  render() {
    const operationType = _.get(this.props, 'currentOperation.operationType', '')
    const amount = _.get(this.props, 'currentOperation.amount', '0.00')
    const initialAmount = _.get(this.props, 'currentOperation.initialAmount', '0.00')

    const startDate = _.get(this.props, 'currentOperation.startDate', '')
    const endDate = _.get(this.props, 'currentOperation.endDate', '')
    const expirationDate = _.get(this.props, 'currentOperation.expirationDate', '')

    const accountName = _.get(this.props, 'currentOperation.userAccount.account.name', '')
    const accountPercentage = _.get(
      this.props,
      'currentOperation.userAccount.account.percentage',
      '0'
    )
    const status = _.get(this.props, 'currentOperation.status', 1)
    const { name: statusName, color: statusColor } = FormatStatus(status)

    return (
      <>
        <Row>
          <Col>
            <Descriptions title="Información de la Operación:">
              <Descriptions.Item label="Tipo de Operación">{operationType}</Descriptions.Item>
              <Descriptions.Item label="Fecha de Apertura">
                {FormatDate(startDate)}{' '}
              </Descriptions.Item>
              <Descriptions.Item label="Fecha de Cierre">{FormatDate(endDate)} </Descriptions.Item>
              <Descriptions.Item label="Fecha de Expiración">
                {FormatDate(expirationDate)}{' '}
              </Descriptions.Item>

              <Descriptions.Item label="Saldo Inicial">
                {FormatCurrency.format(initialAmount)}{' '}
              </Descriptions.Item>
              <Descriptions.Item label="Saldo Actual">
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
              <Descriptions.Item label="Estado">
                <Tag color={statusColor}>{statusName}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </>
    )
  }
}

export default Detail
