import React, { useState, useEffect } from 'react'
import moment from 'moment'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import { Input, Button, Form, DatePicker, Icon, Radio, Row, Col, Select } from 'antd'
import connect from '../../services/connect'
import _ from 'lodash'

moment.locale('es') // Set Lang to Spanish

const { Option } = Select

const MAX_NUMBER_USERS = 5

function AddOrEditUserForm({ form, selectedUser, actionType, onAddNew, onEdit, isLoading }) {
  const {
    isLoading: isLoadingUsers,
    data: adminUsers,
    isSuccess: adminUsersSuccess,
  } = connect.useGetUsers({
    status: 1,
    role: 1,
  })

  const initUserData = Object.keys(selectedUser).length > 0 ? selectedUser : { roleId: 2 }

  const [userData, setUserData] = useState(initUserData)
  const [totalExtraUsers, setTotalExtraUsers] = useState(0)
  const isAdminUser = userData.roleId === 1
  const { getFieldDecorator } = form
  const isEditAction = actionType === 'edit'

  useEffect(() => {
    if (Object.keys(selectedUser).length > 0 && actionType === 'edit') {
      // Set TotalExtraUser based on the corresponding not empty property
      const arr = [...Array(MAX_NUMBER_USERS)]
      let totalExtraUsers = 0
      arr.map((newUser, index) => {
        //Index should init at 2 so, for that reason we are doing ++index + 1
        if (!isEmpty(selectedUser[`firstName${++index + 1}`])) totalExtraUsers = ++totalExtraUsers
      })
      setTotalExtraUsers(totalExtraUsers)
    }
  }, [])

  const onInputChange = (e) => {
    let value = ''
    if (e.type === 'checkbox') {
      value = e.target.checked ? 1 : 0
    } else {
      value = e.target.value
    }
    setUserData((prev) => {
      return {
        ...prev,
        [e.name]: value,
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    form.validateFields((err) => {
      if (!err) {
        if (isEqual(actionType, 'add')) {
          onAddNew(userData)
        } else {
          onEdit(userData)
        }
      }
    })
  }

  const handleSetDate = ({ inputName, date }) => {
    setUserData((prev) => {
      return {
        ...prev,
        [inputName]: moment.parseZone(date).format(),
      }
    })
  }

  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== form.getFieldValue('password')) {
      callback('Las dos contraseñas no son iguales')
    } else {
      callback()
    }
  }

  const validateToNextPassword = (rule, value, callback) => {
    if (value) {
      form.validateFields(['verifyPassword'], { force: true })
    }
    callback()
  }

  const onAddExtraUser = () => {
    if (totalExtraUsers < MAX_NUMBER_USERS) {
      //Max 4 extra users
      setTotalExtraUsers((prev) => prev + 1)
    }
  }

  const onRemoveExtraUser = () => {
    if (totalExtraUsers > 0) {
      //Max 4 extra users
      setTotalExtraUsers((prev) => prev - 1)
      setUserData((prev) => {
        return {
          ...prev,
          [`firstName${totalExtraUsers + 1}`]: '',
          [`lastName${totalExtraUsers + 1}`]: '',
        }
      })
    }
  }

  const handleAddExtraUser = (getFieldDecorator) => {
    return [...Array(totalExtraUsers)].map((newUser, index) => {
      const currentFieldIndex = index + 2
      return (
        <Row key={currentFieldIndex}>
          <Col xs={23} sm={12}>
            <Form.Item label={`Nombre ${currentFieldIndex}`}>
              {getFieldDecorator(`firstName${currentFieldIndex}`, {
                initialValue: userData[`firstName${currentFieldIndex}`],
                rules: [{ message: 'Por favor ingrese su Nombre' }],
              })(
                <div style={{ display: 'flex' }}>
                  <Input
                    name={`firstName${currentFieldIndex}`}
                    onChange={(el) =>
                      onInputChange({
                        ...el,
                        name: `firstName${currentFieldIndex}`,
                      })
                    }
                    value={userData[`firstName${currentFieldIndex}`]}
                    placeholder={`Nombre ${currentFieldIndex}`}
                  />
                </div>
              )}
            </Form.Item>
          </Col>
          <Col xs={23} sm={12}>
            <Form.Item label={`Apellido ${currentFieldIndex}`}>
              {getFieldDecorator(`lastName${currentFieldIndex}`, {
                initialValue: userData[`lastName${currentFieldIndex}`],
                rules: [{ message: 'Por favor ingrese su Apellido' }],
              })(
                <div style={{ display: 'flex' }}>
                  <Input
                    name={`lastName${currentFieldIndex}`}
                    onChange={(el) =>
                      onInputChange({
                        ...el,
                        name: `lastName${currentFieldIndex}`,
                      })
                    }
                    value={userData[`lastName${currentFieldIndex}`]}
                    placeholder={`Apellido ${currentFieldIndex}`}
                  />
                  <Button type="danger" onClick={onRemoveExtraUser}>
                    <Icon type="user-delete" />
                  </Button>
                </div>
              )}
            </Form.Item>
          </Col>
        </Row>
      )
    })
  }

  const handleChangeSelectAdmin = (userId) => {
    const { username } = adminUsers.find((user) => user.id == userId)
    setUserData((prev) => {
      return {
        ...prev,
        createdByUsername: username,
        createdByUserId: userId,
      }
    })
  }

  const getAdminUserOption = () => {
    return _.map(adminUsers, ({ id, username }) => <Option key={`${id}`}>{username}</Option>)
  }

  return (
    <div className="add-edit-user-modal">
      {!isEditAction ? (
        <Radio.Group
          onChange={(el) =>
            onInputChange({
              ...el,
              name: `roleId`,
            })
          }
          value={userData.roleId}
          buttonStyle="solid"
          size="large"
          name="roleId"
        >
          {/*1=Admin 2=Regular*/}
          <Radio.Button value={2}>
            <Icon type="user-add" /> Cliente
          </Radio.Button>
          <Radio.Button value={1}>
            <Icon type="crown" /> Administrador
          </Radio.Button>
        </Radio.Group>
      ) : null}

      <Form onSubmit={handleSubmit} className="auth-form">
        <Row>
          <Col xs={24} sm={12}>
            <Form.Item label="Nombre">
              {getFieldDecorator('firstName', {
                initialValue: userData.firstName || '',
                rules: [{ required: true, message: 'Por favor ingrese su Nombre' }],
              })(
                <Input
                  name="firstName"
                  onChange={(el) =>
                    onInputChange({
                      ...el,
                      name: `firstName`,
                    })
                  }
                  placeholder="Nombre"
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Apellido">
              {getFieldDecorator('lastName', {
                initialValue: (userData.lastName && userData.lastName) || '',
                rules: [{ required: true, message: 'Por favor ingrese su Apellido' }],
              })(
                <Input
                  name="lastName"
                  onChange={(el) =>
                    onInputChange({
                      ...el,
                      name: `lastName`,
                    })
                  }
                  placeholder="Apellido"
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        {!isAdminUser ? handleAddExtraUser(getFieldDecorator) : null}
        {!isAdminUser && totalExtraUsers < MAX_NUMBER_USERS ? (
          <Row>
            <Col style={{ textAlign: 'center' }}>
              <Button size="large" onClick={onAddExtraUser}>
                <Icon type="usergroup-add" /> Agregar otro usuario
              </Button>
            </Col>
          </Row>
        ) : null}

        {isEditAction && (
          <React.Fragment>
            <Form.Item label="Usuario">
              {getFieldDecorator('username', {
                initialValue: userData.username || '',
                rules: [{ required: true, message: 'Por favor ingrese su Usuario' }],
              })(
                <Input
                  name="username"
                  onChange={(el) =>
                    onInputChange({
                      ...el,
                      name: `username`,
                    })
                  }
                  placeholder="Usuario"
                  disabled={isEqual(actionType, 'edit')}
                />
              )}
            </Form.Item>
            <Form.Item label="Usuario ID" className={classNames({ hidden: isAdminUser })}>
              {getFieldDecorator('userID', {
                initialValue: userData.userID || '',
                rules: [{ message: 'Por favor ingrese el ID del usuario' }],
              })(
                <Input
                  name="userID"
                  onChange={(el) =>
                    onInputChange({
                      ...el,
                      name: `userID`,
                    })
                  }
                  placeholder="Cuenta Cliente"
                />
              )}
            </Form.Item>
          </React.Fragment>
        )}

        <Form.Item label="Email">
          {getFieldDecorator('email', {
            initialValue: userData.email || '',
            rules: [
              {
                type: 'email',
                message: 'No es un Email válido',
              },
              {
                message: 'Por favor ingrese el Email',
              },
            ],
          })(
            <Input
              name="email"
              type="email"
              onChange={(el) =>
                onInputChange({
                  ...el,
                  name: `email`,
                })
              }
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email"
            />
          )}
        </Form.Item>
        <Form.Item label="Teléfono" className={classNames({ hidden: isAdminUser })}>
          {getFieldDecorator('phoneNumber', {
            initialValue: userData.phoneNumber || '',
            rules: [{ message: 'Por favor ingrese su número de teléfono' }],
          })(
            <Input
              name="phoneNumber"
              onChange={(el) =>
                onInputChange({
                  ...el,
                  name: `phoneNumber`,
                })
              }
              placeholder="Teléfono"
            />
          )}
        </Form.Item>
        {isEditAction && (
          <Row>
            <Col xs={24} sm={12}>
              <Form.Item label="Contraseña">
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: isEqual(actionType, 'add'),
                      message: 'Por favor ingrese la Contraseña',
                    },
                    {
                      validator: validateToNextPassword,
                    },
                  ],
                })(
                  <Input.Password
                    name="password"
                    onChange={(el) =>
                      onInputChange({
                        ...el,
                        name: `password`,
                      })
                    }
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="Contraseña"
                  />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Confirmar Contraseña">
                {getFieldDecorator('verifyPassword', {
                  rules: [
                    {
                      required: isEqual(actionType, 'add'),
                      message: 'Por favor ingrese la Contraseña',
                    },
                    {
                      validator: compareToFirstPassword,
                    },
                  ],
                })(
                  <Input.Password
                    name="verifyPassword"
                    onChange={(el) =>
                      onInputChange({
                        ...el,
                        name: `verifyPassword`,
                      })
                    }
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="Confirmar Contraseña"
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        )}

        <Form.Item label="País" className={classNames({ hidden: isAdminUser })}>
          {getFieldDecorator('country', {
            initialValue: userData.country || '',
          })(
            <Input
              name="country"
              onChange={(el) =>
                onInputChange({
                  ...el,
                  name: `country`,
                })
              }
              placeholder="País"
            />
          )}
        </Form.Item>
        <Form.Item label="Referido" className={classNames({ hidden: isAdminUser })}>
          {getFieldDecorator('referred', {
            initialValue: userData.referred || '',
          })(
            <Input
              name="referred"
              onChange={(el) =>
                onInputChange({
                  ...el,
                  name: `referred`,
                })
              }
              placeholder="Referido"
            />
          )}
        </Form.Item>

        <Row>
          <Col xs={24} sm={12}>
            <Form.Item label="Fecha de Inicio">
              {getFieldDecorator('startDate', {
                initialValue: !!userData.startDate ? moment(userData.startDate) : null,
              })(
                <DatePicker
                  onChange={(date) =>
                    handleSetDate({
                      inputName: 'startDate',
                      date,
                    })
                  }
                  placeholder="Fecha de Inicio"
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Fecha de Firma">
              {getFieldDecorator('signDate', {
                initialValue: !!userData.signDate ? moment(userData.signDate) : null,
              })(
                <DatePicker
                  onChange={(date) =>
                    handleSetDate({
                      inputName: 'signDate',
                      date,
                    })
                  }
                  placeholder="Fecha de Firma"
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Fecha de Salida">
              {getFieldDecorator('endDate', {
                initialValue: !!userData.endDate ? moment(userData.endDate) : null,
              })(
                <DatePicker
                  onChange={(date) =>
                    handleSetDate({
                      inputName: 'endDate',
                      date,
                    })
                  }
                  placeholder="Fecha de Salida"
                />
              )}
            </Form.Item>
          </Col>
          {isEditAction && !isAdminUser && (
            <Col xs={24} sm={12}>
              {adminUsersSuccess && (
                <Form.Item label="Creado por">
                  {getFieldDecorator('user', {
                    initialValue: userData.createdByUsername || '',
                  })(
                    <Select
                      showSearch={true}
                      name="user"
                      onChange={handleChangeSelectAdmin}
                      placeholder="Usuario Admin"
                      showArrow={true}
                      loading={isLoadingUsers}
                    >
                      {getAdminUserOption()}
                    </Select>
                  )}
                </Form.Item>
              )}
            </Col>
          )}
        </Row>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="login-form-button"
            disabled={isLoading}
          >
            {isEqual(actionType, 'add') ? 'Agregar' : 'Actualizar'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Form.create({ name: 'register' })(AddOrEditUserForm)
