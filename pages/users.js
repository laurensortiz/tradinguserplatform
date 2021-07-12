import React, { useState, useEffect } from 'react'
import { Button, Drawer, Icon, notification, Radio, Row } from 'antd'
import _ from 'lodash'

import Document from '../components/Document'
import connect from '../services/connect'

import UsersTable from '../components/User/UsersTable'
import Detail from '../components/User/Detail'
import AddOrEditUserForm from '../components/User/AddOrEditUserForm'
import ExportUserDetail from '../components/User/ExportUserDetail'

function Users() {
  const [status, setStatus] = useState(1)
  const [role, setRole] = useState(2)
  const [actionType, setActionType] = useState('add')
  const [isShowDetailActive, setIsShowDetailActive] = useState(false)
  const [isShowFormActive, setIsShowFormActive] = useState(false)
  const [selectedUser, setSelectedUser] = useState({})

  const { isLoading: isLoadingUsers, data: usersData, refetch } = connect.useGetUsers({
    status,
    role,
  })
  const { mutateAsync: mutateDelete, isSuccess: isSuccessDelete } = connect.useDeleteUser()
  const { mutateAsync: mutateUser, isLoading: isUserUpdateLoading } = connect.useUpdateUser()
  const { mutateAsync: mutateUserCreate, isLoading: isUserCreateLoading } = connect.useCreateUser()

  const onSelectedUser = (id) => {
    setIsShowDetailActive(true)
    setSelectedUser(id)
  }

  const onTabChange = ({ target }) => setStatus(target.value)
  const onUserRoleChange = ({ target }) => setRole(target.value)

  useEffect(() => {
    refetch()
  }, [status, isSuccessDelete, role])

  const onAddUser = () => {
    setActionType('add')
    setIsShowFormActive(true)
  }

  const onEdit = (userSelected) => {
    setActionType('edit')
    setIsShowFormActive(true)
    setSelectedUser(userSelected)
  }

  const onClose = () => {
    setActionType('add')
    setIsShowFormActive(false)
    setIsShowDetailActive(false)
    setSelectedUser({})
  }

  const onDetail = (userSelected) => {
    setIsShowDetailActive(true)
    setSelectedUser(userSelected)
  }

  const handleAddUser = async (userData) => {
    try {
      await mutateUserCreate(userData)
      onClose()
      refetch()
      notification.success({
        message: 'Usuario guardado',
        duration: 1,
      })
    } catch (e) {
      notification.error({
        message: 'Ocurrió un error. Por favor intente de nuevo',
        duration: 1,
      })
    }
  }

  const handleEditUser = async (userUpdated) => {
    try {
      await mutateUser({
        ...userUpdated,
      })
      onClose()
      refetch()
      notification.success({
        message: 'Usuario Modificado',
        duration: 1,
      })
    } catch (e) {
      notification.error({
        message: 'Ocurrió un error. Por favor intente de nuevo',
        duration: 1,
      })
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      await mutateDelete(userId)
      onClose()
      refetch()
      notification.success({
        message: 'Usuario Eliminado',
        duration: 1,
      })
    } catch (e) {
      notification.error({
        message: 'Ocurrió un error. Por favor intente de nuevo',
        duration: 1,
      })
    }
  }

  const handleActiveUser = async (id) => {
    try {
      await mutateUser({
        id,
        status: 1,
      })
      onClose()
      refetch()
      notification.success({
        message: 'Usuario Activado',
        duration: 1,
      })
    } catch (e) {
      notification.error({
        message: 'Ocurrió un error. Por favor intente de nuevo',
        duration: 1,
      })
    }
  }

  const handleExportDetail = (userSelected) => {
    ExportUserDetail(userSelected)
  }

  const modalTitle = _.isEqual(actionType, 'add') ? 'Agregar Usuario' : 'Editar Usuario'

  return (
    <Document id="users-page">
      <Row style={{ marginBottom: 30 }}>
        <Radio.Group onChange={onUserRoleChange} defaultValue={2} buttonStyle="solid" size="large">
          <Radio.Button value={2}>
            <Icon type="user" /> Clientes
          </Radio.Button>
          <Radio.Button value={1}>
            <Icon type="crown" /> Administradores
          </Radio.Button>
        </Radio.Group>
        <Button style={{ float: 'right' }} type="primary" onClick={onAddUser} size="large">
          <Icon type="user-add" /> Agregar Usuario
        </Button>
      </Row>
      <UsersTable
        users={usersData}
        isLoading={isLoadingUsers}
        onSelectedUser={onSelectedUser}
        onRequestUpdateTable={() => refetch()}
        onTabChange={onTabChange}
        onDetail={onDetail}
        onDelete={handleDeleteUser}
        onEdit={onEdit}
        dataStatus={status}
        onActive={handleActiveUser}
        onRequestExportDetail={handleExportDetail}
      />
      <Drawer
        title={modalTitle}
        width="40%"
        onClose={onClose}
        visible={isShowFormActive}
        destroyOnClose={true}
      >
        <AddOrEditUserForm
          onAddNew={handleAddUser}
          onEdit={handleEditUser}
          selectedUser={selectedUser}
          actionType={actionType}
          isLoading={isUserUpdateLoading || isUserCreateLoading}
        />
      </Drawer>
      <Drawer
        title="Detalle del Usuario"
        width="40%"
        onClose={onClose}
        visible={isShowDetailActive}
        destroyOnClose={true}
      >
        <Detail currentUser={selectedUser} />
      </Drawer>
    </Document>
  )
}

export default Users
