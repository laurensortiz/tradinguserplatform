import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { PageHeader, Row, Col } from 'antd';

import Document from '../components/Document';

class Calendar extends Component {

  render() {

    return (
      <Document>
        <PageHeader
          title="Calendario Económico"
          avatar={ { src: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4' } }
        />
        <Row>
          <Col>
          </Col>
        </Row>
      </Document>
    );
  }
}

function mapStateToProps(state) {


  return {}
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {}, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Calendar );
