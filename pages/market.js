import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Skeleton } from 'antd';
import _ from 'lodash';
import videojs from 'video.js';

import Document from '../components/Document';

import { pageOperations } from "../state/modules/pages";
import InnerHTML from "dangerously-set-html-content";


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
    this.props.fetchGetPage(1);
    this.player = videojs(this.videoNode, {
      autoplay: true,
      controls: true,
    }, function onPlayerReady() {
      console.log('onPlayerReady', this)
    });

  };
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }

  render() {

    return (
      <Document className="static-page">
        <div className="news-container">
          <h2>Noticias en vivo <span></span></h2>
          <div data-vjs-player>
            <video ref={ node => this.videoNode = node } className="video-js" width="100%" height="500">
              <source type="application/x-mpegURL"
                      src="https://liveproduseast.global.ssl.fastly.net/btv/desktop/us_live.m3u8" />
            </video>
          </div>
        </div>


        <Skeleton active loading={this.props.isLoading}>
          {
            (!_.isEmpty(this.state.page.content)) ? (
              <div className="widget-box-container">
                <InnerHTML html={`${this.state.page.content}`} />
              </div>

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
