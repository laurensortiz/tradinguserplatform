import React, {Component} from 'react';
import {Layout} from 'antd';

const {Footer} = Layout;

export default class MainFooter extends Component {
  render() {
    return (
      <Footer style={{ textAlign: 'center' }}>
        © 2020 Web Trader All rights reserved
      </Footer>
    );
  }
}