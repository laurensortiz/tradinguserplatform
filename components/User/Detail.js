import React from 'react'

import { Descriptions, Tag } from 'antd'

import { FormatDate } from '../../common/utils'

function UserDetail({ currentUser }) {
  return (
    currentUser && (
      <Descriptions title="" column={1} size="small">
        <Descriptions.Item label="Usuario">{currentUser.userName || ''}</Descriptions.Item>
        <Descriptions.Item label="Nombre Completo">
          {currentUser.firstName || ''} {currentUser.lastName || ''}{' '}
          <Tag color="#e29524">Principal</Tag>
        </Descriptions.Item>
        {currentUser.firstName2 && currentUser.firstName2 !== '' ? (
          <Descriptions.Item label="Nombre Completo">
            {currentUser.firstName2} {currentUser.lastName2 || ''} <Tag>Adicional</Tag>
          </Descriptions.Item>
        ) : null}
        {currentUser.firstName3 && currentUser.firstName3 !== '' ? (
          <Descriptions.Item label="Nombre Completo">
            {currentUser.firstName3} {currentUser.lastName3 || ''} <Tag>Adicional</Tag>
          </Descriptions.Item>
        ) : null}
        {currentUser.firstName4 && currentUser.firstName4 !== '' ? (
          <Descriptions.Item label="Nombre Completo">
            {currentUser.firstName4} {currentUser.lastName4 || ''} <Tag>Adicional</Tag>
          </Descriptions.Item>
        ) : null}

        <Descriptions.Item label="Usuario ID">{currentUser.userID || ''}</Descriptions.Item>
        <Descriptions.Item label="Correo Electrónico">{currentUser.email || ''}</Descriptions.Item>
        <Descriptions.Item label="Número de Teléfono">
          {currentUser.phoneNumber || ''}
        </Descriptions.Item>
        <Descriptions.Item label="País">{currentUser.country || ''}</Descriptions.Item>
        <Descriptions.Item label="Referido">{currentUser.referred || ''}</Descriptions.Item>
        <Descriptions.Item label="Fecha de Inicio">
          {currentUser.startDate && FormatDate(currentUser.startDate)}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de Firma">
          {currentUser.signDate && FormatDate(currentUser.signDate)}
        </Descriptions.Item>
        <Descriptions.Item label="Creado por Usuario">
          <Tag color="#1b1f21">{currentUser.createdByUsername}</Tag>
        </Descriptions.Item>
      </Descriptions>
    )
  )
}

export default UserDetail
