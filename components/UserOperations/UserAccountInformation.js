import React, { PureComponent } from 'react';
import { Row, Col, Descriptions, Card, Icon, Button, Modal } from 'antd';
import _ from 'lodash';
import { withNamespaces } from 'react-i18next';

import { FormatCurrency, IsOperationPositive, StaticAmountBox } from '../../common/utils';
import ReferralForm from "./ReferralForm";
import { Investment, Market } from "./Operation";
import { ExportUserAccountsPDF } from './Operation/shared'

class AccountInformation extends PureComponent {

  state = {
    isReferralFormVisible: false
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.isReferralCompleted && nextProps.isReferralSuccess) {
      return {
        isReferralFormVisible: false
      }
    }

    return null
  }

  _onHandleShowForm = () => {
    this.setState( {
      isReferralFormVisible: !this.state.isReferralFormVisible
    } )
  }

  render() {
    const {t} = this.props;
    const userId = _.get( this.props, 'userAccount.user.id', 0 );
    const userAccountId = _.get( this.props, 'userAccount.id' );
    const accountValue = _.get( this.props, 'userAccount.accountValue', '0.00' );
    const accountType = _.get( this.props, 'userAccount.account.associatedOperation', 1 );
    const balanceInitial = _.get( this.props, 'userAccount.balanceInitial', '0.00' );

    const accountName = _.get( this.props, 'userAccount.account.name', '' );
    const accountPercentage = _.get( this.props, 'userAccount.account.percentage', '0' );

    const guaranteeOperation = _.get( this.props, 'userAccount.guaranteeOperation', '0.00' );
    const guaranteeCredits = _.get( this.props, 'userAccount.guaranteeCredits', '0.00' );
    const marginUsed = _.get( this.props, 'userAccount.marginUsed', '0.00' );
    const commissionByReference = _.get( this.props, 'userAccount.commissionByReference', '0.00' );

    const isOperationPositive = IsOperationPositive( accountValue, balanceInitial );

    return (
      <>
        <ExportUserAccountsPDF userAccount={this.props.userAccount} />
      <Card title={ `${t('accountInformation')}: ${ accountName }` } headStyle={ { backgroundColor: '#2D2D3B' } }
            bodyStyle={ { backgroundColor: '#0E0E0E' } } style={ { marginBottom: 20 } }
            className="account-detail">
        <Row style={ { marginBottom: 20 } }>
          <Col>
            <Descriptions title="">
              <Descriptions.Item label={t('accountType')}>{ accountName }</Descriptions.Item>
              {
                _.isEqual( accountType, 1 ) ? (
                  <Descriptions.Item label={t('profitCommission')}>{ accountPercentage } %</Descriptions.Item>
                ) : (
                  <Descriptions.Item label={t('interestType')}>{ accountPercentage } %</Descriptions.Item>
                )
              }

              {
                _.isEqual( accountType, 1 ) ? (
                  <Descriptions.Item
                    label={t('availableGuarantees')}>{ FormatCurrency.format( guaranteeOperation ) }</Descriptions.Item>

                ) : null
              }


              <Descriptions.Item
                label={t('guaranteesCredits')}>{ FormatCurrency.format( guaranteeCredits ) }</Descriptions.Item>
              {
                _.isEqual( accountType, 1 ) ? (
                  <>
                    <Descriptions.Item
                      label={`${t('marginUsed')} 10%`}>{ FormatCurrency.format( marginUsed ) }</Descriptions.Item>

                    <Descriptions.Item
                      label={t('commissionsByReference')}>{ FormatCurrency.format( commissionByReference ) }
                      <Button type="tertiary" style={ { marginLeft: 10, fontSize: 15 } } onClick={ this._onHandleShowForm }><Icon
                        type="solution"/> {t('btn referral')}</Button></Descriptions.Item>
                  </>
                ) : null
              }

            </Descriptions>

              <div>


              <Modal
                destroyOnClose={ true }
                footer={ null }
                onCancel={ this._onHandleShowForm }
                visible={ this.state.isReferralFormVisible }
                wrapClassName="referral-modal"
              >

                <ReferralForm
                  onAddReferral={ this.props.onAddReferral }
                  userAccount={ this.props.userAccount }
                  isReferralLoading={ this.props.isReferralLoading }
                  isReferralCompleted={ this.props.isReferralCompleted }
                  isReferralSuccess={ this.props.isReferralSuccess }
                  onCloseModal={this._onHandleShowForm}
                />


              </Modal>
              </div>

          </Col>
        </Row>
        <Row gutter={ 12 } style={ { marginBottom: 50 } }>
          <Col sm={ 24 } md={ 12 }>
            <Card className={ isOperationPositive ? 'positive-bg' : 'negative-bg' }>
              <StaticAmountBox
                title={t('accountValue')}
                value={ accountValue }
                icon={ isOperationPositive ? <Icon type="arrow-up"/> : <Icon type="arrow-down"/> }
              />
            </Card>
          </Col>
          <Col sm={ 24 } md={ 12 }>
            <Card className="neutral-bg">
              <StaticAmountBox
                title={t('initialAmount')}
                value={ balanceInitial }
                icon={ <Icon type="dollar"/> }
              />
            </Card>
          </Col>
        </Row>
        <Row>
          { _.isEqual( accountType, 1 ) ? (
            <Market
              isAdmin={ false }
              currentUserId={ userId }
              userAccountId={ userAccountId }
              onRequestStandardOperationsReport={ this.props.onRequestStandardOperationsReport }
            />
          ) : (
            <Investment
              isAdmin={ false }
              currentUserId={ userId }
              userAccountId={ userAccountId }
            />
          ) }
        </Row>
      </Card>

        </>
    );
  }
}

export default withNamespaces()(AccountInformation);
