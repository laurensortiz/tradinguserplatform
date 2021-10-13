import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import _ from 'lodash'

import { Button, Col, Icon, Input, Popconfirm, Row, Table, Tag, Tooltip } from 'antd'
import {
  Sort,
  FormatStatusLang,
  FormatDate,
  SortDate,
  DisplayTableAmount,
} from '../../../../common/utils'
import classNames from 'classnames'
import Highlighter from 'react-highlight-words'

class FundTable extends Component {
  state = {
    operations: [],
    isMenuFold: true,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEqual(nextProps.operations, prevState.operations)) {
      return {
        users: nextProps.operations,
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
              <Button type="secondary" onClick={() => this.props.onEdit(row.id)}>
                <Icon type="edit" />
                <span>Editar</span>
              </Button>
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
          placeholder={this.props.t('btn search')}
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
          {this.props.t('btn search')}
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          {this.props.t('btn clean')}
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
          <Tooltip placement="top" title={this.props.t('btn syncData')}>
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
          {`${this.props.t('totalOperations')}:`}{' '}
          <Tag color="#1b1f21" style={{ fontSize: 14, marginLeft: 10 }}>
            {_.size(this.props.investmentOperations)}
          </Tag>
        </h3>
      </Col>
    </Row>
  )

  render() {
    console.log('[=====  FFKFKF  =====>')
    console.log()
    console.log('<=====  /FFKFKF  =====]')
    const { t } = this.props
    const showHandleClass = this.props.isAdmin ? 'show' : 'hidden'
    const langStatus = (status) => t(`status ${status}`)
    const columns = [
      {
        title: t('status'),
        dataIndex: 'status',
        key: 'status',
        filters: [
          { text: `${t('status active')}`, value: 1 },
          { text: `${t('status marketClose')}`, value: 2 },
          { text: `${t('status hold')}`, value: 3 },
          { text: `${t('status sold')}`, value: 4 },
        ],
        onFilter: (value, record) => record.status === value,
        filterMultiple: false,
        render: (status) => {
          const { name, color } = FormatStatusLang(status)
          return <Tag color={color}>{langStatus(name.toLowerCase())}</Tag>
        },
        sorter: (a, b) => Sort(a.status, b.status),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: t('username'),
        dataIndex: 'userAccount.user.username',
        key: 'userAccount.user.username',
        className: `${showHandleClass} `,
        sorter: (a, b) => Sort(a.userAccount.user.username, b.userAccount.user.username),
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('userAccount.user.username'),
      },
      {
        title: t('firstName'),
        dataIndex: 'userAccount.user.firstName',
        key: 'userAccount.user.firstName',
        render: (text) => <span key={text}>{text}</span>,
        sorter: (a, b) => Sort(a.userAccount.user.firstName, b.userAccount.user.firstName),
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('userAccount.user.firstName'),
      },
      {
        title: t('lastName'),
        dataIndex: 'userAccount.user.lastName',
        key: 'userAccount.user.lastName',
        render: (text) => <span key={text}>{text}</span>,
        sorter: (a, b) => Sort(a.userAccount.user.lastName, b.userAccount.user.lastName),
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('userAccount.user.lastName'),
      },
      {
        title: t('operationType'),
        dataIndex: 'operationType',
        key: 'operationType',
        render: (text) => <span key={text}>{text}</span>,
        sorter: (a, b) => Sort(a.operationType, b.operationType),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: t('userAccount'),
        dataIndex: 'userAccount',
        key: 'account',
        render: (text) => <span key={text.accountId}>{text.account.name}</span>,
        sorter: (a, b) => Sort(a.userAccount.account.name, b.userAccount.account.name),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: t('currentAmount'),
        dataIndex: 'amount',
        key: 'amount',
        render: (amount) => <span key={amount}>{DisplayTableAmount(amount)}</span>,
        sorter: (a, b) => Sort(a.amount, b.amount),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: t('createdAt'),
        dataIndex: 'startDate',
        key: 'startDate',
        render: (date, row) => <span className="date">{FormatDate(date)}</span>,
        sorter: (a, b) => SortDate(a.startDate, b.startDate),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: t('expirationDate'),
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
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={this.props.investmentOperations}
        loading={this.props.isLoading}
        scroll={{ x: true }}
        className={classNames({
          'hidden-table': !this.props.isAdmin && _.isEmpty(this.props.investmentOperations),
          'is-menu-fold': this.state.isMenuFold,
        })}
        footer={this._displayTableFooter}
      />
    )
  }
}

function mapStateToProps(state) {
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces()(FundTable))
