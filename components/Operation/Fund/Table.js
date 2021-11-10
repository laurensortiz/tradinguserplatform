import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'

import { Button, Col, Icon, Input, Popconfirm, Radio, Row, Table, Tag, Tooltip } from 'antd'
import {
  Sort,
  FormatCurrency,
  FormatStatus,
  FormatDate,
  SortDate,
  DisplayTableAmount,
} from '../../../common/utils'
import classNames from 'classnames'
import Highlighter from 'react-highlight-words'
import BulkUpdateSteps from './BulkUpdateSteps'
import { ExportMarkerOperationReport } from '../shared'

class TableFund extends Component {
  state = {
    operations: [],
    isMenuFold: true,
    searchText: '',
    searchedColumn: '',
    selectedRowKeys: [],
    currentDataSource: [],
    selectedBulkUpdateType: 'status',
    bulkUpdateValue: null,
    isBulkUpdateActive: false,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEqual(nextProps.fundOperations, prevState.operations)) {
      return {
        operations: _.orderBy(nextProps.fundOperations, ['id'], ['desc']),
      }
    }
    return null
  }

  _getCTA = (type, row) => {
    if (_.isEqual(this.props.status, 'inactive')) {
      return (
        <div className="cta-container">
          <Popconfirm
            okText="Si"
            title="Está seguro que desea activarlo ?"
            cancelText="Cancelar"
            onConfirm={() => this.props.onActive(row.id)}
          >
            <Button type="danger">
              <Icon type="undo" />
              <span>Activar</span>
            </Button>
          </Popconfirm>
        </div>
      )
    } else {
      return (
        <div className="cta-container">
          <Button type="secondary" onClick={() => this.props.onDetail(row.id)}>
            <Icon type="hdd" />
            <span>Detalle</span>
          </Button>
          {this.props.isAdmin ? (
            <>
              <Button type="secondary" onClick={() => this.props.onEdit(row.id)}>
                <Icon type="edit" />
                <span>Editar</span>
              </Button>
              <Popconfirm
                okText="Si"
                title="Está seguro ?"
                cancelText="Cancelar"
                onConfirm={() => this.props.onDelete(row.id)}
              >
                <Button type="danger">
                  <Icon type="delete" />
                  <span>Eliminar</span>
                </Button>
              </Popconfirm>
            </>
          ) : null}
        </div>
      )
    }
  }

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node
          }}
          placeholder={`Buscar`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Buscar
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Limpiar
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      return _.get(record, dataIndex).toString().toLowerCase().includes(value.toLowerCase())
    },
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select())
      }
    },
    render: (text) => {
      return this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      )
    },
  })

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    })
  }

  handleReset = (clearFilters) => {
    clearFilters()
    this.setState({ searchText: '' })
  }

  _onSelectMenuFold = () => {
    this.setState({
      isMenuFold: !this.state.isMenuFold,
    })
  }

  _handleActionTitle = () => (
    <div style={{ textAlign: 'right' }}>
      <Row>
        <Col xs={12} style={{ textAlign: 'left' }}>
          <Tooltip placement="top" title="Sincronizar Datos">
            <Button type="primary" onClick={() => this.props.onRequestUpdateTable()}>
              <Icon type="history" />
            </Button>
          </Tooltip>
        </Col>
        <Col xs={12} style={{ textAlign: 'right' }}>
          <Button onClick={this._onSelectMenuFold}>
            <Icon type="swap" />
          </Button>
        </Col>
      </Row>
    </div>
  )

  _displayTableFooter = () => (
    <Row>
      <Col>
        <h3>
          Total de Operaciones:{' '}
          <Tag color="#1b1f21" style={{ fontSize: 14, marginLeft: 10 }}>
            {_.size(this.state.operations)}
          </Tag>
        </h3>
      </Col>
    </Row>
  )

  tableHeader = () => (
    <>
      <Row>
        <Col sm={12}></Col>
        <Col sm={12} style={{ textAlign: 'right' }}>
          <Button
            type="secondary"
            className={classNames({ hidden: this.state.isBulkUpdateActive })}
            onClick={() => this.setState({ isBulkUpdateActive: true })}
            size="large"
          >
            <Icon type="retweet" /> Actualización Masiva
          </Button>
          <Button
            type="danger"
            className={classNames({ hidden: !this.state.isBulkUpdateActive })}
            onClick={this.onCancelBulkProcess}
          >
            <Icon type="close-circle" /> Cerrar
          </Button>
        </Col>
      </Row>
      {this.state.isBulkUpdateActive ? (
        <Row>
          <Col>
            <div className="multiple-actualization-module">
              <BulkUpdateSteps
                selectedElements={this.state.selectedRowKeys.length}
                onClickUpdate={this._handleClickBulkUpdate}
                isProcessComplete={this.props.isBulkCompleted}
                isBulkLoading={this.props.isBulkLoading}
                isBulkSuccess={this.props.isBulkSuccess}
              />
            </div>
          </Col>
        </Row>
      ) : null}
    </>
  )

  onSelectOperation = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }

  onSelectAllOperation = (isSelected) => {
    const { currentDataSource, operations } = this.state
    const dataSource = !_.isEmpty(currentDataSource) ? currentDataSource : operations
    const allOperationsIds = isSelected ? dataSource.map((ope) => ope.id) : []
    this.setState({ selectedRowKeys: allOperationsIds })
  }

  onTableChange = (pagination, filters, sorter, extra) => {
    const { currentDataSource } = extra
    this.setState({
      currentDataSource,
      filteredInfo: filters,
      sortedInfo: sorter,
    })
    //this.props.onChangePagination({ pagination, filters })
    if (this.props.isAdmin) {
      this.props.onRequestUpdateTable({ pagination, filters })
    }
  }

  onCancelBulkProcess = () => {
    this.setState({
      isBulkUpdateActive: false,
      selectedRowKeys: [],
      selectedBulkUpdateType: 'status',
      bulkUpdateValue: null,
    })
    this.props.onRequestUpdateTable()
  }

  _handleClickBulkUpdate = (bulkOperation) => {
    const operationsIds = this.state.selectedRowKeys

    this.props.onFetchBulkUpdate({
      ...bulkOperation,
      operationsIds,
    })
  }

  render() {
    const showHandleClass = this.props.isAdmin ? 'show' : 'hidden'
    const {
      selectedRowKeys,
      isBulkUpdateActive,
      operations,
      filteredInfo,
      assetClasses,
      brokers,
      products,
    } = this.state

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectOperation,
      onSelectAll: this.onSelectAllOperation,
    }

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Usuario',
        dataIndex: 'userAccount.user.username',
        key: 'userAccount.user.username',
        className: `${showHandleClass} `,
        sorter: (a, b) => Sort(a.userAccount.user.username, b.userAccount.user.username),
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('userAccount.user.username'),
      },
      {
        title: 'Nombre',
        dataIndex: 'userAccount.user.firstName',
        key: 'userAccount.user.firstName',
        render: (text) => <span key={text}>{text}</span>,
        sorter: (a, b) => Sort(a.userAccount.user.firstName, b.userAccount.user.firstName),
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('userAccount.user.firstName'),
      },
      {
        title: 'Apellido',
        dataIndex: 'userAccount.user.lastName',
        key: 'userAccount.user.lastName',
        render: (text) => <span key={text}>{text}</span>,
        sorter: (a, b) => Sort(a.userAccount.user.lastName, b.userAccount.user.lastName),
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('userAccount.user.lastName'),
      },
      {
        title: 'Tipo de Operación',
        dataIndex: 'operationType',
        key: 'operationType',
        render: (text) => <span key={text}>{text}</span>,
        sorter: (a, b) => Sort(a.operationType, b.operationType),
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('operationType'),
      },
      {
        title: 'Cuenta de Usuario',
        dataIndex: 'userAccount.account.name',
        key: 'account',
        render: (text) => <span key={text.accountId}>{text.account.name}</span>,
        sorter: (a, b) => Sort(a.userAccount.account.name, b.userAccount.account.name),
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('userAccount.account.name'),
      },
      {
        title: 'Saldo Actual',
        dataIndex: 'amount',
        key: 'amount',
        render: (amount) => <span key={amount}>{DisplayTableAmount(amount)}</span>,
        sorter: (a, b) => Sort(a.amount, b.amount),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Fecha de Inicio',
        dataIndex: 'startDate',
        key: 'startDate',
        render: (date, row) => <span className="date">{FormatDate(date)}</span>,
        sorter: (a, b) => SortDate(a.startDate, b.startDate),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Fecha de Expiración',
        dataIndex: 'expirationDate',
        key: 'expirationDate',
        render: (date, row) => <span className="date">{FormatDate(date)}</span>,
        sorter: (a, b) => SortDate(a.expirationDate, b.expirationDate),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: this._handleActionTitle,
        key: 'actions',
        render: this._getCTA,
        fixed: 'right',
        className: 't-a-r fixed-table-actions-panel',
      },
    ]

    return (
      <Table
        rowSelection={isBulkUpdateActive ? rowSelection : null}
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={this.state.operations}
        loading={this.props.isLoading}
        scroll={{ x: true }}
        className={classNames({
          'hidden-table': !this.props.isAdmin && _.isEmpty(this.state.operations),
          'is-menu-fold': this.state.isMenuFold,
        })}
        onChange={this.onTableChange}
        footer={this._displayTableFooter}
        title={this.tableHeader}
      />
    )
  }
}

function mapStateToProps(state) {
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(TableFund)
