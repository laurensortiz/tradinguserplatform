import React, {Component} from 'react';
import {Layout} from 'antd';

const {Footer} = Layout;

export default class MainFooter extends Component {
  render() {
    return (
      <Footer style={{ textAlign: 'center' }}>
        © {(new Date()).getFullYear()} Web Trader All rights reserved
      </Footer>
    );
  }
}