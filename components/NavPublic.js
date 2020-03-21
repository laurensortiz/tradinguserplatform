import React, { PureComponent } from 'react';
import { Menu, Icon } from 'antd';

import Link from '../components/Link';
import Anchor from '../components/Anchor';

const MenuItem = Menu.Item;

class NavPublic extends PureComponent {

  render() {
    return (

      <ul className="main-menu"
      >
        <li>
          <Anchor className="menu-item" href="/market"><Icon type="sliders"/> <span>Mercado</span></Anchor>
        </li>
        <li>
          <Anchor className="menu-item" href="/calendar"><Icon type="fund"/> <span>Calendario Económico</span></Anchor>
        </li>
        <li>
          <Link className="menu-item" href="/operations"><Icon type="area-chart" /> <span>Operaciones</span></Link>
        </li>
        <li>
          <Link className="menu-item" onClick={ this.props.onLogout } href="/"><Icon type="logout"/> <span>Salir</span></Link>
        </li>
      </ul>
    );
  }
}

export default NavPublic;
