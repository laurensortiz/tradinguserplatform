import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'
import Highlighter from 'react-highlight-words'
import {
  Button,
  Icon,
  Input,
  Popconfirm,
  Radio,
  Table,
  Tag,
  Row,
  Col,
  Select,
  DatePicker,
  Tooltip,
} from 'antd'
import { Sort, FormatCurrency, DisplayTableAmount, FormatDate } from '../../common/utils'
import classNames from 'classnames'
import momentDurationFormat from 'moment-duration-format'
import moment from 'moment-timezone'
import { extendMoment } from 'moment-range'

const FORMAT_DATE = 'DD-MM-YYYY'
const { Option } = Select
const { RangePicker } = DatePicker

momentDurationFormat(moment)
extendMoment(moment)
moment.locale('es') // Set Lang to Spanish

class ReferralsTable extends Component {
  state = {
    referrals: [],
    searchText: '',
    searchedColumn: '',
    isMenuFold: true,
    currentDataSource: [],
    selectedRowKeys: [],
    isBulkActive: false,
  }

  dateMode = 0
  timeDateRange = []
  defaultDate = null

  static getDerivedStateFromProps(nextProps, prevState) {
    let updatedState = {}
    if (!_.isEqual(nextProps.referrals, prevState.referrals)) {
      _.assignIn(updatedState, {
        referrals: nextProps.referrals,
      })
    }
    return updatedState
  }

  _handleExportHistory = (referralId) => {
    const selectedReferral = _.find(this.state.referrals, { id: referralId })

    this.props.onReqeuestExportReferralReport([selectedReferral])
  }

