import React, { useState, useEffect } from 'react'
import { isEmpty, split } from 'lodash'
import { Steps, Button, Icon, Tag, Select, Input, Result, Radio } from 'antd'
import classNames from 'classnames'
const { Step } = Steps
const { Option } = Select

const BULK_UPDATE_TYPES = [
  {
    code: 'percentage',
    name: 'Porcenge',
    scope: 'percentage',
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

  const _isValidAmount = (amount) => {
    const regex = /^-?[0-9]\d*(((,\d{3}){1})?(\.\d{0,4})?)$/
    const isValid = regex.test(amount)
    setIsValidAmount(isValid)
    if (!isValid) {
      setBehaviorClass('')
    }
    return isValid
  }

  const _isPositiveAmount = (amount) => {
    const isPositive = Math.sign(amount) >= 0
    setBehaviorClass(isPositive ? 'positive-amount' : 'negative-amount')
    return isPositive
  }

  const _handlePriceInputChange = ({ target }) => {
    if (target.name !== 'marketPrice') {
      _isPositiveAmount(target.value)
    }

    _isValidAmount(target.value)

    setUpdateValue({
      ...updateValue,
      [target.name]: target.value,
    })
  }

  const _handleSingleInputChange = ({ target }) => {
    setUpdateValue(target.value)
  }

  const _onSelectActionType = (value) => {
    const operationValue = split(value, '_')

    setUpdateType(operationValue[0])
    setUpdateScope(operationValue[1])
  }

  const _onRequestSaveOperation = (operationInfo) => {
    setIsValidOperation(true)
    setUpdateValue(operationInfo)
  }

  const _bulkUpdateValue = () => {
    switch (updateScope) {
      case 'percentage':
        return (
          <>
            <Input
              size="large"
              className={`m-r-20 ${behaviorClass}`}
              addonBefore="%"
              style={{ width: 200 }}
              name="percentage"
              onChange={_handleSingleInputChange}
              placeholder="Porcentage"
            />
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
            onClick={() => onClickUpdate({ updateType, updateValue, updateScope })}
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
              (updateType === 'status' && !Number.isInteger(updateValue)) ||
              (updateType === 'create-operation' && !isValidOperation)
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
