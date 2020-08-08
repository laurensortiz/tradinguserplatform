import React, { useState, useEffect } from 'react';
import { Steps, Button, Icon, Tag, Select, Input, Result } from 'antd';

const { Step } = Steps;
const { Option } = Select;
const InputGroup = Input.Group;

const BULK_UPDATE_TYPES = [
  {
    code: 'status',
    name: 'Estado'
  },
  {
    code: 'stockProduct',
    name: 'Stocks'
  }
];

function BulkUpdateSteps({ selectedElements, onClickUpdate, isProcessComplete, isBulkLoading, isBulkSuccess }) {
  const [ currentStep, setCurrentStep ] = useState( 0 );
  const [ updateType, setUpdateType ] = useState( null );
  const [ updateValue, setUpdateValue ] = useState( null );

  useEffect( () => {
    const fetchData = () => {

    };

    fetchData();
  }, [] );


  const _bulkUpdateValue = () => {

    switch (updateType) {
      case 'status':
        return (
          <Select
            name="bulkUpdateValue"
            onChange={ value =>  setUpdateValue(value)}
            placeholder="Estado"
            style={ { width: '30%' } }
          >
            <Option value={ 1 }><Tag color="#039B01">Activo</Tag></Option>
            <Option value={ 2 }><Tag color="#D63930">Cerrado</Tag></Option>
            <Option value={ 3 }><Tag color="#E2A11A">On Hold</Tag></Option>
            <Option value={ 4 }><Tag color="#414241">Vendido</Tag></Option>
          </Select>
        )
      default:
        return <Input  style={ { width: '30%' } } disabled/>
    }
  };

  const _selectUpdateType = () => (
    <div style={ { textAlign: 'center' } }>
      <InputGroup compact>
        <Select defaultValue="" style={ { minWidth: '20%' } } onChange={ value => setUpdateType( value ) }>
          <Option key="0" value="">Seleccione el Registro</Option>
          {
            BULK_UPDATE_TYPES.map( ({ code, name }, index) =>
              <Option key={ index + 1 } value={ code }>{ name }</Option> )
          }
        </Select>
        {_bulkUpdateValue()}
      </InputGroup>
    </div>
  );

  const _lastStepContent = () => {
    const btnTxt = isProcessComplete ? 'Actualizar de nuevo' : 'Realizar actualización';
    const title = isProcessComplete ? isBulkSuccess ? <span><Tag color="#046d11">{selectedElements}</Tag> Productos actualizados correctamente</span> : 'Ocurrió un error' : <span>Proceder con la actualización de <Tag color="#046d11">{selectedElements}</Tag> productos</span>;
    const status = isProcessComplete ? isBulkSuccess ? 'success' : 'error' : 'info';
    
    console.log('[=====  TESS  =====>');
    console.log(isProcessComplete);
    console.log(isBulkSuccess);
    console.log(status);
    console.log('<=====  /TESS  =====]');

    return (
      <Result
        title={title}
        status={status}
        extra={
          <Button
            size="large"
            type="primary"
            key="console"
            onClick={ () => onClickUpdate({updateType, updateValue})}
            loading={isBulkLoading}
            className="export-excel-cta"
          >
            {btnTxt}
          </Button>
        }
      />
    )
  }


  const steps = [
    {
      title: 'Seleccione las operaciones',
      content: (
        <h3>Operaciones seleccionadas <Tag color="#046d11">{ selectedElements }</Tag></h3>
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

      <div className="steps-action" >
        { currentStep > 0 && (
          <Button style={ { marginRight: 15 } } onClick={ () => setCurrentStep( currentStep - 1 ) }>
            <Icon type="left-square" /> Anterior
          </Button>
        ) }
        { currentStep < steps.length - 1 && selectedElements > 0 && (
          <Button type="primary" onClick={ () => setCurrentStep( currentStep + 1 ) }>
            Siguiente <Icon type="right-square" />
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
