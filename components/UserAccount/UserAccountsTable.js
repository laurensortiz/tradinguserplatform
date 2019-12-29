import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import { Button, Icon, Popconfirm, Table, Tag } from 'antd';


class UserAccountsTable extends Component {
  state = {
    users: [],
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEqual(nextProps.users, prevState.users)) {
      return {
        users: nextProps.users
      }
    }
    return null;
  }

  _getCTA = (type, row) => {

    if (_.isEqual(this.props.status, 'inactive')) {
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
            <Button type="danger"><Icon type="delete" /></Button>
          </Popconfirm>
          <Button type="secondary" onClick={() => this.props.onEdit(row.id)}><Icon type="edit" /></Button>
        </div>
      )
    }

  };

  render() {
    const columns = [
      {
        title: 'Nombre',
        dataIndex: 'firstName',
        key: 'firstName',
        render: text => <span key={ text }>{ text }</span>
      },
      {
        title: 'Apellido',
        dataIndex: 'lastName',
        key: 'lastName',
        render: text => <span key={ text }>{ text }</span>
      },
      {
        title: 'Usuario',
        dataIndex: 'username',
        key: 'username',
        render: text => <span key={ text }>{ text }</span>
      },
      {
        title: 'Cédula',
        dataIndex: 'userID',
        key: 'userID',
        render: text => <span key={ text }>{ text }</span>
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: email => <span key={ email }>{ email }</span>
      },
      {
        title: 'Teléfono',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        render: phoneNumber => <span key={ phoneNumber }>{ phoneNumber }</span>
      },
      {
        title: 'Fecha de Inicio',
        dataIndex: 'startDate',
        key: 'startDate',
        render: (date, row) => <span className="date">{ moment.utc( date ).isValid() ? moment.utc( date ).format( 'DD-MM-YYYY' ) : ''}</span>
      },
      {
        title: 'Fecha de Salida',
        dataIndex: 'endDate',
        key: 'endDate',
        render: (date, row) => <span className="date">{ moment.utc( date ).isValid() ? moment.utc( date ).format( 'DD-MM-YYYY' ) : '' }</span>
      },
      {
        title: 'Cuenta',
        dataIndex: 'account',
        key: 'account',
        render: account => <span >{ `${account.percentage}% - ${account.name}` }</span>
      },
      {
        title: 'Permisos',
        dataIndex: 'role',
        key: 'role',
        render: (type, row) => {

          const colorTag = type.id === 2 ? 'orange' : 'green';

          return <Tag color={ colorTag }>{ type.name }</Tag>
        }
      },
      {
        title: 'Acciones',
        key: 'actions',
        render: this._getCTA
      },
    ];

    return (
      <Table
        rowKey={ record => record.id }
        columns={ columns }
        dataSource={ this.props.users }
        loading={ this.props.isLoading }
        scroll={ { x: true } }
      />
    );
  }
}


function mapStateToProps(state) {

  return {

  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( UserAccountsTable );