import React, { Component } from 'react';

import Page from './page';

import { connect } from 'react-redux';


class SettingsPage extends Component {
  constructor(props) {
    super( props )
  }

  render() {
    return (
      <div>
        <Page/>
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

export default connect( mapStateToProps )( SettingsPage );
