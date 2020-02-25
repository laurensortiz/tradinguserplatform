import React, { Component } from 'react';

import Commodity from './commodity';

import { connect } from 'react-redux';


class SettingsCommodity extends Component {
  constructor(props) {
    super( props )
  }

  render() {
    return (
      <div>
        <Commodity/>
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

export default connect( mapStateToProps )( SettingsCommodity );
