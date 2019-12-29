import React, {Component} from 'react';
import {Layout} from 'antd';

const {Footer} = Layout;

export default class MainFooter extends Component {
  render() {
    return (
      <Footer style={{ textAlign: 'center' }}>
        © 2019 Web Trader All rights reserved | Created by LobCode
      </Footer>
    );
  }
}