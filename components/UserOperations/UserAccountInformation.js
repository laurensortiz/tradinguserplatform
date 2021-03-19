import React, { PureComponent } from 'react'
import { Row, Col, Descriptions, Card, Icon, Button, Modal, Tooltip } from 'antd'
import _ from 'lodash'
import { withNamespaces } from 'react-i18next'
import moment from 'moment'

import { FormatCurrency, IsOperationPositive, StaticAmountBox } from '../../common/utils'
import ReferralForm from './ReferralForm'
import WireTransferRequestForm from './WireTransferRequestForm'
import { Investment, Market } from './Operation'
import { ExportUserAccountsPDF } from './Operation/shared'
import { bindActionCreators } from 'redux'
import { wireTransferRequestOperations } from '../../state/modules/wireTransferRequests'
import { connect } from 'react-redux'

const getTotalMonthsFromDate = (date) => {
  const userStartDate = new moment(date)
  const today = new moment()
  return parseInt(moment.duration(today.diff(userStartDate)).asMonths())
}

class AccountInformation extends PureComponent {
  state = {
    isReferralFormVisible: false,
    isWireTransferRequestFormVisible: false,
    isUserWireTransferAvailable: false,
    lastWireTransferRequestDate: null,
    isRequestingLastRequest: false,
    isWireTransferRequestAddCompleted: false,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {}

    if (nextProps.isReferralCompleted && nextProps.isReferralSuccess) {
      _.assignIn(updatedState, {
        isReferralFormVisible: false,
      })
    }

    if (
      nextProps.isWireTransferRequestAddCompleted &&
      !prevState.isWireTransferRequestAddCompleted
    ) {
      _.assignIn(updatedState, {
        isWireTransferRequestFormVisible: false,
        isUserWireTransferAvailable: false,
      })
    }

    if (nextProps.userAccount && !prevState.isUserWireTransferAvailable) {
      const getTotalMonths = getTotalMonthsFromDate(nextProps.userAccount.user.startDate)
      const isProfitMonthAccount = nextProps.userAccount.account.associatedOperation === 2
      const requiredHoldTime = isProfitMonthAccount ? 1 : 6
      _.assignIn(updatedState, {
        isUserWireTransferAvailable: getTotalMonths >= requiredHoldTime,
      })
    }

    if (nextProps.userAccount && !prevState.isRequestingLastRequest) {
      nextProps.fetchGetUserAccountWireTransferRequests(
        nextProps.userAccount.id,
        nextProps.userAccount.account.associatedOperation
      )
      _.assignIn(updatedState, {
        isRequestingLastRequest: true,
      })
      return {
        isRequestingLastRequest: true,
      }
    }
    console.log('[=====  here  =====>')
    console.log(nextProps.lastWireTransferRequest)
    console.log('<=====  /here  =====]')

    if (
      Object.keys(nextProps.lastWireTransferRequest).length > 0 &&
      !prevState.lastWireTransferRequestDate
    ) {
      const { createdAt } = nextProps.lastWireTransferRequest[0]

      const getTotalMonths = getTotalMonthsFromDate(createdAt)

      _.assignIn(updatedState, {
        isUserWireTransferAvailable: getTotalMonths > 0,
        lastWireTransferRequestDate: createdAt,
        isWireTransferRequestFormVisible: false,
      })
    }

    return Object.keys(updatedState).length > 0 ? updatedState : null
  }

  _onHandleShowForm = () => {
    this.setState({
      isReferralFormVisible: !this.state.isReferralFormVisible,
    })
  }

  _onHandleShowWireTransferForm = () => {
    this.setState({
      isWireTransferRequestFormVisible: !this.state.isWireTransferRequestFormVisible,
    })
  }

  _getHeaderCard = () => {
    const wireTransferBtn = (
      <Button
        onClick={this._onHandleShowWireTransferForm}
        disabled={
          !this.state.isUserWireTransferAvailable || this.props.isWireTransferRequestAddCompleted
        }
      >
        <Icon type="dollar" /> Wire Transfer Request
      </Button>
    )
    const disableText =
      'No ha cumplido con el tiempo requerido para realizar la solicitud de dinero.'
    return this.state.isUserWireTransferAvailable ? (
      wireTransferBtn
    ) : (
      <Tooltip placement="leftTop" title={disableText}>
        {wireTransferBtn}
      </Tooltip>
    )
  }

