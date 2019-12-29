import React, { PureComponent } from 'react';
import { Menu, Icon } from 'antd';

import Link from '../components/Link';

const MenuItem = Menu.Item;

class NavPublic extends PureComponent {

  render() {
    return (
      <Menu
        theme="dark"
        mode="horizontal"
      >
        <MenuItem>
          <Link href="/market"><Icon type="hourglass"/> <span>Mercado</span></Link>
        </MenuItem>
        <MenuItem>
          <Link href="/calendar"><Icon type="hourglass"/> <span>Calendario Económico</span></Link>
        </MenuItem>
        <MenuItem>
          <Link href="/account"><Icon type="hourglass"/> <span>Cuenta</span></Link>
        </MenuItem>
        <MenuItem>
          <Link onClick={ this.props.onLogout }><Icon type="logout"/> <span>Salir</span></Link>
        </MenuItem>
      </Menu>
    );
  }
}

export default NavPublic;
