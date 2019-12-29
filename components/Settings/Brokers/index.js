import React, { Component } from 'react';

import Broker from './broker';

import { connect } from 'react-redux';


class SettingsBroker extends Component {
  constructor(props) {
    super( props )
  }

  render() {
    return (
      <div>
        <Broker/>
      </div>
    );
  }
}

function mapStateToProps(state) {

  return {
    isAdmin: state.authState.isAdmin,
    isAuthenticated: state.authState.isAuthenticated,
  }
}

export default connect( mapStateToProps )( SettingsBroker );
