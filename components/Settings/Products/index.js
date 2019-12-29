import React, { Component } from 'react';
import { connect } from 'react-redux';

import Products from './Products';

class SettingsProjects extends Component {
  constructor(props) {
    super( props )
  }

  render() {
    return (
      <div>
        <Products/>
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
