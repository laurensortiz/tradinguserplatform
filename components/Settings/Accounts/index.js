import React, { Component } from 'react';
import { connect } from 'react-redux';

import Accounts from './Accounts';

class SettingsProjects extends Component {
  constructor(props) {
    super( props )
  }

  render() {
    return (
      <div>
        <Accounts/>
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

export default connect( mapStateToProps )( SettingsProjects );
