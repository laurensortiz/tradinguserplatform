import React, { Component } from 'react'
import { Layout } from 'antd'

const { Footer } = Layout

export default class MainFooter extends Component {
  render() {
    return (
      <Footer style={{ textAlign: 'center' }}>
        © {new Date().getFullYear()} Web trader All Rights reserved - Royal Capital LTD
      </Footer>
    )
  }
}
