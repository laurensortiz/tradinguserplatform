import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import { Button, Icon, Popconfirm, Table, Tag } from 'antd';
import { Sort, FormatCurrency, FormatStatus, FormatDate, SortDate, DisplayTableAmount } from '../../../common/utils';
import classNames from "classnames";

class InvestmentTable extends Component {
  state = {
    operations: [],
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEqual( nextProps.operations, prevState.operations )) {
      return {
        users: nextProps.operations
      }
    }
    return null;
  }

  _getCTA = (type, row) => {

    if (_.isEqual( this.props.status, 'inactive' )) {
      return (
        <div className="cta-container">
          <Popconfirm
            okText="Si"
            title="Está seguro que desea activarlo ?"
            cancelText="Cancelar"
            onConfirm={ () => this.props.onActive( row.id ) }
          >
            <Button type="danger">Activar</Button>
          </Popconfirm>
        </div>
      )
    } else {
      return (
        <div className="cta-container">
          <Button type="secondary" onClick={ () => this.props.onDetail( row.id ) }><Icon type="hdd" />Detalle</Button>
          {this.props.isAdmin ? (
            <>
              <Popconfirm
                okText="Si"
                title="Está seguro ?"
                cancelText="Cancelar"
                onConfirm={ () => this.props.onDelete( row.id ) }
              >
                <Button type="danger"><Icon type="delete"/></Button>
              </Popconfirm>
              <Button type="secondary" onClick={ () => this.props.onEdit( row.id ) }><Icon type="edit"/></Button>
            </>
          ): null}

        </div>
      )
    }

  };

  render() {
    const columns = [
      {
        title: 'Estado',
        dataIndex: 'status',
        key: 'status',
        render: status => {
          const {name, color} = FormatStatus(status);
          return <Tag color={color} >{ name }</Tag>
        },
        sorter: (a, b) => Sort( a.status, b.status ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Usuario',
        dataIndex: 'userAccount',
        key: 'userAccount',
        render: text => <span key={ text }>{ text.user.username }</span>,
        sorter: (a, b) => Sort( a.userAccount.user.username, b.userAccount.user.username ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Tipo de Operación',
        dataIndex: 'operationType',
        key: 'operationType',
        render: text => <span key={ text }>{ text }</span>,
        sorter: (a, b) => Sort( a.operationType, b.operationType ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Cuenta de Usuario',
        dataIndex: 'userAccount',
        key: 'account',
        render: text => <span key={ text.accountId }>{ text.account.name }</span>,
        sorter: (a, b) => Sort( a.userAccount.account.name, b.userAccount.account.name ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Saldo Actual',
        dataIndex: 'amount',
        key: 'amount',
        render: amount => <span key={ amount }>{ DisplayTableAmount( amount ) }</span>,
        sorter: (a, b) => Sort( a.amount, b.amount ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Fecha de Inicio',
        dataIndex: 'startDate',
        key: 'startDate',
        render: (date, row) => <span className="date">{ FormatDate(date) }</span>,
        sorter: (a, b) => SortDate( a.startDate, b.startDate ),
        sortDirections: [ 'descend', 'ascend' ],

      },
      {
        title: 'Fecha de Salida',
        dataIndex: 'endDate',
        key: 'endDate',
        render: (date, row) => <span className="date">{ FormatDate(date) }</span>,
        sorter: (a, b) => SortDate( a.endDate, b.endDate ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Acciones',
        key: 'actions',
        render: this._getCTA,
        fixed: 'right',
        width: 150
      },
    ];

    return (
      <Table
        rowKey={ record => record.id }
        columns={ columns }
        dataSource={ this.props.investmentOperations }
        loading={ this.props.isLoading }
        scroll={ { x: true } }
        className={classNames({'hidden-table': !this.props.isAdmin && _.isEmpty(this.props.investmentOperations)})}

      />
    );
  }
}


function mapStateToProps(state) {

  return {}
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {}, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( InvestmentTable );