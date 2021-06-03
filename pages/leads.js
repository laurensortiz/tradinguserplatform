import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import Document from '../components/Document'
import LeadsTable from '../components/Lead/LeadsTable'

import connect from '../services/connect'
import AddOrEditLeadForm from '../components/Lead/AddOrEditLeadForm'
import { Drawer } from 'antd'

function Leads() {
  const [status, setStatus] = useState(1)
  const [isShowDetailActive, setIsShowDetailActive] = useState(false)
  const [selectedLeadId, setSelectedLeadId] = useState(null)
  const { isLoading: isLoadingLeads, data: leadsData, refetch } = connect.useGetLeads({ status })
  const { mutateAsync: mutateDelete, isSuccess: isSuccessDelete } = connect.useDeleteLead(
    selectedLeadId
  )
  const { mutateAsync: mutateActive, isSuccess: isSuccessActive } = connect.useUpdateLead()

  const onClose = () => setIsShowDetailActive(false)

  const onSelectedLead = (id) => {
    setIsShowDetailActive(true)
    setSelectedLeadId(id)
  }

  const onTabChange = ({ target }) => setStatus(target.value)

  useEffect(() => {
    refetch()
  }, [status, isSuccessDelete])

  const onDelete = async (id) => {
    setSelectedLeadId(id)
    if (mutateDelete) {
      await mutateDelete(id)
      refetch()
    }
  }

  const onActive = async (id) => {
    if (mutateActive) {
      await mutateActive({
        id,
        status: 1,
      })
      refetch()
    }
  }

  return (
    <Document>
      <LeadsTable
        leads={leadsData}
        isLoading={isLoadingLeads}
        onSelectedLead={onSelectedLead}
        onRequestUpdateTable={() => refetch()}
        onTabChange={onTabChange}
        onDelete={onDelete}
        dataStatus={status}
        onActive={onActive}
      />
      <Drawer
        title="Detalle del Lead"
        width="80%"
        onClose={onClose}
        visible={isShowDetailActive}
        destroyOnClose={true}
      >
        <AddOrEditLeadForm id={selectedLeadId} />
      </Drawer>
    </Document>
  )
}

export default Leads
