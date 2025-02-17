import React, { useState, useEffect } from 'react'
import { isEmpty, split } from 'lodash'
import { Steps, Button, Icon, Tag, Select, Input, Result, Radio } from 'antd'
import classNames from 'classnames'
const { Step } = Steps
const { Option } = Select

const BULK_UPDATE_TYPES = [
  {
    code: 'report',
    name: 'Generar reporte de operaciones',
    scope: 'report',
  },
  {
    code: 'status',
    name: 'Estado',
    scope: 'status',
  },
  {
    code: 'stopLost',
    name: 'Stop Loss',
    scope: 'stopLost',
  },
  {
    code: 'takingProfit',
    name: 'Taking Profit',
    scope: 'takingProfit',
  },
  {
    code: 'buyPrice',
    name: 'Precio de Compra',
    scope: 'buyPrice',
  },
  {
    code: 'stocks',
    name: 'Stocks',
    scope: 'price',
  },
  {
    code: 'index',
    name: 'Index',
    scope: 'price',
  },
  {
    code: 'gold-FT-OP',
    name: 'GOLD Futures - Options',
    scope: 'price',
  },
  {
    code: 'gold-CFD-Ounces',
    name: 'GOLD CFD Ounces',
    scope: 'price',
  },
  {
    code: 'gold-Spot-XAU',
    name: 'GOLD Spot XAU/USD',
    scope: 'price',
  },
  {
    code: 'silver-FT-OP',
    name: 'SILVER Futures - Options',
    scope: 'price',
  },
  {
    code: 'index-FT-OP',
    name: 'Index Futures - Options',
    scope: 'price',
  },
  {
    code: 'silver-CFD-Ounces',
    name: 'SILVER CFD Ounces',
    scope: 'price',
  },
  {
    code: 'platinum-FT-OP',
    name: 'PLATINUM Futures - Options',
    scope: 'price',
  },
  {
    code: 'platinum-CFD-Ounces',
    name: 'PLATINUM CFD Ounces',
    scope: 'price',
  },
  {
    code: 'crudeOil-wti-FT-OP',
    name: 'CRUDE OIL WTI Futures - Options',
    scope: 'price',
  },
  {
    code: 'crudeOil-brent-FT-OP',
    name: 'CRUDE OIL Brent Futures - Options',
    scope: 'price',
  },
  {
    code: 'crude-CFDs-Barrels',
    name: 'CRUDE CFDs Barrels',
    scope: 'price',
  },
  {
    code: 'us-Wheat-Contract-FT-OP',
    name: 'US Wheat Contract FT OP',
    scope: 'price',
  },
  {
    code: 'copper-FT-OP',
    name: 'Copper',
    scope: 'price',
  },
  {
    code: 'cbo-FT-OP',
    name: 'CBO',
    scope: 'price',
  },
  {
    code: 'orange-FT-OP',
    name: 'Orange',
    scope: 'price',
  },
  {
    code: 'natural-FT-OP',
    name: 'Natural FT OP',
    scope: 'price',
  },
  {
    code: 'cocoa-FU-OP',
    name: 'Cocoa',
    scope: 'price',
  },
  {
    code: 'lumber-FT-OP',
    name: 'Lumber FT OP',
    scope: 'price',
  },
  {
    code: 'soybean-FT-OP',
    name: 'Soybean Soja FT',
    scope: 'price',
  },
  {
    code: 'soybean-oil-FT-OP',
    name: 'Soybean Oil US FT OP',
    scope: 'price',
  },
  {
    code: 'soybean-meal-FT-OP',
    name: 'Soybean Meal FT',
    scope: 'price',
  },
  {
    code: 'corn-FT-OP',
    name: 'Corn FT',
    scope: 'price',
  },
  {
    code: 'coffee-FT-OP',
    name: 'Coffee US FT OP',
    scope: 'price',
  },
  {
    code: 'gasoline-FT-OP',
    name: 'RBOB Gasoline FT OP',
    scope: 'price',
  },
  {
    code: 'avena-FT-OP',
    name: 'AVENA – OATS FT',
    scope: 'price',
  },
  {
    code: 'sugar-FT',
    name: "Sugar #11 Jul '21 (SBN21) - FT",
    scope: 'price',
  },
  {
    code: 'sugar-CFD',
    name: "Sugar #11 Jul '21 (SBN21) - CFDs",
    scope: 'price',
  },
  {
    code: 'bushels-CFD',
    name: 'Corn Bushels - CFDs',
    scope: 'price',
  },
  {
    code: 'soybeans-CFD',
    name: 'Soybeans US - CFDs',
    scope: 'price',
  },
  {
    code: 'eur-usd',
    name: 'EUR/USD',
    scope: 'price',
  },
  {
    code: 'gbp-usd',
    name: 'GBP/USD ',
    scope: 'price',
  },
  {
    code: 'bitcoin-FT-CME',
    name: 'BITCOIN FT CME',
    scope: 'price',
  },
  {
    code: 'bitcoin-FT-CME-5-contract',
    name: 'BITCOIN FT CME 5 Contract',
    scope: 'price',
  },
  {
    code: 'btc-usd-fx',
    name: 'BTC / USD - FX',
    scope: 'price',
  },
  {
    code: 'btc-usd-cfx',
    name: 'BTC / USD - CFX',
    scope: 'price',
  },
  {
    code: 'dollar-index-FT',
    name: 'US Dollar Index FT',
    scope: 'price',
  },
  {
    code: 'palladium-FT',
    name: 'Palladium FT',
    scope: 'price',
  },
  {
    code: 'heating-oil-FT-OP',
    name: 'Heating Oil FT',
    scope: 'price',
  },
  {
    code: 'rough-rice-FT',
    name: 'Rough Rice FT',
    scope: 'price',
  },
  {
    code: 'feeder-cattle-FT',
    name: 'Feeder Cattle FT',
    scope: 'price',
  },
  {
    code: 'cotton-FT',
    name: 'Cotton FT',
    scope: 'price',
  },
  {
    code: 'lean-hogs-FT',
    name: 'Lean Hogs FT',
    scope: 'price',
  },
  {
    code: 'lumber-FT',
    name: 'Lumber FT',
    scope: 'price',
  },
  {
    code: 'live-casttle-FT',
    name: 'Live Casttle FT',
    scope: 'price',
  },
  {
    code: 'sp-500-vix-FT',
    name: 'S&P 500 VIX FT',
    scope: 'price',
  },
  {
    code: 'london-sugar-FT',
    name: 'London Sugar FT',
    scope: 'price',
  },
  {
    code: 'ulsd-ny-harbor-FT-OP',
    name: 'ULSD NY Harbor FT',
    scope: 'price',
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
      case 'status':
        return (
          <Radio.Group name="status" onChange={_handleSingleInputChange}>
            <Radio value={1}>
              <Tag color="#039B01">Activo</Tag>
            </Radio>
            <Radio value={2}>
              <Tag color="#D63930">Market Close</Tag>
            </Radio>
            <Radio value={3}>
              <Tag color="#E2A11A">On Hold</Tag>
            </Radio>
            <Radio value={4}>
              <Tag color="#414241">Vendido</Tag>
            </Radio>
          </Radio.Group>
        )
      case 'stopLost':
        return (
          <>
            <Input
              size="large"
              className={`m-r-20 ${behaviorClass}`}
              addonBefore="%"
              style={{ width: 200 }}
              name="stopLost"
              onChange={_handleSingleInputChange}
              placeholder="Stop Loss"
            />
          </>
        )
      case 'takingProfit':
        return (
          <>
            <Input
              size="large"
              className={`m-r-20 ${behaviorClass}`}
              addonBefore="Price $"
              style={{ width: 200 }}
              name="takingProfit"
              onChange={_handleSingleInputChange}
              placeholder="Taking Profit"
            />
          </>
        )
      case 'buyPrice':
        return (
          <>
            <Input
              size="large"
              className={`m-r-20 ${behaviorClass}`}
              addonBefore="Price $"
              style={{ width: 200 }}
              name="buyPrice"
              onChange={_handleSingleInputChange}
              placeholder="Precio de Compra"
            />
          </>
        )
      case 'price':
        return (
          <>
            <Input
              size="large"
              className={`m-r-20 ${behaviorClass}`}
              addonBefore="Precio $"
              style={{ width: 200 }}
              name="gpAmount"
              onChange={_handlePriceInputChange}
              placeholder="Precio"
            />
            <Input
              size="large"
              addonBefore="MP $"
              style={{ width: 200 }}
              name="marketPrice"
              onChange={_handlePriceInputChange}
              placeholder="MP"
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
