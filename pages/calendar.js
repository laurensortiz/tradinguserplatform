import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {Row, Col}  from 'antd';

import Document from '../components/Document';



class Calendar extends Component {


  render() {


    return (
      <Document>
        <Row>
          <Col>

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


export default connect( mapStateToProps, mapDispatchToProps )( Calendar );
