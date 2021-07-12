import { useQuery, useMutation } from 'react-query'
import fetch from '../../common/fetch'

function useGetUsers(filter) {
  const { status = 1, role = 2 } = filter

  return useQuery(
    ['connect:useGetUsers', `${role}${status}`],
    async () => {
      const { data } = await fetch({
        method: 'get',
        url: `users/list/${role}/${status}`,
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

function useGetUser(userId) {
  return useQuery(
    ['connect:useGetUser', userId],
    async () => {
      const { data } = await fetch({
        method: 'get',
        url: `users/${userId}`,
      })
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

function useDeleteUser() {
  return useMutation(
    ['connect:useDeleteUser'],
    async (id) => {
      if (!!id) {
        const { data } = await fetch({
          method: 'delete',
          url: `users/${id}`,
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

function useCreateUser(userData) {
  return useMutation(
    ['connect:useCreateUser'],
    async (userData) => {
      const { data } = await fetch({
        method: 'post',
        url: `users`,
        data: userData,
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

function useUpdateUser() {
  return useMutation(
    ['connect:useUpdateUser'],
    async ({ id, ...userData }) => {
      if (!!id) {
        const { data } = await fetch({
          method: 'put',
          url: `users/${id}`,
          data: userData,
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

export { useGetUsers, useGetUser, useDeleteUser, useCreateUser, useUpdateUser }
