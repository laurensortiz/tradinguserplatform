import React, { PureComponent } from 'react';
import Link from '../components/Link';
import { Icon, Menu } from "antd";

const MenuItem = Menu.Item;

class NavPrivate extends PureComponent {

  render() {
    return (
      <ul className="main-menu"
      >
        <li>
          <Link className="menu-item" href="/users"><Icon type="user" /> <span>Usuarios</span></Link>
        </li>
        <li>
          <Link className="menu-item" href="/accounts"><Icon type="branches" /> <span>Cuentas</span></Link>
        </li>
        <li>
          <Link className="menu-item" href="/operations"><Icon type="area-chart" /> <span>Operaciones</span></Link>
        </li>
        <li>
          <Link className="menu-item" href="/settings"><Icon type="setting" /> <span>Ajustes</span></Link>
        </li>
        <li>
          <Link className="menu-item" onClick={ this.props.onLogout } href="/"><Icon type="logout"/> <span>Salir</span></Link>
        </li>
      </ul>
    );
  }
}

export default NavPrivate;
