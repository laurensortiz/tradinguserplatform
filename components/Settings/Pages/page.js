import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { Button, Table, Popconfirm, Alert, Input, Card, Icon, Switch,Tabs } from 'antd';
import _ from 'lodash';
import uuidv1 from 'uuid/v1';
import InnerHTML from "dangerously-set-html-content";

import { brokerOperations } from '../../../state/modules/brokers';

import EditableCell, {EditableFormRow} from '../shared/SingleEditable/editableCell';
import { pageOperations } from "../../../state/modules/pages";

const { TextArea } = Input;
const { TabPane } = Tabs;

class Page extends Component {

  state = {
    pages: [],
    currentPage: {},
    editingPage: {}
  };

  static getDerivedStateFromProps(nextProps, prevState) {

    if (!_.isEqual( nextProps.pages, prevState.pages )) {
      return {
        pages: nextProps.pages,
      }
    }

    if (nextProps.isSuccess && !_.isEmpty( nextProps.message )) {
      nextProps.fetchGetPages();
      nextProps.resetAfterRequest();
    }

    return null;
  }

  componentDidMount() {
    if (_.isEmpty( this.state.pages )) {
      this.props.fetchGetPages();

    }
  }

  handleSave = data => {
    console.log('[=====  save  =====>');
    console.log(data);
    console.log('<=====  /save  =====]');
    // this.props.fetchEditPage({
    //   id,
    //   name,
    //   content
    // })

  };

  _updateContent = ({target}) => {
    console.log('[=====  content  =====>');
    console.log(target.value);
    console.log('<=====  /content  =====]');
  }
  
  _handleEdit = (id) => {
    console.log('[=====  di  =====>');
    console.log(id);
    console.log('<=====  /di  =====]');
  }

  _displayContent = () => {
    return _.map(this.state.pages, page => {
      return(
        <Card
          title={page.name}

        >
          <Tabs defaultActiveKey="1" animated={false}>
            <TabPane tab="Código" key="1">
              <TextArea disabled={true} rows={8} defaultValue={page.content} onChange={this._updateContent} />
              <div className="cta-container" style={{marginTop: 20}}>
                <Button type="primary" onClick={() => this._handleEdit(page.id)}>Editar</Button>
              </div>

            </TabPane>
            <TabPane tab="Visualización" key="2">
              <InnerHTML html={`${page.content}`} />
            </TabPane>
          </Tabs>


        </Card>
      )
    })
  }

  render() {

    return (
      <>{this._displayContent()}</>
    );
  }
}

function mapStateToProps(state) {
  const { pagesState } = state;
  return {
    pages: pagesState.list,
    page: pagesState.item,
    isSuccess: pagesState.isSuccess,
    isLoading: pagesState.isLoading,
    message: pagesState.message,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetPages: pageOperations.fetchGetPages,
    fetchAddPage: pageOperations.fetchAddPage,
    fetchEditPage: pageOperations.fetchEditPage,
    fetchDeletePage: pageOperations.fetchDeletePage,
    resetAfterRequest: pageOperations.resetAfterRequest,
  }, dispatch );

export default connect( mapStateToProps, mapDispatchToProps )( Page );
