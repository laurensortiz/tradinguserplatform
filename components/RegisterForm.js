import React, { useState, useEffect } from 'react'
import { withNamespaces } from 'react-i18next'
import styled from 'styled-components'
import connect from '../services/connect'

import { Alert, Button, Form, Icon, Input, Select, Modal, Row, Col } from 'antd'

import PhoneAreaCode from '../common/utils/phone-area-codes.json'

const { Option } = Select

const ModalForm = styled(Modal)`
  padding: 0;
  z-index: 1;
`

const ModalAlert = styled(Alert)`
  font-size: 1.8rem;
  margin-bottom: 25px;

  .ant-alert-message {
    color: ${(props) => props.theme.colors.red};
  }
  i {
    color: ${(props) => props.theme.colors.red};
  }
`

const Title = styled.h1`
  font-size: 2.3rem;
  font-weight: bold;
`

const AlertMessage = styled(Alert)`
  font-size: 1.6rem;
  text-align: center;
  margin-bottom: 15px;
`

const TIMEOUT_MODAL = 10000 // 5 minutes

function RegisterForm({ lng, form, t }) {
  const [isRegisterFormActive, setIsRegisterFormActive] = useState(false)
  const [phoneAreaCode, setPhoneAreaCode] = useState('+1')
  const [dataForm, setDataForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    country: '',
    email: '',
  })
  const { getFieldDecorator, resetFields } = form

  const metaDataForm = {
    ...dataForm,
    phoneNumber: `${phoneAreaCode} ${dataForm.phoneNumber}`,
  }

  const { mutate, isLoading, isSuccess, isError } = connect.useCreateLead(metaDataForm)

  useEffect(() => {
    setTimeout(() => {
      setIsRegisterFormActive(true)
    }, TIMEOUT_MODAL)
  }, [])

  const alertMessage = (
    <>
      <Icon type="lock" /> Esta sección esta abierta sólo para clientes, inicie sesión o registrese,
      para ser contactado por un Broker de Royal Capital.
    </>
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    form.validateFields(async (err) => {
      if (!err) {
        await mutate()
      }
    })
  }
  const handlePhoneAreaCode = (value) => {
    setPhoneAreaCode(value.split(',')[1])
  }

  const handleChange = ({ target }) => {
    setDataForm((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }))
  }

  const prefixSelector = getFieldDecorator('prefix', {
    initialValue: 'United States (+1)',
  })(
    <Select style={{ width: 200 }} showSearch={true} onChange={handlePhoneAreaCode}>
      {PhoneAreaCode.countries.map(({ code, name }) => (
        <Option key={code} value={`${name}, ${code}`}>{`${name} (${code})`}</Option>
      ))}
    </Select>
  )

  return isRegisterFormActive ? (
    <ModalForm width="90%" visible={isRegisterFormActive} centered footer="" closable={false}>
      <div className="register-form">
        <ModalAlert message={alertMessage} type="error" />
        <div className="modal-main-wrapper ant-modal-content ant-modal-body">
          <Row gutter={20}>
            <Col sm={12}>
              {isSuccess && (
                <AlertMessage
                  message="¡Información recibida! Muy pronto le contactaremos."
                  type="success"
                />
              )}
              {isError && (
                <AlertMessage
                  message="¡Ocurrió un error! Por favor vuelva a intentar."
                  type="error"
                />
              )}
              <Form onSubmit={handleSubmit} className="auth-form">
                <Col sm={12}>
                  <Form.Item label={t('firstName')}>
                    {getFieldDecorator('firstName', {
                      rules: [
                        {
                          required: true,
                          message: `${t('requiredFieldMessage')} ${t('firstName')}`,
                        },
                      ],
                    })(
                      <Input
                        placeholder={t('firstName')}
                        name="firstName"
                        onChange={handleChange}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col sm={12}>
                  <Form.Item label={t('lastName')}>
                    {getFieldDecorator('lastName', {
                      rules: [
                        {
                          required: true,
                          message: `${t('requiredFieldMessage')} ${t('lastName')}`,
                        },
                      ],
                    })(
                      <Input placeholder={t('lastName')} name="lastName" onChange={handleChange} />
                    )}
                  </Form.Item>
                </Col>

                <Col sm={12}>
                  <Form.Item label="Email">
                    {getFieldDecorator('email', {
                      rules: [
                        {
                          type: 'email',
                          message: t('notValidMessage'),
                        },
                        {
                          required: true,
                          message: `${t('requiredFieldMessage')} ${t('firstName')}`,
                        },
                      ],
                    })(
                      <Input
                        name="email"
                        type="email"
                        onChange={handleChange}
                        prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Email"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col sm={12}>
                  <Form.Item label={t('country')}>
                    {getFieldDecorator('country', {
                      rules: [
                        {
                          required: true,
                          message: `${t('requiredFieldMessage')} ${t('country')}`,
                        },
                      ],
                    })(<Input placeholder={t('country')} name="country" onChange={handleChange} />)}
                  </Form.Item>
                </Col>
                <Col sm={24}>
                  <Form.Item label={t('phone')}>
                    {getFieldDecorator('phoneNumber', {
                      rules: [
                        {
                          required: true,
                          message: `${t('requiredFieldMessage')} ${t('phone')}`,
                        },
                      ],
                    })(
                      <Input
                        style={{ width: '100%' }}
                        addonBefore={prefixSelector}
                        placeholder={t('phone')}
                        name="phoneNumber"
                        onChange={handleChange}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Button
                    style={{ width: '100%' }}
                    type="primary"
                    htmlType="submit"
                    size="large"
                    className="login-form-button"
                    disabled={isSuccess}
                    loading={isLoading}
                  >
                    Regístrese
                  </Button>
                </Col>
                <Col xs={12}>
                  <Button
                    style={{ width: '100%' }}
                    type="secondary"
                    size="large"
                    onClick={() => (window.location = '/')}
                  >
                    Login
                  </Button>
                </Col>
              </Form>
            </Col>
            <Col sm={12}>
              <Title>¿No tienes una cuenta?</Title>
              <p className="t-a-j" style={{ fontSize: 18 }}>
                Como todas las oportunidades de inversión, operar con Forex, Materias Primas o
                Acciones, implican altos rendimientos o un riesgo de pérdida. Aquí en Royal Capital,
                le brindamos acceso a un centro educativo, herramientas de gestión de riesgos y un
                equipo de atención al cliente, aparte de las opciones de manejar usted su propia
                cartera, como a que un gestor profesional opere la inversión por usted.
              </p>
            </Col>
          </Row>
        </div>
      </div>
    </ModalForm>
  ) : null
}

export default Form.create({ name: 'register' })(withNamespaces()(RegisterForm))
