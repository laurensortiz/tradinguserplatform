import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { Layout } from 'antd';

import Link from '../components/Link';
import NavPublic from './NavPublic';
import NavPrivate from './NavPrivate';
import { authOperations } from "../state/modules/auth";

const { Header } = Layout;

class MainHeader extends Component {

  state = {
    isAdmin: false,
    isAuthenticated: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let stateUpdated = {};
    if (!_.isEqual( nextProps.isAdmin, prevState.isAdmin )) {
      stateUpdated.isAdmin = nextProps.isAdmin
    }

    if (!_.isEqual( nextProps.isAuthenticated, prevState.isAuthenticated )) {
      stateUpdated.isAuthenticated = nextProps.isAuthenticated
    }

    return !_.isEmpty( stateUpdated ) ? stateUpdated : null;

  }

  _onLogout = () => {
    this.props.logout();
  };

  render() {
    const { isAdmin, isAuthenticated } = this.state;
    return (
      <Header className="main-header">
        <div className="logo">
          <Link href="/operations">
            <img className="desktop" src="/static/logo_web_trader.png" alt=""/>
            <img className="mobile" src="/static/logo_web_trader_small.png" alt=""/>
          </Link>
        </div>
        { isAuthenticated ?
          isAdmin ? (
            <NavPrivate onLogout={ this._onLogout }/>
          ) : (
            <NavPublic onLogout={ this._onLogout }/>
          )
          : null }
      </Header>
    );
  }
}

function mapStateToProps(state) {
  const { authState } = state;
  return {
    isAdmin: authState.isAdmin,
    isAuthenticated: authState.isAuthenticated,
    isSuccess: authState.isSuccess,
    isSessionExpired: authState.isSessionExpired,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    logout: authOperations.logout,
  }, dispatch );

export default connect( mapStateToProps, mapDispatchToProps )( MainHeader );
