import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Row, Col, Button, Drawer, Tabs, Icon, Radio, notification } from 'antd';
import _ from 'lodash';

import Document from '../components/Document';
import { referralOperations } from "../state/modules/referrals";

import ReferralsTable from '../components/Referral/ReferralsTable';
import AddOrEditReferralForm from '../components/Referral/AddOrEditReferralForm';
import ExportReferralDetail from '../components/Referral/ExportReferralDetail';


const { TabPane } = Tabs;

class Referrals extends Component {
  state = {
    isVisibleAddOrEditReferral: false,
    actionType: 'add',
    selectedReferral: {},
    referrals: [],
    status: 1
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {};


    if (nextProps.isSuccess && !_.isEmpty(nextProps.message)) {
      let message = 'Referral ha sido Creado';

      if (_.isEqual( prevState.actionType, 'edit' )) {
        message = 'Referral ha sido Modificado';
      }

      if (_.isEqual( prevState.actionType, 'delete' )) {
        message = 'Referral ha sido Eliminado';
      }

      if (_.isEqual( prevState.actionType, 'active' )) {
        message = 'Referral ha sido Activado';
      }

      prevState.isVisibleAddOrEditReferral = false;

      notification.success( {
        message,
        onClose: () => {
          prevState.actionType = 'add'; // default value
          nextProps.fetchGetReferrals( {
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
      !_.isEqual( prevState.referrals, this.state.referrals )) {
      this.props.fetchGetReferrals( {
        status: this.state.status
      } );
    }
  }

  componentDidMount() {
    this.props.fetchGetReferrals( {
      status: this.state.status
    } );
  };

  _addReferral = () => {
    this.setState( {
      actionType: 'add',
      isVisibleAddOrEditReferral: true
    } )
  };

  _onClose = () => {
    this.setState( {
      isVisibleAddOrEditReferral: false,
      selectedReferral: {}
    } )
  };

  _handleAddNewReferral = (referral) => {
    this.props.fetchAddReferral( referral )
  };

  _handleEditReferral = (referral) => {
    this.props.fetchEditReferral( referral )
  };

  _handleDeleteReferral = (referralId) => {
    this.setState( {
      actionType: 'delete'
    } );
    this.props.fetchDeleteReferral( referralId );
  };

  _onSelectEdit = (referralId) => {
    this.setState( {
      actionType: 'edit'
    } );
    this._handleSelectEditReferral( referralId )
  };

  _handleSelectEditReferral = (referralId) => {
    const selectedReferral = _.find( this.props.referrals, { id: referralId } );
    this.setState( {
      selectedReferral,
      isVisibleAddOrEditReferral: true,
    } )
  };

  _onSelectOperationType = ({ target }) => {
    this.setState( {
      associatedOperation: target.value,
    } );

  };

  _handleExportHistoryReport = (accountId) => {
    this.props.fetchGetReferralHistoryReport( accountId )
  }

  _handleExportReferralReport = (referralSelected) => {
    ExportReferralDetail(referralSelected)
  }

  _handleTabChange = ({ target }) => {
    this.setState( {
      status: target.value
    } )
  }

  _handleTableOnChange = () => {
    this.props.fetchGetReferrals( {
      status: this.state.status
    } );
  }

  _onSelectActive = (referralId) => {
    this._handleEditReferral({
      id: referralId,
      status: 1,
    })
    this.setState( {
      actionType: 'active'
    } );

  };

  render() {

    return (
      <Document id="referrals-page">
        <Row>
          <Col>
            <ReferralsTable
              referrals={ this.props.referrals }
              isLoading={ this.props.isLoading || this.props.isHistoryReportLoading }
              onEdit={ this._onSelectEdit }
              onDelete={ this._handleDeleteReferral }
              onRequestUpdateTable={ this._handleTableOnChange }
              onReqeuestExportHistoryReport={ this._handleExportHistoryReport }
              onReqeuestExportReferralReport={ this._handleExportReferralReport}
              onTabChange={ this._handleTabChange }
              dataStatus={ this.state.status }
              onActive={ this._onSelectActive }
            />
          </Col>
        </Row>
        <Drawer
          title="Detalle del Referral Ticket"
          width="80%"
          onClose={ this._onClose }
          visible={ this.state.isVisibleAddOrEditReferral }
          destroyOnClose={ true }
        >
          <AddOrEditReferralForm
            onAddNew={ this._handleAddNewReferral }
            onEdit={ this._handleEditReferral }
            isLoading={ this.props.isLoading }
            selectedReferral={ this.state.selectedReferral }
            actionType={ this.state.actionType }
          />
        </Drawer>
      </Document>
    );
  }
}

function mapStateToProps(state) {
  return {
    referrals: state.referralsState.list,
    isLoading: state.referralsState.isLoading,
    isSuccess: state.referralsState.isSuccess,
    isCompleted: state.referralsState.isCompleted,
    message: state.referralsState.message,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    fetchGetReferrals: referralOperations.fetchGetReferrals,
    fetchEditReferral: referralOperations.fetchEditReferral,
    fetchDeleteReferral: referralOperations.fetchDeleteReferral,
    fetchGetReferralReferrals: referralOperations.fetchGetReferralReferrals,
    resetAfterRequest: referralOperations.resetAfterRequest,
  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Referrals );
