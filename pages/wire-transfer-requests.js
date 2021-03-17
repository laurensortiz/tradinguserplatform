import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Row, Col, Button, Drawer, Tabs, Icon, Radio, notification } from 'antd';
import _ from 'lodash';

import Document from '../components/Document';
import { wireTransferRequestOperations } from "../state/modules/wireTransferRequests";

import WireTransferRequestsTable from '../components/WireTransferRequest/DetailTable';
import AddOrEditWireTransferRequestForm from '../components/WireTransferRequest/AddOrEditForm';
import ExportWireTransferRequestDetail from '../components/WireTransferRequest/ExportDetail';


const { TabPane } = Tabs;

class WireTransferRequests extends Component {
  state = {
    isVisibleAddOrEditWireTransferRequest: false,
    actionType: 'add',
    selectedWireTransferRequest: {},
    wireTransferRequests: [],
    status: 1
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {};

    if (!_.isEqual(nextProps.selectedWireTransferRequest, prevState.selectedWireTransferRequest)) {
      _.assignIn(updatedState, {
        selectedWireTransferRequest: nextProps.selectedWireTransferRequest
      })
    }


    if (nextProps.isSuccess && !_.isEmpty(nextProps.message)) {
      let message = 'WireTransferRequest ha sido Creado';

      if (_.isEqual( prevState.actionType, 'edit' )) {
        message = 'WireTransferRequest ha sido Modificado';
      }

      if (_.isEqual( prevState.actionType, 'delete' )) {
        message = 'WireTransferRequest ha sido Eliminado';
      }

      if (_.isEqual( prevState.actionType, 'active' )) {
        message = 'WireTransferRequest ha sido Activado';
      }

      prevState.isVisibleAddOrEditWireTransferRequest = false;

      notification.success( {
        message,
        onClose: () => {
          prevState.actionType = 'add'; // default value
          nextProps.fetchGetWireTransferRequests( {
            status: prevState.status
          } );
          nextProps.resetAfterRequest();
        },
        duration: 1
      } )

    }

    if (!nextProps.isSuccess && nextProps.isCompleted) {
      notification.error( {
        message: 'Ha ocurrido un error',
        description: nextProps.message,
        onClose: () => {
          nextProps.resetAfterRequest();
        },
        duration: 3
      } )

    }

    return updatedState;
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual( prevState.status, this.state.status ) ||
      !_.isEqual( prevState.wireTransferRequests, this.state.wireTransferRequests )) {
      this.props.fetchGetWireTransferRequests( {
        status: this.state.status
      } );
    }
  }

  componentDidMount() {
    this.props.fetchGetWireTransferRequests( {
      status: this.state.status
    } );
  };

  _onClose = () => {
    this._handleTableOnChange();
    this.setState( {
      isVisibleAddOrEditWireTransferRequest: false,
      selectedWireTransferRequest: {}
    } )
  };

  _handleAddNewWireTransferRequest = (wireTransferRequest) => {
    this.props.fetchAddWireTransferRequest( wireTransferRequest )
  };

  _handleEditWireTransferRequest = (wireTransferRequest) => {
    this.props.fetchEditWireTransferRequest( wireTransferRequest )
  };

  _handleDeleteWireTransferRequest = (wireTransferRequestId) => {
    this.setState( {
      actionType: 'delete'
    } );
    this.props.fetchDeleteWireTransferRequest( wireTransferRequestId );
  };

  _onSelectEdit = (wireTransferRequestId) => {
    this.setState( {
      actionType: 'edit'
    } );
    this._handleSelectEditWireTransferRequest( wireTransferRequestId )
  };

  _handleSelectEditWireTransferRequest = (wireTransferRequestId) => {
    this.setState( {
      isVisibleAddOrEditWireTransferRequest: true,
    } )

    this.props.fetchGetWireTransferRequest(wireTransferRequestId)
  };

  _handleExportHistoryReport = (accountId) => {
    this.props.fetchGetWireTransferRequestHistoryReport( accountId )
  }

  _handleExportWireTransferRequestReport = (wireTransferRequestSelected) => {
    ExportWireTransferRequestDetail(wireTransferRequestSelected)
  }

  _handleTabChange = ({ target }) => {
    this.setState( {
      status: target.value
    } )
  }

  _handleTableOnChange = () => {
    this.props.fetchGetWireTransferRequests( {
      status: this.state.status
    } );
  }

  _onSelectActive = (wireTransferRequestId) => {
    this._handleEditWireTransferRequest({
      id: wireTransferRequestId,
      status: 1,
    })
    this.setState( {
      actionType: 'active'
    } );

  };

  render() {

    return (
      <Document id="wireTransferRequests-page">
        <Row>
          <Col>
            <WireTransferRequestsTable
              wireTransferRequests={ this.props.wireTransferRequests }
              isLoading={ this.props.isLoading || this.props.isHistoryReportLoading }
              onEdit={ this._onSelectEdit }
              onDelete={ this._handleDeleteWireTransferRequest }
              onRequestUpdateTable={ this._handleTableOnChange }
              onReqeuestExportHistoryReport={ this._handleExportHistoryReport }
              onReqeuestExportWireTransferRequestReport={ this._handleExportWireTransferRequestReport}
              onTabChange={ this._handleTabChange }
              dataStatus={ this.state.status }
              onActive={ this._onSelectActive }
            />
          </Col>
        </Row>
        <Drawer
          title="Detalle del WireTransferRequest Ticket"
          width="80%"
          onClose={ this._onClose }
          visible={ this.state.isVisibleAddOrEditWireTransferRequest }
          destroyOnClose={ true }
        >
          <AddOrEditWireTransferRequestForm
            onAddNew={ this._handleAddNewWireTransferRequest }
            onEdit={ this._handleEditWireTransferRequest }
            isLoading={ this.props.isLoading }
            selectedWireTransferRequest={ this.state.selectedWireTransferRequest }
            actionType={ this.state.actionType }
          />
        </Drawer>
      </Document>
    );
  }
}

function mapStateToProps(state) {
  return {
    wireTransferRequests: state.wireTransferRequestsState.list,
    selectedWireTransferRequest: state.wireTransferRequestsState.item,
    isLoading: state.wireTransferRequestsState.isLoading,
    isSuccess: state.wireTransferRequestsState.isSuccess,
    isCompleted: state.wireTransferRequestsState.isCompleted,
    message: state.wireTransferRequestsState.message,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetWireTransferRequests: wireTransferRequestOperations.fetchGetWireTransferRequests,
    fetchGetWireTransferRequest: wireTransferRequestOperations.fetchGetWireTransferRequest,
    fetchEditWireTransferRequest: wireTransferRequestOperations.fetchEditWireTransferRequest,
    fetchDeleteWireTransferRequest: wireTransferRequestOperations.fetchDeleteWireTransferRequest,
    fetchGetWireTransferRequestWireTransferRequests: wireTransferRequestOperations.fetchGetWireTransferRequestWireTransferRequests,
    resetAfterRequest: wireTransferRequestOperations.resetAfterRequest,
  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( WireTransferRequests );
