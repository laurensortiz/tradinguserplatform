import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import { Button, Icon, Popconfirm, Table, Tag } from 'antd';
import { Sort, FormatCurrency, FormatStatus, FormatDate, SortDate } from '../../../common/utils';

class MarketTable extends Component {
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
        title: 'Fecha de Apertura',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date, row) => <span className="date">{ FormatDate(date) }</span>,
        sorter: (a, b) => SortDate( a.createdAt, b.createdAt ),
        sortDirections: [ 'descend', 'ascend' ],
      },
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
        title: 'Comportamiento',
        dataIndex: 'status',
        key: 'move',
        render: status => {
          if (status == 1) {
            return <Icon type="rise" style={ {color: '#87d068', fontSize: 30 }} />
          } else {
            return <Icon type="fall" style={ {color: '#f50', fontSize: 30 }} />
          }
        }

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
        title: 'Cuenta de Usuario',
        dataIndex: 'userAccount',
        key: 'account',
        render: text => <span key={ text.accountId }>{ text.account.name }</span>,
        sorter: (a, b) => Sort( a.userAccount.account.name, b.userAccount.account.name ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Producto',
        dataIndex: 'product',
        key: 'product',
        render: text => <span key={`${text.code}-${text.name}`} >{ `${text.code}-${text.name}` }</span>,
        sorter: (a, b) => Sort( a.product.name, b.product.name ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Monto',
        dataIndex: 'amount',
        key: 'amount',
        render: amount => <span key={ amount }>{ this._displayTableAmount( amount ) }</span>,
        sorter: (a, b) => Sort( a.amount, b.amount ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'L/S',
        dataIndex: 'longShort',
        key: 'longShort',
        render: text => <span key={text} >{ text }</span>,
        sorter: (a, b) => Sort( a.longShort, b.longShort ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Lotage',
        dataIndex: 'actionsTotal',
        key: 'actionsTotal',
        render: text => <span key={text} >{ text }</span>,
        sorter: (a, b) => Sort( a.actionsTotal, b.actionsTotal ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Precio de Compra',
        dataIndex: 'buyPrice',
        key: 'buyPrice',
        render: text => <span key={text} >{ this._displayTableAmount(text) }</span>,
        sorter: (a, b) => Sort( a.buyPrice, b.buyPrice ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Taking Profit',
        dataIndex: 'takingProfit',
        key: 'takingProfit',
        render: text => <span key={text} >{ text }</span>,
        sorter: (a, b) => Sort( a.takingProfit, b.takingProfit ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Stop Lost',
        dataIndex: 'stopLost',
        key: 'stopLost',
        render: text => <span key={text} >{ text }</span>,
        sorter: (a, b) => Sort( a.stopLost, b.stopLost ),
        sortDirections: [ 'descend', 'ascend' ],
      },
      {
        title: 'Invesión',
        dataIndex: 'amount',
        key: 'amount',
        render: amount => <span key={amount} >{ this._displayTableAmount( amount ) }</span>,
        sorter: (a, b) => Sort( a.amount, b.amount ),
        sortDirections: [ 'descend', 'ascend' ],
      },

      {
        title: 'Corredor',
        dataIndex: 'broker',
        key: 'broker',
        render: text => <span key={text.name} >{ text.name }</span>,
        sorter: (a, b) => Sort( a.broker.name, b.broker.name ),
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
        dataSource={ this.props.marketOperations }
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


export default connect( mapStateToProps, mapDispatchToProps )( MarketTable );