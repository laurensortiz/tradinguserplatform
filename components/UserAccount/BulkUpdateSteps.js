import React, { useState, useEffect } from 'react';
import _, { isEmpty, split } from 'lodash';
import { Steps, Button, Icon, Tag, Select, Input, Result, Radio } from 'antd';
import classNames from 'classnames';
const { Step } = Steps;
const { Option } = Select;

import AddOperationForm from '../Operation/Market/AddOrEditMarketForm';

const BULK_UPDATE_TYPES = [
  {
    code: 'report',
    name: 'Generar reporte de cuentas',
    scope: 'report'
  },
  {
    code: 'create-operation',
    name: 'Colocaciones',
    scope: 'create-operation'
  },
];

function BulkUpdateSteps({ selectedElements, onClickUpdate, isProcessComplete, isBulkLoading, isBulkSuccess }) {
  const [ currentStep, setCurrentStep ] = useState( 0 );
  const [ updateType, setUpdateType ] = useState( '' );
  const [ updateScope, setUpdateScope ] = useState( '' );
  const [ updateValue, setUpdateValue ] = useState( {} );
  const [ behaviorClass, setBehaviorClass ] = useState( '' );
  const [ isValidAmount, setIsValidAmount ] = useState( true );
  const [ isValidOperation, setIsValidOperation ] = useState( false );

  useEffect( () => {
    setIsValidAmount( true )
    setBehaviorClass( '' )
    setUpdateValue( null )
  }, [ updateType ] );


  const _isValidAmount = amount => {
    const regex = /^-?[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
    const isValid = regex.test( amount );
    setIsValidAmount( isValid )
    if (!isValid) {
      setBehaviorClass( '' )
    }
    return isValid
  }

  const _isPositiveAmount = amount => {
    const isPositive = Math.sign( amount ) >= 0;
    setBehaviorClass( isPositive ? 'positive-amount' : 'negative-amount' )
    return isPositive;
  }

  const _handlePriceInputChange = ({ target }) => {
    if (target.name !== 'marketPrice') {
      _isPositiveAmount( target.value )
    }

    _isValidAmount( target.value )

    setUpdateValue( {
      ...updateValue,
      [ target.name ]: target.value
    } )
  }

  const _handleRadioInputChange = ({ target }) => {
    setUpdateValue(target.value)
  }

  const _onSelectActionType = (value) => {
    const operationValue = split(value, '_');

    setUpdateType(operationValue[0]);
    setUpdateScope(operationValue[1]);
  }

  const _onRequestSaveOperation = operationInfo => {
    setIsValidOperation(true);
    setUpdateValue(operationInfo)
  }


  const _bulkUpdateValue = () => {

    switch (updateScope) {
      case 'report':
        return (
          <span></span>

        )
      case 'price':
        return (
          <>
            <Input size="large" className={ `m-r-20 ${ behaviorClass }` } addonBefore="Precio $"
                   style={ { width: 200 } }
                   name="gpAmount" onChange={ _handlePriceInputChange }
                   placeholder="Precio"/>
            <Input size="large" addonBefore="MP $" style={ { width: 200 } } name="marketPrice"
                   onChange={ _handlePriceInputChange }
                   placeholder="MP"/>
          </>
        )
      case 'create-operation':
        return (
          <AddOperationForm actionType="add" isBulkOperation={true} onRequestSaveOperation={_onRequestSaveOperation} />
        )
      default:
        return <div className="no-visible" style={ { width: 150, height: 40 } } />
    }
  };

  const _selectUpdateType = () => (
    <div style={ { textAlign: 'center' } }>

      <Select showSearch={true} size="large" defaultValue="" style={ { minWidth: '20%' } } onChange={ _onSelectActionType }>
        <Option key="0" value="">Seleccione el Registro</Option>
        {
          BULK_UPDATE_TYPES.map( ({ code, name, scope }, index) =>
            <Option key={ index + 1 } value={ `${code}_${scope}` }>{ name }</Option> )
        }
      </Select>
      <div style={ { marginTop: 20, minHeight: 40 } }>
        { _bulkUpdateValue() }
        { !isValidAmount ? (
          <p className="m-t-20 negative">Monto inválido</p>
        ) : null }
      </div>

    </div>
  );

  const _lastStepContent = () => {
    const title = isProcessComplete ? isBulkSuccess ? <span><Tag color="#046d11">{ selectedElements }</Tag>Cuentas actualizadas correctamente</span> : 'Ocurrió un error' :
      <span>Proceder con la actualización de <Tag color="#046d11">{ selectedElements }</Tag>cuentas</span>;
    const status = isProcessComplete ? isBulkSuccess ? 'success' : 'error' : 'info';

    return (
      <Result
        title={ title }
        status={ status }
        extra={ <Button
          size="large"
          type="primary"
          key="console"
          onClick={ () => onClickUpdate( { updateType, updateValue, updateScope } ) }
          loading={ isBulkLoading }
          className={classNames({'no-visible': isProcessComplete})}
        >
          Realizar proceso
        </Button>}
      />
    )
  }

  const steps = [
    {
      title: 'Seleccione las cuentas',
      content: (
        <h3>Cuentas seleccionadas <Tag color="#046d11">{ selectedElements }</Tag></h3>
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
  ];

  return (
    <>
      <Steps current={ currentStep }>
        { steps.map( item => (
          <Step key={ item.title } title={ item.title }/>
        ) ) }
      </Steps>
      <div className="steps-content">{ steps[ currentStep ].content }</div>

      <div className="steps-action">
        { currentStep > 0 && (
          <Button style={ { marginRight: 15 } } onClick={ () => setCurrentStep( currentStep - 1 ) }>
            <Icon type="left-square"/> Anterior
          </Button>
        ) }
        { currentStep < steps.length - 1 && selectedElements > 0 && (
          <Button type="primary" onClick={ () => setCurrentStep( currentStep + 1 ) }
                  disabled={ (updateType !== 'status' && !isValidAmount && isEmpty(updateValue)) || (updateType === 'status' && !Number.isInteger(updateValue)) || (updateType === 'create-operation' && !isValidOperation)}>
            Siguiente <Icon type="right-square"/>
          </Button>
        ) }

      </div>
      <style jsx>{
        `
        .steps-content {
          padding: 30px 0;

        }
        .steps-action {
          min-height: 40px;
        }
        
        `
      }</style>
    </>
  )
}

export default BulkUpdateSteps;
