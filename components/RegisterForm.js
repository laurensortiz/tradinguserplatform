import React, { useState, useEffect } from 'react'
import { withNamespaces } from 'react-i18next'
import moment from 'moment-timezone'
import { Alert, Button, Form, Icon, Input, Select, Switch } from 'antd'
import Draggable from 'react-draggable'

function RegisterForm({ lng, form }) {
  const [isRegisterFormActive, setIsRegisterFormActive] = useState(false)
  const { getFieldDecorator, resetFields } = form

  useEffect(() => {
    setTimeout(() => {
      setIsRegisterFormActive(true)
    }, 1)
  }, [])

  const alertMessage = (
    <>
      <Icon type="lock" /> Eso
    </>
  )

  const handleSubmit = () => {}
  const handleChange = () => {}

  return isRegisterFormActive ? (
    <div className="overlay-modal">
      <Alert message={alertMessage} type="error" />
      <Draggable handle=".handle">
        <div className="modal-main-wrapper ant-modal-content ant-modal-body">
          <div className="handle" style={{ textAlign: 'center' }}>
            <h2>Registro</h2>
          </div>

          <Form onSubmit={handleSubmit} className="auth-form">
            <Form.Item label="name">
              {getFieldDecorator('transferMethod', {
                rules: [
                  {
                    required: true,
                    message: `es`,
                  },
                ],
              })(
                <Input
                  disabled
                  placeholder="sss"
                  name="accountWithdrawalRequest"
                  onChange={handleChange}
                />
              )}
            </Form.Item>

            <Form.Item>
              <Button
                style={{ width: '100%' }}
                type="primary"
                htmlType="submit"
                size="large"
                className="login-form-button"
                disabled={false}
                loading={false}
              >
                Enviar
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Draggable>
    </div>
  ) : null
}

export default Form.create({ name: 'register' })(withNamespaces()(RegisterForm))
