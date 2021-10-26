import React, { PureComponent } from 'react'
import { Row, Col, Descriptions } from 'antd'
import _ from 'lodash'
import { withNamespaces } from 'react-i18next'

import { FormatCurrency, FormatStatus, IsOperationPositive } from '../../../../common/utils'

class AccountInformation extends PureComponent {
  render() {
    const { t } = this.props

    const accountValue = _.get(this.props, 'currentOperation.userAccount.accountValue', '0.00')
    const balanceInitial = _.get(this.props, 'currentOperation.userAccount.balanceInitial', '0.00')

    const accountName = _.get(this.props, 'currentOperation.userAccount.account.name', '')
    const accountPercentage = _.get(
      this.props,
      'currentOperation.userAccount.account.percentage',
      '0'
    )
    const marginUsed = _.get(this.props, 'currentOperation.userAccount.marginUsed', '0.00')

    const guaranteeOperation = _.get(
      this.props,
      'currentOperation.userAccount.guaranteeOperation',
      '0.00'
    )
    const guaranteeCredits = _.get(
      this.props,
      'currentOperation.userAccount.guaranteeCredits',
      '0.00'
    )
    const commissionByReference = _.get(
      this.props,
      'currentOperation.userAccount.commissionByReference',
      '0.00'
    )

    const associatedOperation = _.get(
      this.props,
      'currentOperation.userAccount.account.associatedOperation',
      1
    )

    return (
      <>
        <Row>
          <Col>
            <Descriptions title={t('accountInformation')}>
              <Descriptions.Item label={t('accountValue')}>
                <span
                  className={
                    IsOperationPositive(accountValue, balanceInitial)
                      ? 'positive txt-highlight'
                      : 'negative txt-highlight'
                  }
                >
                  {FormatCurrency.format(accountValue)}
                </span>{' '}
              </Descriptions.Item>

              <Descriptions.Item label={t('accountType')}>{accountName}</Descriptions.Item>
              <Descriptions.Item label={t('profitCommission')}>
                {accountPercentage} %
              </Descriptions.Item>
              {_.isEqual(associatedOperation, 1) ? (
                <Descriptions.Item label={t('availableGuarantees')}>
                  {FormatCurrency.format(guaranteeOperation)}
                </Descriptions.Item>
              ) : null}
              <Descriptions.Item label={t('initialAmount')}>
                {FormatCurrency.format(balanceInitial)}
              </Descriptions.Item>
              <Descriptions.Item label={t('guaranteesCredits')}>
                {FormatCurrency.format(guaranteeCredits)}
              </Descriptions.Item>
              {_.isEqual(associatedOperation, 1) ? (
                <>
                  <Descriptions.Item label={`${t('marginUsed')} 10%`}>
                    {FormatCurrency.format(marginUsed)}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('commissionsByReference')}>
                    {FormatCurrency.format(commissionByReference)}
                  </Descriptions.Item>
                </>
              ) : null}
            </Descriptions>
          </Col>
        </Row>
      </>
    )
  }
}

export default withNamespaces()(AccountInformation)
