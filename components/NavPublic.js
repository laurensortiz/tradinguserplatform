import React, { PureComponent } from 'react'
import { Icon, Badge } from 'antd'
import { withNamespaces } from 'react-i18next'

import Link from '../components/Link'
import LangSelector from './LangSelector'

class NavPublic extends PureComponent {
  render() {
    const { t } = this.props

    return (
      <ul className="main-menu">
        <li>
          <Link className="menu-item" href="/metatrader">
            <Icon type="sliders" />{' '}
            <span>
              MetaTrader 5{' '}
              <Badge
                count="Nuevo"
                style={{
                  backgroundColor: '#1653d1',
                  fontSize: 10,
                  height: 18,
                  lineHeight: 2,
                  top: -3,
                  color: '#fff',
                  letterSpacing: 1,
                }}
              />
            </span>
          </Link>
        </li>
        <li>
          <Link className="menu-item" href="/daily-technical-report">
            <Icon type="global" />{' '}
            <span>
              {t('mainMenu dailyTechnicalReport')}

              <Badge
                count="Nuevo"
                style={{
                  backgroundColor: '#1653d1',
                  fontSize: 10,
                  height: 18,
                  lineHeight: 2,
                  top: -3,
                  left: 5,
                  color: '#fff',
                  letterSpacing: 1,
                }}
              />
            </span>
          </Link>
        </li>
        <li>
          <Link className="menu-item" href="/market">
            <Icon type="stock" /> <span>{t('mainMenu market')}</span>
          </Link>
        </li>
        <li>
          <Link className="menu-item" href="/calendar">
            <Icon type="fund" /> <span>{t('mainMenu economicCalendar')}</span>
          </Link>
        </li>
        <li>
          <Link className="menu-item" href="/user-operations">
            <Icon type="area-chart" /> <span>{t('mainMenu operations')}</span>
          </Link>
        </li>
        <li>
          <Link className="menu-item" onClick={this.props.onLogout} href="/">
            <Icon type="logout" /> <span>{t('mainMenu logout')}</span>
          </Link>
        </li>
        <li>
          <LangSelector />
        </li>
      </ul>
    )
  }
}

export default withNamespaces()(NavPublic)
