import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { Button, Table, Popconfirm, message as antMessage, Input, Card, Icon, Switch, Tabs, notification } from 'antd';
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
    editingPage: {},
    editingPageId: 0,
  };

  static getDerivedStateFromProps(nextProps, prevState) {

    if (!_.isEqual( nextProps.pages, prevState.pages )) {
      return {
        pages: nextProps.pages,
      }
    }

    if (nextProps.isSuccess && !_.isEmpty( nextProps.message )) {
      notification.success({
        message: 'Página Actualizada',
        onClose: () => {
          nextProps.fetchGetPages();
          nextProps.resetAfterRequest();
        },
        duration: 1
      });

      return {
        currentPage: {},
        editingPage: '',
        editingPageId: 0,
      }
    }

    if (nextProps.isFailure && !_.isEmpty( nextProps.message )) {
      notification.error({
        message: 'Ha ocurrido un error',
        description: nextProps.message,
        onClose: () => {
          nextProps.resetAfterRequest();
        },
        duration: 3
      });
    }

    return null;
  }

  componentDidMount() {
    if (_.isEmpty( this.state.pages )) {
      this.props.fetchGetPages();

    }
  }

  _handleSave = data => {
    const {editingPageId: id, editingPage: content} = this.state;
    this.props.fetchEditPage({
      id,
      content
    })

  };

  _updateContent = ({target}) => {
    this.setState({
      editingPage: target.value
    })
  }
  
  _handleEdit = (editingPageId) => {
    this.setState({
      editingPageId
    })
  }

  _handleCancel = () => {
    this.setState({
      editingPageId: 0,
      editingPage: {}
    })
  }

  _displayContent = () => {

    return _.map(this.state.pages, page => {
      const isPageEditing = _.isEqual(this.state.editingPageId, page.id);
      return(
        <Card
          title={page.name}

        >
          <Tabs defaultActiveKey="1" animated={false}>
            <TabPane tab="Código" key="1">
              <TextArea disabled={!isPageEditing} rows={8} defaultValue={page.content} onChange={this._updateContent} />
              <div className="cta-container" style={{marginTop: 20}}>
                <Button icon="form" className={isPageEditing ? 'hidden' : 'show'} type="secondary" onClick={() => this._handleEdit(page.id)}>Editar</Button>
                <Button icon="check-circle" disabled={_.isEmpty(this.state.editingPage)} className={isPageEditing ? 'show' : 'hidden'} type="primary" onClick={this._handleSave}>Salvar</Button>
                <Button icon="close-circle" className={isPageEditing ? 'show' : 'hidden'} type="danger" onClick={this._handleCancel}>Cancelar</Button>
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
