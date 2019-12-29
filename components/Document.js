import React, { Component } from 'react';
import { Layout, Menu, Icon, } from 'antd';

import Head from 'next/head';

import Header from './MainHeader';
import Footer from './MainFooter';

import "../styles/main.scss";

const { Content, Sider } = Layout;


class Document extends Component {
  state = {
    collapsed: true,
  };

  static defaultProps = {
    title: 'Web Trader',
    description:
      '',
  };

  onCollapse = collapsed => {
    this.setState( { collapsed } );
  };

  render() {
    return (
      <React.Fragment>
        <Head>
          <title>{ this.props.title }</title>
          <meta name="description" content={ this.props.description }/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta charSet="UTF-8"/>
          <meta name="sourceApp" content="mobileWeb"/>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
          <meta property="og:locale" content="en_US"/>
          <meta property="og:type" content="website"/>
          <link rel="shortcut icon" href="/static/favicon.png"/>
          <link href="https://fonts.googleapis.com/css?family=Abel&display=swap" rel="stylesheet"/>

        </Head>
        <Layout className="dark-mode" style={ { minHeight: '100vh' } } id={ this.props.id || 'main-page' }>
          <Header/>
          <Sider collapsible collapsed={ this.state.collapsed } onCollapse={ this.onCollapse }>
            <Header/>
          </Sider>
          <Layout>
            <Content style={ { padding: '0 50px', marginTop: 80 } }>
              <div className="main-container">
                { this.props.children }
              </div>
            </Content>

            <Footer/>
          </Layout>
        </Layout>
      </React.Fragment>
    );
  }
}

export default Document;
