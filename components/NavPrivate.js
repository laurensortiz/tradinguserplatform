import React, { PureComponent } from 'react';
import Link from '../components/Link';
import { Icon, Menu } from "antd";

const MenuItem = Menu.Item;

class NavPrivate extends PureComponent {

  render() {
    return (
      <Menu
        theme="dark"
        mode="horizontal"
      >
        <MenuItem>
          <Link href="/users"><Icon type="user" /> <span>Usuarios</span></Link>
        </MenuItem>
        <MenuItem>
          <Link href="/accounts"><Icon type="branches" /> <span>Cuentas</span></Link>
        </MenuItem>
        <MenuItem>
          <Link href="/operations"><Icon type="area-chart" /> <span>Operaciones</span></Link>
        </MenuItem>

        <MenuItem>
          <Link href="/settings"><Icon type="setting" /> <span>Ajustes</span></Link>
        </MenuItem>
        <MenuItem>
          <Link onClick={ this.props.onLogout }><Icon type="logout"/> <span>Salir</span></Link>
        </MenuItem>
      </Menu>
    );
  }
}

export default NavPrivate;
