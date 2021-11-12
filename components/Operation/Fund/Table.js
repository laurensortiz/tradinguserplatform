import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'

import {
  Button,
  Col,
  DatePicker,
  Icon,
  Input,
  Popconfirm,
  Radio,
  Row,
  Select,
  Table,
  Tag,
  Tooltip,
} from 'antd'
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

const { Option } = Select
const { RangePicker } = DatePicker
const FORMAT_DATE = 'DD-MM-YYYY'

class TableFund extends Component {
  state = {
    operations: [],
    isMenuFold: true,
    filteredInfo: {},
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
          onPressEnter={() => this._handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this._handleSearch(selectedKeys, confirm, dataIndex)}
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

  _handleReset = (selectedKeys, clearFilters) => {
    if (!_.isEmpty(selectedKeys)) {
      clearFilters()
      this.setState({
        searchText: '',
      })
    }
  }

  _handleSearch = (selectedKeys, confirm, dataIndex) => {
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

  _getProductlist = (operations) => {
    return _.chain(operations)
      .reduce((result, operation) => {
        if (operation.product) {
          result.push(operation.product.name)
        }
        return result
      }, [])
      .uniq()
      .value()
  }

  _sortDates = (start, end) => {
    if (_.isNil(start)) start = '00-00-0000'
    if (_.isNil(end)) end = '00-00-0000'

    return moment(start).unix() - moment(end).unix()
  }

  _handleDateFilterChange = (dateModeValue) => {
    this.dateMode = dateModeValue
    this.forceUpdate()
    this.defaultDate = null
  }

  _datesInRange = (record, dataIndex) => {
    const dateRange = this.timeDateRange
    if (!_.isEmpty(dateRange)) {
      return _.includes(dateRange, moment.parseZone(_.get(record, dataIndex)).format(FORMAT_DATE))
    }
  }

  _createDateRange = (date, setSelectedKeys, minDate, maxDate, dataIndex) => {
    this.defaultDate = moment.parseZone(date)

    let dateRange = [],
      range = ''

    const dateMode = this.dateMode

    switch (dateMode) {
      case 'single':
        range = moment.range(date, date)
        break
      case 'range':
        range = moment.range(date[0], date[1])
        break
      default:
    }

    let arrayOfDates = _.toArray(range.by('days'))

    _.map(arrayOfDates, (date) => {
      dateRange.push(moment(date).format(FORMAT_DATE))
    })

    this.timeDateRange = dateRange

    return setSelectedKeys(date ? [date] : [])
  }

  _getColumnDateProps = (dataIndex, minDate, maxDate) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div className="custom-filter-dropdown">
        <Select
          placeholder="Seleccione el tipo de filtro"
          onChange={(e) => this._handleDateFilterChange(e)}
        >
          <Option value="single">Por día</Option>
          <Option value="range">Rango de fechas</Option>
        </Select>

        {this.dateMode === 'range' ? (
          <RangePicker
            onChange={(e) => this._createDateRange(e, setSelectedKeys, minDate, maxDate, dataIndex)}
            format={FORMAT_DATE}
            allowClear={false}
          />
        ) : null}

        {this.dateMode === 'single' ? (
          <DatePicker
            value={this.defaultDate}
            onChange={(e) => this._createDateRange(e, setSelectedKeys, minDate, maxDate, dataIndex)}
            format={FORMAT_DATE}
            allowClear={false}
          />
        ) : null}
        <Button
          onClick={() => this._handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
        >
          Filtrar
        </Button>
        <Button
          ref={(e) => (this.clearFilterDatesBtn = e)}
          onClick={() => this._handleReset(selectedKeys, clearFilters)}
          size="small"
        >
          Limpiar
        </Button>
      </div>
    ),
    onFilter: (value, record) => {
      return this._datesInRange(record, dataIndex)
    },
  })

  render() {
    const datesInTimes = _.map(this.state.operations, (record) => moment(record.createdAt)),
      maxDatesInTimes = moment.max(datesInTimes).add(1, 'days'),
      minDatesInTimes = moment.min(datesInTimes).subtract(1, 'days')
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

    const productList = this._getProductlist(operations)

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
        filters: productList.map((value) => {
          return {
            text: value,
            value,
          }
        }),
        filteredValue: filteredInfo['operationType'] || null,
        onFilter: (value, record) => (record.operationType ? record.operationType === value : null),
        ellipsis: true,
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
        sortDirections: ['descend', 'ascend'],
        inputType: 'date',
        rowKey: (d) => {
          return FormatDate(d.startDate)
        },
        sorter: (a, b) => {
          return this._sortDates(a.startDate, b.startDate)
        },
        ...this._getColumnDateProps('startDate', minDatesInTimes, maxDatesInTimes),
      },
      {
        title: 'Fecha de Expiración',
        dataIndex: 'expirationDate',
        key: 'expirationDate',
        render: (date, row) => <span className="date">{FormatDate(date)}</span>,
        sortDirections: ['descend', 'ascend'],
        inputType: 'date',
        rowKey: (d) => {
          return FormatDate(d.expirationDate)
        },
        sorter: (a, b) => {
          return this._sortDates(a.expirationDate, b.expirationDate)
        },
        ...this._getColumnDateProps('expirationDate', minDatesInTimes, maxDatesInTimes),
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
