import React, { PureComponent } from 'react'
import Link from '../components/Link'
import { Icon } from 'antd'
import { withNamespaces } from 'react-i18next'

class NavPrivate extends PureComponent {
  render() {
    return (
      <>
        <ul className="main-menu">
          <li>
            <Link className="menu-item" href="/daily-technical-report">
              <Icon type="global" /> <span>DTR</span>
            </Link>
          </li>
          <li>
            <Link className="menu-item" href="/users">
              <Icon type="user" /> <span>Usuarios</span>
            </Link>
          </li>
          <li>
            <Link className="menu-item" href="/accounts">
              <Icon type="branches" /> <span>Cuentas</span>
            </Link>
          </li>
          <li>
            <Link className="menu-item" href="/operations">
              <Icon type="area-chart" /> <span>Operaciones</span>
            </Link>
          </li>
          <li>
            <Link className="menu-item" href="/referrals">
              <Icon type="solution" /> <span>Referrals</span>
            </Link>
          </li>
          <li>
            <Link className="menu-item" href="/wire-transfer-requests">
              <Icon type="dollar" /> <span>WireTransfer</span>
            </Link>
          </li>
          <li>
            <Link className="menu-item" href="/settings">
              <Icon type="setting" /> <span>Ajustes</span>
            </Link>
          </li>
          <li>
            <Link className="menu-item" onClick={this.props.onLogout} href="/">
              <Icon type="logout" />
              <span>Salir</span>
            </Link>
          </li>
        </ul>
      </>
    )
  }
}

export default withNamespaces()(NavPrivate)