  onSelectOperation = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }

  onSelectAllOperation = (isSelected) => {
    const { currentDataSource, referrals } = this.state
    const dataSource = !_.isEmpty(currentDataSource) ? currentDataSource : referrals
    const allOperationsIds = isSelected ? dataSource.map((ope) => ope.id) : []
    this.setState({ selectedRowKeys: allOperationsIds })
  }

  _getCTA = (type, row) => {
    if (_.isEqual(this.props.dataStatus, 0)) {
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
          <Button
            type="primary"
            onClick={() => this._handleExportHistory(row.id)}
            data-testid="export-button"
            className="export-excel-cta"
            style={{ float: 'right' }}
          >
            <Icon type="file-excel" /> <span>Exportar</span>
          </Button>
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
        </div>
      )
    }
  }

  _displayTableAmount = (amount) => {
    if (amount) {
      return `${FormatCurrency.format(amount)}`
    } else {
      return '-'
    }
  }

  _handleSearch = (selectedKeys, confirm) => {
    confirm()
    this.setState({
      searchText: selectedKeys[0],
    })
  }

  _handleReset = (selectedKeys, clearFilters) => {
    if (!_.isEmpty(selectedKeys)) {
      clearFilters()
      this.setState({
        searchText: '',
      })
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
      <Icon type="filter" theme="filled" style={{ color: filtered ? '#1890ff' : undefined }} />
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
      const displayText = dataIndex === 'initialAmount' ? this._displayTableAmount(text) : text
      return this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={displayText.toString()}
        />
      ) : (
        displayText
      )
    },
  })

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
      selectedRowKeys: [],
    })
  }

  handleReset = (clearFilters) => {
    clearFilters()
    this.setState({
      searchText: '',
      selectedRowKeys: [],
    })
  }

  onTableChange = (pagination, filters, sorter, extra) => {
    const { currentDataSource } = extra
    this.setState({
      currentDataSource,
      filteredInfo: filters,
      sortedInfo: sorter,
    })
    this.props.onRequestUpdateTable()
  }

  _onSelectBulkReport = () => {
    const exportData = _.isEmpty(this.state.currentDataSource)
      ? this.state.referrals
      : this.state.currentDataSource
    const selectedReferrals = _.filter(exportData, (referral) =>
      _.includes(this.state.selectedRowKeys, referral.id)
    )

    this.props.onReqeuestExportReferralReport(selectedReferrals)
  }
  onCancelBulkProcess = () => {
    this.setState({
      isBulkActive: false,
      selectedRowKeys: [],
      bulkUpdateValue: null,
    })
    this.props.onRequestUpdateTable()
  }

  _displayTableHeader = () => (
    <Row>
      <Col sm={12}>
        <Radio.Group defaultValue={1} buttonStyle="solid" onChange={this.props.onTabChange}>
          <Radio.Button value={1}>Activos</Radio.Button>
          <Radio.Button value={0}>Eliminados</Radio.Button>
        </Radio.Group>
      </Col>
      <Col sm={12}>
        {this.state.isBulkActive ? (
          <>
            <Button onClick={this.onCancelBulkProcess} type="danger" style={{ float: 'right' }}>
              <Icon type="close-circle" />
              <span>Cancelar</span>
            </Button>
            <Button
              type="primary"
              data-testid="export-button"
              className="export-excel-cta"
              style={{ float: 'right', marginRight: 20 }}
              onClick={this._onSelectBulkReport}
            >
              <Icon type="file-excel" /> <span>Descargar Reporte</span>
            </Button>
          </>
        ) : (
          <Button
            size="large"
            type="secondary"
            style={{ float: 'right' }}
            onClick={() => this.setState({ isBulkActive: true })}
          >
            <Icon type="interaction" /> <span>Generar Reporte de Referrals</span>
          </Button>
        )}
      </Col>
    </Row>
  )

  _displayTableFooter = () => (
    <Row>
      <Col>
        <h3>
          Total de Referrals:{' '}
          <Tag color="#1b1f21" style={{ fontSize: 14, marginLeft: 10 }}>
            {_.size(this.state.referrals)}
          </Tag>
        </h3>
      </Col>
    </Row>
  )

  _onSelectMenuFold = () => {
    this.setState({
      isMenuFold: !this.state.isMenuFold,
    })
  }

  _handleActionTitle = () => {
    return (
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
        <Button onClick={() => this._handleReset(selectedKeys, clearFilters)} size="small">
          Limpiar
        </Button>
      </div>
    ),
    onFilter: (value, record) => {
      return this._datesInRange(record, dataIndex)
    },
  })

  render() {
    const datesInTimes = _.map(this.state.referrals, (record) => moment(record.createdAt)),
      maxDatesInTimes = moment.max(datesInTimes).add(1, 'days'),
      minDatesInTimes = moment.min(datesInTimes).subtract(1, 'days')

    const { selectedRowKeys, isBulkActive } = this.state

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => Sort(a.id, b.id),
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('id'),
      },
      {
        title: 'Nombre',
        dataIndex: 'firstName',
        key: 'firstName',
        sorter: (a, b) => Sort(a.firstName, b.firstName),
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('firstName'),
      },
      {
        title: 'Apellido',
        dataIndex: 'lastName',
        key: 'lastName',
        sorter: (a, b) => Sort(a.lastName, b.lastName),
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('lastName'),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        sorter: (a, b) => Sort(a.email, b.email),
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('email'),
      },
      {
        title: 'Teléfono',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        sorter: (a, b) => Sort(a.phoneNumber, b.phoneNumber),
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('phoneNumber'),
      },
      {
        title: 'País',
        dataIndex: 'country',
        key: 'country',
        sorter: (a, b) => Sort(a.country, b.country),
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('country'),
      },
      {
        title: 'Ciudad',
        dataIndex: 'city',
        key: 'city',
        sorter: (a, b) => Sort(a.city, b.city),
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('city'),
      },
      {
        title: 'Ocupación',
        dataIndex: 'jobTitle',
        key: 'jobTitle',
        sorter: (a, b) => Sort(a.jobTitle, b.jobTitle),
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('jobTitle'),
      },
      {
        title: 'Monto de la Inversión',
        dataIndex: 'initialAmount',
        key: 'initialAmount',
        sorter: (a, b) => Sort(a.initialAmount, b.initialAmount),
        render: (initialAmount) => DisplayTableAmount(initialAmount),
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('initialAmount'),
      },
      {
        title: 'Creado por el Usuario',
        dataIndex: 'username',
        key: 'username',
        sorter: (a, b) => Sort(a.username, b.username),
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('username'),
      },
      {
        title: 'Broker Principal',
        dataIndex: 'brokerName',
        key: 'brokerName',
        sorter: (a, b) => Sort(a.brokerName, b.brokerName),
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('brokerName'),
      },
      {
        title: 'Broker Adicional',
        dataIndex: 'brokerName2',
        key: 'brokerName2',
        sorter: (a, b) => Sort(a.brokerName2, b.brokerName2),
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('brokerName2'),
      },
      {
        title: 'Fecha de Creación',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (value) => moment(value).tz('America/New_York').format('DD-MM-YYYY'),
        editable: true,
        inputType: 'date',
        required: false,
        rowKey: (d) => {
          return FormatDate(d.createdAt)
        },
        sorter: (a, b) => {
          return this._sortDates(a.createdAt, b.createdAt)
        },
        ...this._getColumnDateProps('createdAt', minDatesInTimes, maxDatesInTimes),
      },
      {
        title: 'Fecha de Actualización',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (value) => moment(value).tz('America/New_York').format('DD-MM-YYYY'),
        editable: true,
        inputType: 'date',
        required: false,
        rowKey: (d) => {
          return FormatDate(d.updatedAt)
        },
        sorter: (a, b) => {
          return this._sortDates(a.updatedAt, b.updatedAt)
        },
        ...this._getColumnDateProps('updatedAt', minDatesInTimes, maxDatesInTimes),
      },
      {
        title: this._handleActionTitle,
        key: 'actions',
        render: this._getCTA,
        fixed: 'right',
        className: 't-a-r fixed-table-actions-panel',
      },
    ]

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectOperation,
      onSelectAll: this.onSelectAllOperation,
    }

    return (
      <Table
        rowSelection={isBulkActive ? rowSelection : null}
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={this.state.referrals}
        loading={this.props.isLoading}
        scroll={{ x: true }}
        title={this._displayTableHeader}
        onChange={this.onTableChange}
        className={classNames({ 'is-menu-fold': this.state.isMenuFold })}
        footer={this._displayTableFooter}
      />
    )
  }
}

function mapStateToProps(state) {
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ReferralsTable)
