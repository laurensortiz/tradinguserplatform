import { useQuery, useMutation } from 'react-query'
import fetch from '../../common/fetch'

function useGetLeads(filter) {
  const { status = 1 } = filter

  return useQuery(
    ['connect:useGetLeads'],
    async () => {
      const { data } = await fetch({
        method: 'get',
        url: `leads/list/${status}`,
      })
      return data
    },
    {
      onSuccess: (res) => {},
      onError: () => {
        return 'No se encontraron registros'
      },
    }
  )
}

function useGetLead(leadId) {
  return useQuery(
    ['connect:useGetLead', leadId],
    async () => {
      const { data } = await fetch({
        method: 'get',
        url: `leads/${leadId}`,
      })
      console.log('[=====  jjjj  =====>')
      console.log(data)
      console.log('<=====  /jjjj  =====]')
      return data
    },
    {
      manual: false,
      onSuccess: (res) => {},
      onError: () => {
        return 'No se encontraron registros'
      },
    }
  )
}

function useDeleteLead() {
  return useMutation(
    ['connect:useDeleteLead'],
    async (id) => {
      console.log('[=====  id  =====>')
      console.log(id)
      console.log('<=====  /id  =====]')
      if (!!id) {
        const { data } = await fetch({
          method: 'delete',
          url: `leads/${id}`,
        })
        return data
      }
    },
    {
      manual: true,
      onSuccess: (res) => {},
      onError: () => {
        return 'No se encontraron registros'
      },
    }
  )
}

function useCreateLead(leadData) {
  console.log('[=====  create  =====>')
  console.log(leadData)
  console.log('<=====  /create  =====]')
  return useMutation(
    ['connect:useCreateLead'],
    async () => {
      const { data } = await fetch({
        method: 'post',
        url: `leads`,
        data: leadData,
      })
      return data
    },
    {
      enabled: false,
      manual: true,
      onSuccess: (res) => {},
      onError: (res) => {
        return 'No se encontraron registros'
      },
    }
  )
}

function useUpdateLead() {
  return useMutation(
    ['connect:useUpdateLead'],
    async ({ id, ...leadData }) => {
      console.log('[=====  HERE  =====>')
      console.log(id)
      console.log(leadData)
      console.log('<=====  /HERE  =====]')
      if (!!id) {
        const { data } = await fetch({
          method: 'put',
          url: `leads/${id}`,
          data: leadData,
        })
        return data
      }
    },
    {
      manual: true,
      onSuccess: (res) => {},
      onError: (res) => {
        return 'No se encontraron registros'
      },
    }
  )
}

export { useGetLeads, useGetLead, useDeleteLead, useCreateLead, useUpdateLead }
