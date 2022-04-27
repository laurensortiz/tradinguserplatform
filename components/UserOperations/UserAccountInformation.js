import React, { PureComponent } from 'react'
import { Row, Col, Descriptions, Card, Icon, Button, Modal, Tooltip, Tag } from 'antd'
import _ from 'lodash'
import { withNamespaces } from 'react-i18next'
import moment from 'moment-timezone'
import styled from 'styled-components'

import { FormatCurrency, IsOperationPositive, StaticAmountBox } from '../../common/utils'
import ReferralForm from './ReferralForm'
import WireTransferRequestForm from './WireTransferRequestForm'
import { Investment, Market, Fund } from './Operation'
import { ExportUserAccountsPDF } from './Operation/shared'
import { bindActionCreators } from 'redux'
import { wireTransferRequestOperations } from '../../state/modules/wireTransferRequests'
import { connect } from 'react-redux'
import FundTable from './Operation/Fund/FundTable'

const TagDate = styled(Tag)`
  margin-left: 15px;
`

const getTotalMonthsFromDate = (date) => {
  const dayBetween = moment(date).daysInMonth() < 31 ? -1 : 0
  const userStartDate = moment(date)
    .add(dayBetween, 'days')
    .utc(0)
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
  const today = moment().utc(0).set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

  return parseInt(moment.duration(today.diff(userStartDate)).asMonths())
}

const IS_WEEKEND =
  moment(new Date()).tz('America/New_York').day() === 6 ||
  moment(new Date()).tz('America/New_York').day() === 0

const isBetweenAfterHours = () => {
  let start = moment('19:00', 'H:mm')
  let end = moment('07:30', 'H:mm')
  let serverHours = moment().tz('America/New_York').format('H:mm')
  let server = moment(serverHours, 'H:mm')
  return (
    (server >= start && server <= moment('23:59:59', 'h:mm:ss')) ||
    (server >= moment('0:00:00', 'h:mm:ss') && server < end)
  )
}

