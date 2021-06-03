import React, { useState, useEffect } from 'react'
import moment from 'moment'
import connect from '../../services/connect'

moment.locale('es') // Set Lang to Spanish

import { Button, Form, Icon, Input, Select, Row, Col } from 'antd'
const { TextArea } = Input

function AddOrEditLeadForm({ id, form }) {
  const { getFieldDecorator } = form
  const [dataForm, setDataForm] = useState({
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    country: '',
    notes: '',
    status: 1,
  })

  const { data, isLoading: isLoadingLead, isSuccess: isSuccessLead } = connect.useGetLead(id)

  const { mutateAsync, isLoading, isSuccess, isError } = connect.useUpdateLead(dataForm)

  useEffect(() => {
    if (isSuccessLead) {
      setDataForm(data)
    }
  }, [isSuccessLead, data])

  const handleSubmit = (e) => {
    e.preventDefault()
    form.validateFields(async (err) => {
      if (!err) {
        await mutateAsync(dataForm)
      }
    })
  }

  const handleChange = ({ target }) => {
    setDataForm((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }))
  }

  return (
    <Form onSubmit={handleSubmit} className="auth-form">
      <Col sm={12}>
        <Form.Item label="Nombre">
          {getFieldDecorator('firstName', {
            initialValue: dataForm.firstName,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="Nombre" name="firstName" onChange={handleChange} />)}
        </Form.Item>
      </Col>
      <Col sm={12}>
        <Form.Item label="Apellido">
          {getFieldDecorator('lastName', {
            initialValue: dataForm.lastName,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="Apellido" name="lastName" onChange={handleChange} />)}
        </Form.Item>
      </Col>

      <Col sm={12}>
        <Form.Item label="Email">
          {getFieldDecorator('email', {
            initialValue: dataForm.email,
            rules: [
              {
                type: 'email',
                message: 'Correo no válido',
              },
              {
                required: false,
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
        <Form.Item label="País">
          {getFieldDecorator('country', {
            initialValue: dataForm.country,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="País" name="country" onChange={handleChange} />)}
        </Form.Item>
      </Col>
      <Col sm={24}>
        <Form.Item label="Teléfono">
          {getFieldDecorator('phoneNumber', {
            initialValue: dataForm.phoneNumber,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input style={{ width: '100%' }} name="phoneNumber" onChange={handleChange} />)}
        </Form.Item>
      </Col>
      <Col xs={12}>
        <hr />
        <Form.Item label="Notas Administrativas">
          {getFieldDecorator('notes', {
            initialValue: dataForm.notes,
            rules: [
              {
                required: false,
                message: 'Por favor ingrese su nota',
              },
            ],
          })(<TextArea rows={8} placeholder="" name="notes" onChange={handleChange} />)}
        </Form.Item>
        <Form.Item>
          <Button
            style={{ width: '100%' }}
            type="primary"
            htmlType="submit"
            size="large"
            className="login-form-button"
            loading={isLoading}
          >
            Guardar Actualización
          </Button>
        </Form.Item>
      </Col>
    </Form>
  )
}

export default Form.create({ name: 'register' })(AddOrEditLeadForm)
