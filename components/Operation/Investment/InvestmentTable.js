import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import { Button, Icon, Popconfirm, Table, Tag } from 'antd';
import { Sort, FormatCurrency } from '../../../common/utils';


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
          <Popconfirm
            okText="Si"
            title="Está seguro ?"
            cancelText="Cancelar"
            onConfirm={ () => this.props.onDelete( row.id ) }
          >
            <Button type="danger"><Icon type="delete"/></Button>
          </Popconfirm>
          <Button type="secondary" onClick={ () => this.props.onEdit( row.id ) }><Icon type="edit"/></Button>
        </div>
      )
    }

  };

  _displayTableAmount = amount => {
    if (amount) {
      return `${ FormatCurrency.format(amount) }`
    } else {
      return '-'
    }
  };

  render() {
    const columns = [
      {
        title: 'Usuario',
        dataIndex: 'userAccount',
        key: 'userAccount',
        render: text => <span key={ text }>{ text.user.username }</span>,
        sorter: (a, b) => Sort( a.user.username, b.user.username ),
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
      // {
      //   title: 'Comisión',
      //   dataIndex: 'account',
      //   key: 'percentage',
      //   render: text => <span key={ text }>{ text.percentage }%</span>,
      //   sorter: (a, b) => Sort( a.account.percentage, b.account.percentage ),
      //   sortDirections: [ 'descend', 'ascend' ],
      // },
      // {
      //   title: 'Valor de la Cuenta',
      //   dataIndex: 'accountValue',
      //   key: 'accountValue',
      //   render: amount => <span key={ amount }>{ this._displayTableAmount( amount ) }</span>,
      //   sorter: (a, b) => Sort( a.accountValue, b.accountValue ),
      //   sortDirections: [ 'descend', 'ascend' ],
      // },
      // {
      //   title: 'Garantías disponibles',
      //   dataIndex: 'guaranteeOperation',
      //   key: 'guaranteeOperation',
      //   render: amount => <span key={ amount }>{ this._displayTableAmount( amount ) }</span>,
      //   sorter: (a, b) => Sort( a.guaranteeOperation, b.guaranteeOperation ),
      //   sortDirections: [ 'descend', 'ascend' ],
      // },
      // {
      //   title: 'Saldo Inicial',
      //   dataIndex: 'balanceInitial',
      //   key: 'balanceInitial',
      //   render: amount => <span key={ amount }>{ this._displayTableAmount( amount ) }</span>,
      //   sorter: (a, b) => Sort( a.balanceInitial, b.balanceInitial ),
      //   sortDirections: [ 'descend', 'ascend' ],
      // },
      // {
      //   title: 'Saldo Final',
      //   dataIndex: 'balanceFinal',
      //   key: 'balanceFinal',
      //   render: amount => <span key={ amount }>{ this._displayTableAmount( amount ) }</span>,
      //   sorter: (a, b) => Sort( a.balanceFinal, b.balanceFinal ),
      //   sortDirections: [ 'descend', 'ascend' ],
      // },
      // {
      //   title: 'Margen Mantenimiento',
      //   dataIndex: 'maintenanceMargin',
      //   key: 'maintenanceMargin',
      //   render: amount => <span key={ amount }>{ this._displayTableAmount( amount ) }</span>,
      //   sorter: (a, b) => Sort( a.maintenanceMargin, b.maintenanceMargin ),
      //   sortDirections: [ 'descend', 'ascend' ],
      // },
      // {
      //   title: 'Garantías / Créditos',
      //   dataIndex: 'guaranteeCredits',
      //   key: 'guaranteeCredits',
      //   render: amount => <span key={ amount }>{ this._displayTableAmount( amount ) }</span>,
      //   sorter: (a, b) => Sort( a.guaranteeCredits, b.guaranteeCredits ),
      //   sortDirections: [ 'descend', 'ascend' ],
      // },
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