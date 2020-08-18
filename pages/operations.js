import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Row, Col, Button, Radio, Icon } from 'antd';
import _ from 'lodash';

import Document from '../components/Document';

import { Investment, Market } from '../components/Operation';
import { userAccountOperations } from "../state/modules/userAccounts";

class Operations extends Component {
  state = {
    operationType: 'market',
    isFormVisible: false,
  };

  _onSelectOperationType = ({ target }) => {
    this.setState( {
      operationType: target.value,
    } );
  };

  _handleFormDisplay = (isFormVisible) => {
    this.setState( {
      isFormVisible
    } )
  };

  render() {

    return (
      <Document id="userOperations-page">
        { this.props.isAdmin ? (
          <>
            <Row style={{marginBottom:30}}>
              <Radio.Group
                defaultValue={ this.state.operationType }
                size="large"
                style={ { float: 'left' } }
                onChange={ this._onSelectOperationType }
                buttonStyle="solid"
              >
                <Radio.Button value="market"><Icon type="sliders"/> Bolsa OTC</Radio.Button>
                <Radio.Button value="investment"> <Icon type="fund"/> Fondo de Interés</Radio.Button>
              </Radio.Group>
              <Button style={ { float: 'right' } } type="primary" onClick={ () => this._handleFormDisplay( true ) } size="large">
                <Icon type="plus-circle" /> Agregar Operación
              </Button>
            </Row>
            <Row>
              <Col>
              {
                _.isEqual( this.state.operationType, 'market' ) ? (
                  <Market
                    isFormVisible={ _.isEqual( this.state.operationType, 'market' ) && this.state.isFormVisible }
                    onClose={ this._handleFormDisplay }
                    handleFormVisible={ this._handleFormDisplay }
                    isAdmin={ true }
                  />
                ) : (
                  <Investment
                    isFormVisible={ _.isEqual( this.state.operationType, 'investment' ) && this.state.isFormVisible }
                    onClose={ this._handleFormDisplay }
                    handleFormVisible={ this._handleFormDisplay }
                    isAdmin={ true }
                  />
                )
              }
              </Col>
            </Row>
          </>
        ) : null }


      </Document>
    );
  }
}

function mapStateToProps(state) {

  return {
    isAdmin: state.authState.isAdmin,

  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {}, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Operations );
