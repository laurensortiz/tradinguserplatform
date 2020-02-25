import React, { PureComponent } from 'react';
import { Menu, Icon } from 'antd';

import Link from '../components/Link';
import Anchor from '../components/Anchor';

const MenuItem = Menu.Item;

class NavPublic extends PureComponent {

  render() {
    return (
      <Menu
        theme="dark"
        mode="horizontal"
      >
        <MenuItem>
          <Anchor href="/market"><Icon type="hourglass"/> <span>Mercado</span></Anchor>
        </MenuItem>
        <MenuItem>
          <Anchor href="/calendar"><Icon type="hourglass"/> <span>Calendario Económico</span></Anchor>
        </MenuItem>
        <MenuItem>
          <Link href="/operations"><Icon type="hourglass"/> <span>Operaciones</span></Link>
        </MenuItem>
        <MenuItem>
          <Link onClick={ this.props.onLogout }><Icon type="logout"/> <span>Salir</span></Link>
        </MenuItem>
      </Menu>
    );
  }
}

export default NavPublic;
