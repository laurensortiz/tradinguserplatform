import React, { Component } from 'react';

import AssetClass from './assetClass';

import { connect } from 'react-redux';


class SettingsAssetClass extends Component {
  constructor(props) {
    super( props )
  }

  render() {
    return (
      <div>
        <AssetClass/>
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

export default connect( mapStateToProps )( SettingsAssetClass );