class AccountInformation extends PureComponent {
  state = {
    isReferralFormVisible: false,
    isWireTransferRequestFormVisible: false,
    isUserWireTransferAvailable: true,
    lastWireTransferRequestDate: null,
    hasFetchedLastRequest: false,
    isWireTransferRequestAddCompleted: false,
    lastWireTransferRequestAssociatedOperation: '',
    hasInitRequiredMonthsCompleted: false,
    hasOneMonthHoldCompleted: true,
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
        isUserWireTransferAvailable:
          nextProps.userAccount.account.associatedOperation !==
          prevState.lastWireTransferRequestAssociatedOperation,
      })
    }

    if (nextProps.userAccount && prevState.isUserWireTransferAvailable) {
      const userDate =
        moment(nextProps.userAccount.user.startDate).format('M') < 3
          ? moment(nextProps.userAccount.user.startDate).add(-1, 'days').format()
          : nextProps.userAccount.user.startDate
      const getTotalMonths = getTotalMonthsFromDate(userDate)

      const isProfitMonthAccount = nextProps.userAccount.account.associatedOperation === 2
      const isOldUser = moment(nextProps.userAccount.user.startDate).isBefore('2020-12-15', 'day')
      const requiredHoldTime = isProfitMonthAccount ? 1 : isOldUser ? 0 : 6

      _.assignIn(updatedState, {
        hasInitRequiredMonthsCompleted: getTotalMonths >= requiredHoldTime,
        isUserWireTransferAvailable: getTotalMonths >= requiredHoldTime,
      })
    }

    if (
      nextProps.lastWireTransferRequest &&
      Object.keys(nextProps.lastWireTransferRequest).length > 0
    ) {
      const { createdAt, associatedOperation } = nextProps.lastWireTransferRequest
      const getTotalMonths = getTotalMonthsFromDate(createdAt)

      _.assignIn(updatedState, {
        hasOneMonthHoldCompleted: getTotalMonths > 0,
        isUserWireTransferAvailable:
          associatedOperation !== nextProps.userAccount.account.associatedOperation &&
          getTotalMonths > 0,
        lastWireTransferRequestDate: createdAt,
        lastWireTransferRequestAssociatedOperation: associatedOperation,
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

  _isWireTransferBtnDisabled = () => {
    const isProfitMonth = this.props.userAccount.account.associatedOperation === 2
    if (isProfitMonth) {
      return false
    } else {
      return (
        (!this.state.hasInitRequiredMonthsCompleted || !this.state.hasOneMonthHoldCompleted) &&
        !this.state.isUserWireTransferAvailable
      )
    }
  }

  _getLastRequestInfo = () =>
    !!this.state.lastWireTransferRequestDate && (
      <TagDate>
        {`  ${this.props.t('wt lastRequestDate')}:  `}

        {moment(this.state.lastWireTransferRequestDate)
          .tz('America/New_York')
          .format('DD-MM-YYYY hh:mm a')}
      </TagDate>
    )

  _getHeaderCard = (isUserBlocked, forceEnableUserWT, accountType, username) => {

    if(accountType === 3 && username !== 'cgvedia180781516') {
      return null
    }
    if (forceEnableUserWT) {
      return (
        <Button onClick={this._onHandleShowWireTransferForm}>
          <Icon type="dollar" /> Withdraw Dividends Request
        </Button>
      )
    }
    const wireTransferBtn = !isUserBlocked ? (
      <Button
        onClick={this._onHandleShowWireTransferForm}
        disabled={IS_WEEKEND || !!this._isWireTransferBtnDisabled()}
      >
        <Icon type="dollar" /> Withdraw Dividends Request
      </Button>
    ) : (
      <Button disabled={true}>
        <Icon type="dollar" /> Withdraw Dividends Request
      </Button>
    )
    const disableText = IS_WEEKEND
      ? this.props.t('wt disabledWeekendBtn')
      : this.props.t('wt disabledBtn')

    return !IS_WEEKEND && !this._isWireTransferBtnDisabled() ? (
      <>
        {wireTransferBtn} {this._getLastRequestInfo()}
      </>
    ) : (
      <>
        <Tooltip placement="leftTop" title={disableText}>
          {wireTransferBtn}
        </Tooltip>
        {this._getLastRequestInfo()}
      </>
    )



  }

  _getHeaderCardHoliday = () => {
    return (
      <Tooltip placement="leftTop" title={this.props.t('wt disabledBtnHoliday')}>
        <Button disabled>
          <Icon type="dollar" /> Withdraw Dividends Request
        </Button>
      </Tooltip>
    )
  }

  _getHeaderCardAfterHours = (isUserBlocked) => {
    return !isUserBlocked ? (
      <>
        <Tooltip placement="leftTop" title={this.props.t('wt disabledBtnAfterHours')}>
          <Button disabled>
            <Icon type="dollar" /> Withdraw Dividends Request
          </Button>
        </Tooltip>
        {this._getLastRequestInfo()}
      </>
    ) : (
      <Button disabled>
        <Icon type="dollar" /> Withdraw Dividends Request
      </Button>
    )
  }

  _onWireTransferRequest = (data) => {
    this.setState({
      lastWireTransferRequestAssociatedOperation: data.associatedOperation,
    })
    this.props.onWireTransferRequest(data)
  }

  render() {
    const { t } = this.props
    const userId = _.get(this.props, 'userAccount.user.id', 0)
    const username = _.get(this.props, 'userAccount.user.username', '')
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

    const isOutBusinessHours = isBetweenAfterHours()

    const isUserBlocked = ['eflores1807818098', 'iflores180781685', 'lflores180781636'].includes(
      username
    )

    const forceEnableUserWT = [].includes(username)

    const isUserReferralBlocked = ['pjijon180781942', 'pablojijol807810185'].includes(username)

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
              <Descriptions
                title={
                  !_.isEqual(accountType, 4)
                    ? isOutBusinessHours
                      ? this._getHeaderCardAfterHours(isUserBlocked)
                      : this._getHeaderCard(isUserBlocked, forceEnableUserWT, accountType, username)
                    : null
                }
              >
                <Descriptions.Item label={t('accountType')}>{accountName}</Descriptions.Item>
                {_.isEqual(accountType, 1) ? (
                  <Descriptions.Item label={t('profitCommission')}>
                    {accountPercentage} %
                  </Descriptions.Item>
                ) : _.isEqual(accountType, 2) ? (
                  <Descriptions.Item label={t('interestType')}>
                    {accountPercentage} %
                  </Descriptions.Item>
                ) : null}

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
                        disabled={isUserReferralBlocked}
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
                    onWireTransferRequest={this._onWireTransferRequest}
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
            {_.isEqual(accountType, 1) && (
              <Market
                isAdmin={false}
                currentUserId={userId}
                userAccountId={userAccountId}
                onRequestStandardOperationsReport={this.props.onRequestStandardOperationsReport}
              />
            )}
            {_.isEqual(accountType, 2) && (
              <Investment isAdmin={false} currentUserId={userId} userAccountId={userAccountId} />
            )}
            {_.isEqual(accountType, 3) && (
              <Fund isAdmin={false} currentUserId={userId} userAccountId={userAccountId} />
            )}
          </Row>
        </Card>
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    isWireTransferRequestLoading: state.wireTransferRequestsState.isLoading,
    isWireTransferRequestSuccess: state.wireTransferRequestsState.isSuccess,
    wireTransferRequestMessage: state.wireTransferRequestsState.message,
    isWireTransferRequestCompleted: state.wireTransferRequestsState.isCompleted,
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      resetWireTransferRequestAfterRequest: wireTransferRequestOperations.resetAfterRequest,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces()(AccountInformation))
