import React, { useState, useEffect } from 'react'
import { isEmpty, split } from 'lodash'
import { Steps, Button, Icon, Tag, Select, Input, Result, Row, Col, DatePicker, Form } from 'antd'
import classNames from 'classnames'
import moment from "moment";
const { Step } = Steps
const { Option } = Select

const BULK_UPDATE_TYPES = [
  {
    code: 'percentage',
    name: 'Porcenge',
    scope: 'percentage',
  },
  {
    code: 'report',
    name: 'Generar reporte de operaciones',
    scope: 'report',
  },
]

function BulkUpdateSteps({
  selectedElements,
  onClickUpdate,
  isProcessComplete,
  isBulkLoading,
  isBulkSuccess,
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [updateType, setUpdateType] = useState('')
  const [updateDate, setUpdateDate] = useState(null)
  const [updateScope, setUpdateScope] = useState('')
  const [updateValue, setUpdateValue] = useState({})
  const [behaviorClass, setBehaviorClass] = useState('')
  const [isValidAmount, setIsValidAmount] = useState(true)
  const [isValidOperation, setIsValidOperation] = useState(false)

  useEffect(() => {
    setIsValidAmount(true)
    setBehaviorClass('')
    setUpdateValue(null)
  }, [updateType])


  const _handleSingleInputChange = ({ target }) => {
    setUpdateValue(target.value)
  }

  const _handleDateChange = (value) => {
    setUpdateDate(moment.parseZone(value).format())
  }

  const _onSelectActionType = (value) => {
    const operationValue = split(value, '_')

    setUpdateType(operationValue[0])
    setUpdateScope(operationValue[1])
  }


  const _bulkUpdateValue = () => {
    switch (updateScope) {
      case 'percentage':
        return (
          <>
            <Row type="flex" justify="center">
              <Col span={4}>
                <Input
                  size="large"
                  className={`m-r-20 ${behaviorClass}`}
                  addonBefore="%"
                  style={{ width: 200 }}
                  name="percentage"
                  onChange={_handleSingleInputChange}
                  placeholder="Porcentage"
                />
              </Col>
              <Col span={4}>
                <DatePicker

                  name="createdAt"
                  onChange={_handleDateChange}
                  defaultPickerValue={moment.parseZone()}
                  placeholder="Fecha de Creación"
                />
              </Col>
            </Row>

          </>
        )

      default:
        return <div className="no-visible" style={{ width: 150, height: 40 }} />
    }
  }

  const _selectUpdateType = () => (
    <div style={{ textAlign: 'center' }}>
      <Select
        showSearch={true}
        size="large"
        defaultValue=""
        style={{ minWidth: '20%' }}
        onChange={_onSelectActionType}
      >
        <Option key="0" value="">
          Seleccione el Registro
        </Option>
        {BULK_UPDATE_TYPES.map(({ code, name, scope }, index) => (
          <Option key={index + 1} value={`${code}_${scope}`}>
            {name}
          </Option>
        ))}
      </Select>
      <div style={{ marginTop: 20, minHeight: 40 }}>
        {_bulkUpdateValue()}
        {!isValidAmount ? <p className="m-t-20 negative">Monto inválido</p> : null}
      </div>
    </div>
  )

  const _lastStepContent = () => {
    const title = isProcessComplete ? (
      isBulkSuccess ? (
        <span>
          <Tag color="#046d11">{selectedElements}</Tag>Productos actualizados correctamente
        </span>
      ) : (
        'Ocurrió un error'
      )
    ) : (
      <span>
        Proceder con la actualización de <Tag color="#046d11">{selectedElements}</Tag>productos
      </span>
    )
    const status = isProcessComplete ? (isBulkSuccess ? 'success' : 'error') : 'info'

    return (
      <Result
        title={title}
        status={status}
        extra={
          <Button
            size="large"
            type="primary"
            key="console"
            onClick={() => onClickUpdate({ updateType, updateValue, updateScope, updateDate })}
            loading={isBulkLoading}
            className={classNames({ 'no-visible': isProcessComplete })}
          >
            Realizar actualización
          </Button>
        }
      />
    )
  }

  const steps = [
    {
      title: 'Seleccione las operaciones',
      content: (
        <h3>
          Operaciones seleccionadas <Tag color="#046d11">{selectedElements}</Tag>
        </h3>
      ),
    },
    {
      title: 'Registro y Valor',
      content: _selectUpdateType(),
    },
    {
      title: 'Confirmación',
      content: _lastStepContent(),
    },
  ]

  return (
    <>
      <Steps current={currentStep}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[currentStep].content}</div>

      <div className="steps-action">
        {currentStep > 0 && (
          <Button style={{ marginRight: 15 }} onClick={() => setCurrentStep(currentStep - 1)}>
            <Icon type="left-square" /> Anterior
          </Button>
        )}
        {currentStep < steps.length - 1 && selectedElements > 0 && (
          <Button
            type="primary"
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={
              (updateType !== 'status' && !isValidAmount && isEmpty(updateValue)) ||
              (currentStep === 1 && updateType === '') ||
              (updateType === 'percentage' && !updateValue)
            }
          >
            Siguiente <Icon type="right-square" />
          </Button>
        )}
      </div>
      <style jsx>{`
        .steps-content {
          padding: 30px 0;
        }
        .steps-action {
          min-height: 40px;
        }
      `}</style>
    </>
  )
}

export default BulkUpdateSteps