  render() {
    const { t } = this.props
    const userId = _.get(this.props, 'userAccount.user.id', 0)
    const userAccountId = _.get(this.props, 'userAccount.id')
    const accountValue = _.get(this.props, 'userAccount.accountValue', 0.0)
    const accountType = _.get(this.props, 'userAccount.account.associatedOperation', 1)
    const balanceInitial = _.get(this.props, 'userAccount.balanceInitial', 0.0)

    const accountName = _.get(this.props, 'userAccount.account.name', '')
    const accountPercentage = _.get(this.props, 'userAccount.account.percentage', '0')

    const guaranteeOperation = _.get(this.props, 'userAccount.guaranteeOperation', '0.00')
    const guaranteeCredits = _.get(this.props, 'userAccount.guaranteeCredits', '0.00')
    const marginUsed = _.get(this.props, 'userAccount.marginUsed', '0.00')
    const commissionByReference = _.get(this.props, 'userAccount.commissionByReference', '0.00')

    const isOperationPositive = IsOperationPositive(accountValue, balanceInitial)

    return (
      <>
        <ExportUserAccountsPDF userAccount={this.props.userAccount} />
        <Card
          title={`${t('accountInformation')}: ${accountName}`}
          headStyle={{ backgroundColor: '#2D2D3B' }}
          bodyStyle={{ backgroundColor: '#0E0E0E' }}
          style={{ marginBottom: 20 }}
          className="account-detail"
        >
          <Row style={{ marginBottom: 20 }}>
            <Col>
              <Descriptions title={this._getHeaderCard()}>
                <Descriptions.Item label={t('accountType')}>{accountName}</Descriptions.Item>
                {_.isEqual(accountType, 1) ? (
                  <Descriptions.Item label={t('profitCommission')}>
                    {accountPercentage} %
                  </Descriptions.Item>
                ) : (
                  <Descriptions.Item label={t('interestType')}>
                    {accountPercentage} %
                  </Descriptions.Item>
                )}

                {_.isEqual(accountType, 1) ? (
                  <Descriptions.Item label={t('availableGuarantees')}>
                    {FormatCurrency.format(guaranteeOperation)}
                  </Descriptions.Item>
                ) : null}

                <Descriptions.Item label={t('guaranteesCredits')}>
                  {FormatCurrency.format(guaranteeCredits)}
                </Descriptions.Item>
                {_.isEqual(accountType, 1) ? (
                  <>
                    <Descriptions.Item label={`${t('marginUsed')} 10%`}>
                      {FormatCurrency.format(marginUsed)}
                    </Descriptions.Item>

                    <Descriptions.Item label={t('commissionsByReference')}>
                      {FormatCurrency.format(commissionByReference)}
                      <Button
                        type="tertiary"
                        style={{ marginLeft: 10, fontSize: 15 }}
                        onClick={this._onHandleShowForm}
                      >
                        <Icon type="solution" /> {t('btn referral')}
                      </Button>
                    </Descriptions.Item>
                  </>
                ) : null}
              </Descriptions>
              <div>
                <Modal
                  destroyOnClose={true}
                  footer={null}
                  onCancel={this._onHandleShowForm}
                  visible={this.state.isReferralFormVisible}
                  wrapClassName="flexible-modal-wrapper"
                >
                  <ReferralForm
                    onAddReferral={this.props.onAddReferral}
                    userAccount={this.props.userAccount}
                    isReferralLoading={this.props.isReferralLoading}
                    isReferralCompleted={this.props.isReferralCompleted}
                    isReferralSuccess={this.props.isReferralSuccess}
                    onCloseModal={this._onHandleShowForm}
                  />
                </Modal>
                <Modal
                  destroyOnClose={true}
                  footer={null}
                  onCancel={this._onHandleShowWireTransferForm}
                  visible={this.state.isWireTransferRequestFormVisible}
                  wrapClassName="flexible-modal-wrapper"
                  width={650}
                >
                  <WireTransferRequestForm
                    onWireTransferRequest={this.props.onWireTransferRequest}
                    userAccount={this.props.userAccount}
                    isWireTransferRequestLoading={this.props.isWireTransferRequestLoading}
                    isWireTransferRequestCompleted={this.props.isWireTransferRequestCompleted}
                    isWireTransferRequestSuccess={this.props.isWireTransferRequestSuccess}
                    onCloseModal={this._onHandleShowWireTransferForm}
                  />
                </Modal>
              </div>
            </Col>
          </Row>
          <Row gutter={12} style={{ marginBottom: 50 }}>
            <Col sm={24} md={12}>
              <Card className={isOperationPositive ? 'positive-bg' : 'negative-bg'}>
                <StaticAmountBox
                  title={t('accountValue')}
                  value={accountValue}
                  icon={isOperationPositive ? <Icon type="arrow-up" /> : <Icon type="arrow-down" />}
                />
              </Card>
            </Col>
            <Col sm={24} md={12}>
              <Card className="neutral-bg">
                <StaticAmountBox
                  title={t('initialAmount')}
                  value={balanceInitial}
                  icon={<Icon type="dollar" />}
                />
              </Card>
            </Col>
          </Row>
          <Row>
            {_.isEqual(accountType, 1) ? (
              <Market
                isAdmin={false}
                currentUserId={userId}
                userAccountId={userAccountId}
                onRequestStandardOperationsReport={this.props.onRequestStandardOperationsReport}
              />
            ) : (
              <Investment isAdmin={false} currentUserId={userId} userAccountId={userAccountId} />
            )}
          </Row>
        </Card>
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    lastWireTransferRequest: state.wireTransferRequestsState.item,
    isWireTransferRequestLoading: state.wireTransferRequestsState.isLoading,
    isWireTransferRequestSuccess: state.wireTransferRequestsState.isSuccess,
    wireTransferRequestMessage: state.wireTransferRequestsState.message,
    isWireTransferRequestCompleted: state.wireTransferRequestsState.isCompleted,
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchGetUserAccountWireTransferRequests:
        wireTransferRequestOperations.fetchGetUserAccountWireTransferRequests,
      resetWireTransferRequestAfterRequest: wireTransferRequestOperations.resetAfterRequest,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces()(AccountInformation))
