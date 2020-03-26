import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Skeleton } from 'antd';
import _ from 'lodash';
import InnerHTML from 'dangerously-set-html-content'

import Document from '../components/Document';

import { pageOperations } from "../state/modules/pages";


class Pages extends Component {
  state = {
    page: {
      name: '',
      content: '',
    },
    updated: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {};

    if (!_.isEqual(nextProps.page, prevState.page)) {
     _.assignIn(updatedState, {
       page: nextProps.page
     })


    }

    return !_.isEmpty(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    this.props.fetchGetPage(2);

  };


  render() {

    console.log(this.state.updated);
    return (
      <Document className="static-page">
        <Skeleton active loading={this.props.isLoading}>
          {
            (!_.isEmpty(this.state.page.content)) ? (
              <InnerHTML html={`${this.state.page.content}`} />
            ) : null
          }

        </Skeleton>

      </Document>
    );
  }
}

function mapStateToProps(state) {
  return {
    page: state.pagesState.item,
    isLoading: state.pagesState.isLoading,
    isSuccess: state.pagesState.isSuccess,
    isFailure: state.pagesState.isFailure,
    message: state.pagesState.message,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetPage: pageOperations.fetchGetPage,
    fetchAddPage: pageOperations.fetchAddPage,
    fetchEditPage: pageOperations.fetchEditPage,
    fetchDeletePage: pageOperations.fetchDeletePage,
    resetAfterRequest: pageOperations.resetAfterRequest,
  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Pages );
