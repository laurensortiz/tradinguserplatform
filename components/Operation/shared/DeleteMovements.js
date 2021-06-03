import React, { useState, useEffect } from 'react'
import { Button, Icon, DatePicker, Input, Row, Col, Popconfirm } from 'antd'
import connect from '../../../services/connect'
import moment from 'moment-timezone'

export default function DeleteMovements() {
  const [isDeleteActive, setIsDeleteActive] = useState(false)
  const [marketPrice, setMarketPrice] = useState(0)
  const [createdAt, setCreatedAt] = useState(null)
  const [shouldDelete, setShouldDelete] = useState(false)
  const isRequestReady = marketPrice > 0 && !!createdAt
  const { data: dataCount, isLoading, refetch } = connect.useMovementsCount({
    marketPrice,
    createdAt,
    enabled: isRequestReady,
  })

  const {
    isLoading: isDeletionLoading,
    isSuccess: isDeletionSuccess,
  } = connect.useBulkDeleteMovements({
    marketPrice,
    createdAt,
    enabled: shouldDelete,
  })

  const hasMovements = dataCount && dataCount.count > 0

  const handleMPChange = (e) => {
    const currentValue = e.target.value === '' ? 0 : e.target.value.replace(',', '')
    setMarketPrice(Number(currentValue))
  }

  const handleCreatedAtChange = (date, dateString) => {
    setCreatedAt(dateString)
  }

  const onConfirmDeletion = async () => {
    setShouldDelete(true)
  }

  const close = () => {
    setIsDeleteActive(false)
    setMarketPrice(0)
    setCreatedAt(null)
    setShouldDelete(false)
  }

  useEffect(() => {
    if (isRequestReady) {
      refetch()
    }
  }, [isRequestReady])

  return isDeleteActive ? (
    <Row gutter={16}>
      <Col sm={4}>
        <Input type="number" name="commoditiesTotal" onChange={handleMPChange} placeholder="MP" />
      </Col>
      <Col sm={8}>
        <DatePicker
          onChange={handleCreatedAtChange}
          defaultPickerValue={moment.parseZone()}
          placeholder="Fecha de movimiento"
        />
      </Col>
      <Col sm={12}>
        <Popconfirm
          okText="Si"
          title={`Desea eliminar los ${dataCount && dataCount.count} registros?`}
          cancelText="Cancelar"
          onConfirm={() => onConfirmDeletion()}
          disabled={!hasMovements || isDeletionSuccess}
        >
          <Button
            type="danger"
            loading={isLoading || isDeletionLoading}
            disabled={!hasMovements || isDeletionSuccess}
            className={isDeletionSuccess ? 'export-excel-cta' : ''}
          >
            {isDeletionSuccess
              ? 'Finalizado'
              : `Eliminar (${(dataCount && dataCount.count) || 0} registros)`}
          </Button>
        </Popconfirm>

        <Button type="secondary" style={{ marginLeft: 16 }} onClick={close}>
          <Icon type="close-circle" />
        </Button>
      </Col>
    </Row>
  ) : (
    <Button onClick={() => setIsDeleteActive(true)} type="danger" style={{ marginBottom: 16 }}>
      <Icon type="delete" /> Eliminar Múltiples Movimientos
    </Button>
  )
}
