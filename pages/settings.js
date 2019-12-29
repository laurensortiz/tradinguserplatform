import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { Row, Col, Tabs } from 'antd';
import Document from '../components/Document';
//import SettingsUsers from '../components/Settings/Users';
import SettingsProducts from '../components/Settings/Products';
import SettingsBrokers from '../components/Settings/Brokers';
import SettingsAccounts from '../components/Settings/Accounts';

const { TabPane } = Tabs;

class Settings extends Component {
  state = {
    isLoading: false,
  };
  render() {
    return (
      <Document>
        <Row>
          <Col>
            <Tabs tabPosition="left" defaultActiveKey="2">
              {/*<TabPane tab="Usuarios" key="1">*/}
              {/*  <SettingsUsers />*/}
              {/*</TabPane>*/}
              <TabPane tab="Productos" key="2">
                <SettingsProducts />
              </TabPane>
              <TabPane tab="Corredores" key="3">
                <SettingsBrokers />
              </TabPane>
              <TabPane tab="Cuentas" key="4">
                <SettingsAccounts />
              </TabPane>


            </Tabs>
          </Col>
        </Row>
      </Document>
    );
  }
}

function mapStateToProps(state) {
  return {

  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {

  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Settings );
