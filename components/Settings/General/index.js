import React, { Component } from 'react';
import { connect } from 'react-redux';

import General from './General';

class SettingsGeneral extends Component {
  constructor(props) {
    super( props )
  }

  render() {
    return (
      <div>
        <General/>
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

export default connect( mapStateToProps )( SettingsGeneral );
