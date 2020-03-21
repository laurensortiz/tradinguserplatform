import React, { Component } from 'react';
import { Layout, Menu, Icon, } from 'antd';
import Router from "next/router";
import _ from 'lodash';
import classNames from 'classnames';

import Head from 'next/head';

import Header from './MainHeader';
import Footer from './MainFooter';
import PageLoader from './PageLoader';

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
    const isLoginPage = _.isEqual(_.get(Router, 'router.route'), '/')

    return (
      <React.Fragment>
        <Head>
          <title>{ this.props.title }</title>
          <link rel="manifest" href="manifest.json" />
          <meta name="description" content={ this.props.description }/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta charSet="UTF-8"/>
          <meta name="sourceApp" content="mobileWeb"/>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
          <meta property="og:locale" content="en_US"/>
          <meta property="og:type" content="website"/>
          <link rel="shortcut icon" href="/static/favicon.png"/>
          <link href="https://fonts.googleapis.com/css?family=Roboto:300,700&display=swap" rel="stylesheet" />
        </Head>
        <Layout className={classNames(`dark-mode ${this.props.className || ''}`, {'login-page' : isLoginPage})} style={ { minHeight: '100vh' } } id={ this.props.id || 'main-page' } >
          {isLoginPage ? (
            <>
            <video
              id="intro-video"
              src="./static/bg-intro-video.mp4"
              poster="./static/bg-intro.gif"
              autoPlay={true} loop={true} className="intro-video" playbackRate="0.5"
              style={{position: 'fixed', top:0, left:0, right:0, bottom:0, minWidth: '100%', minHeight: '100%', opacity: .2, zIndex:0}}
            />
            <div className="page-loader">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
              viewBox="0 0 70 70" enableBackground="new 0 0 0 0">
              <rect x="20" y="20" width="6" height="13" fill="#87d068">
              <animateTransform attributeType="xml"
              attributeName="transform" type="translate"
              values="0 0; 0 20; 0 0"
              begin="0" dur="0.6s" repeatCount="indefinite"/>
              </rect>
              <rect x="30" y="20" width="6" height="13" fill="#f50">
              <animateTransform attributeType="xml"
              attributeName="transform" type="translate"
              values="0 0; 0 20; 0 0"
              begin="0.2s" dur="0.6s" repeatCount="indefinite"/>
              </rect>
              <rect x="40" y="20" width="6" height="13" fill="#87d068">
              <animateTransform attributeType="xml"
              attributeName="transform" type="translate"
              values="0 0; 0 20; 0 0"
              begin="0.4s" dur="0.6s" repeatCount="indefinite"/>
              </rect>
              </svg>
            </div>
            </>
          ) : null}
          <Header/>
          <Layout>
            <Content>
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
