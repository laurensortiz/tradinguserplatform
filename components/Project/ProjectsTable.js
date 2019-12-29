import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import { Button, Icon, Popconfirm, Table } from 'antd';


class ProjectsTable extends Component {
  state = {
    projects: [],
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEqual(nextProps.projects, prevState.projects)) {
      return {
        projects: nextProps.projects
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
        title: 'Código',
        dataIndex: 'code',
        key: 'code',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.code - b.code,
        fixed: 'left',
        width: 100,
      },
      {
        title: 'Nombre',
        dataIndex: 'name',
        key: 'name',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.name.length - b.name.length,
        width: 100,
      },
      {
        title: 'Categoría',
        dataIndex: 'category',
        key: 'category',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.category.length - b.category.length,
        render: text => text.name,
      },
      {
        title: 'Alcance',
        dataIndex: 'scope',
        key: 'scope',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.scope.length - b.scope.length,
        render: text => text.name,
      },
      {
        title: 'País',
        dataIndex: 'country',
        key: 'country',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.country.length - b.country.length,
        render: text => text.name,
      },
      {
        title: 'Horas Cotizadas',
        dataIndex: 'totalHoursQuoted',
        key: 'totalHoursQuoted',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.totalHoursQuoted.length - b.totalHoursQuoted.length,
      },
      {
        title: 'Fecha de Inicio',
        dataIndex: 'startDate',
        key: 'startDate',
        render: (date, row) => <span key={ row.id + 3 }>{ moment( date ).format( 'DD-MM-YYYY' ) }</span>,
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.startDate - b.startDate,
      },
      {
        title: 'Fecha Finalización',
        dataIndex: 'endDate',
        key: 'endDate',
        render: (date, row) => <span key={ row.id + 4 }>{ date ? moment( date ).format( 'DD-MM-YYYY' ) : '' }</span>,
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.updatedAt - b.updateAt,
      },
      {
        title: 'Observaciones',
        dataIndex: 'observations',
        key: 'observations',
      },
      {
        title: 'Acciones',
        key: 'actions',
        render: this._getCTA
      },
    ];

    return (
      <Table
        scroll={{ x: true }}
        rowKey={ record => record.id }
        columns={ columns }
        dataSource={ this.props.projects }
        loading={this.props.isLoading}
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


export default connect( mapStateToProps, mapDispatchToProps )( ProjectsTable );