import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Row, Col, Button, Radio, Icon } from 'antd'
import _ from 'lodash'

import Document from '../components/Document'

import { Investment, Market, Fund } from '../components/Operation'

class Operations extends Component {
  state = {
    operationType: 'market',
    isFormVisible: false,
  }

  _onSelectOperationType = ({ target }) => {
    this.setState({
      operationType: target.value,
    })
  }

  _handleFormDisplay = (isFormVisible) => {
    this.setState({
      isFormVisible,
    })
  }

  render() {
    return (
      <Document id="userOperations-page">
        {this.props.isAdmin ? (
          <>
            <Row style={{ marginBottom: 30 }}>
              <Radio.Group
                defaultValue={this.state.operationType}
                size="large"
                style={{ float: 'left' }}
                onChange={this._onSelectOperationType}
                buttonStyle="solid"
              >
                <Radio.Button value="market">
                  <Icon type="sliders" /> Bolsa OTC
                </Radio.Button>
                <Radio.Button value="investment">
                  {' '}
                  <Icon type="bank" /> Fondo de Interés
                </Radio.Button>
                <Radio.Button value="fund">
                  {' '}
                  <Icon type="fund" /> Funds
                </Radio.Button>
              </Radio.Group>
              <Button
                style={{ float: 'right' }}
                type="primary"
                onClick={() => this._handleFormDisplay(true)}
                size="large"
              >
                <Icon type="plus-circle" /> Agregar Operación
              </Button>
            </Row>
            <Row>
              <Col>
                {_.isEqual(this.state.operationType, 'market') && (
                  <Market
                    isFormVisible={this.state.isFormVisible}
                    onClose={this._handleFormDisplay}
                    handleFormVisible={this._handleFormDisplay}
                    isAdmin={true}
                  />
                )}
                {_.isEqual(this.state.operationType, 'investment') && (
                  <Investment
                    isFormVisible={this.state.isFormVisible}
                    onClose={this._handleFormDisplay}
                    handleFormVisible={this._handleFormDisplay}
                    isAdmin={true}
                  />
                )}
                {_.isEqual(this.state.operationType, 'fund') && (
                  <Fund
                    isFormVisible={this.state.isFormVisible}
                    onClose={this._handleFormDisplay}
                    handleFormVisible={this._handleFormDisplay}
                    isAdmin={true}
                  />
                )}
              </Col>
            </Row>
          </>
        ) : null}
      </Document>
    )
  }
}

function mapStateToProps(state) {
  return {
    isAdmin: state.authState.isAdmin,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Operations)
