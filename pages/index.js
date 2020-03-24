import React, { Component } from 'react';
import Router from 'next/router'
import { connect } from 'react-redux';
import { Row, Col } from 'antd';

import Document from '../components/Document';
import AuthLoginForm from '../components/AuthLoginForm';

class Index extends Component {

  componentDidMount() {
    const video = document.getElementById( "intro-video" );
    if (video) video.playbackRate = .2;
  }

  renderLoggedIn = () => {
    if (process.browser) {
      Router.push( '/operations' )
    }

  };

  renderLoggedOut = () => {
    return (
      <Row align="middle" type="flex" justify="center" className="login-container">

        <Col xs={ 24 } md={ 12 } lg={ 12 } className="login-form">
          <AuthLoginForm/>
        </Col>
      </Row>
    );
  };

  render() {

    let subview = !this.props.isAuthenticated
      ? this.renderLoggedOut()
      : this.renderLoggedIn();

    return <Document>{ subview }</Document>;
  }
}

function mapStateToProps(state) {

  return {
    auth: state.authState,
    isAuthenticated: state.authState.isAuthenticated,
    isFailure: state.authState.isFailure,
    isLoading: state.authState.isLoading,
    isSessionExpired: state.authState.isSessionExpired,
  }
}

export default connect( mapStateToProps )( Index );
