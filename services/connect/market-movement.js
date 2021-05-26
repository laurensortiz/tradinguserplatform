import { useQuery, useMutation } from 'react-query'
import fetch from '../../common/fetch'

function useMovementsCount(filter) {
  const { marketPrice, createdAt, enabled } = filter
  const key = marketPrice + new Date(createdAt).getTime()

  return useQuery(
    ['connect:useMovementsCount', key],
    async () => {
      const { data } = await fetch({
        method: 'post',
        url: `market-movement/count`,
        data: {
          marketPrice,
          createdAt,
        },
      })
      return data
    },
    {
      enabled,
      manual: true,
      onSuccess: (res) => {},
      onError: () => {
        return 'No se encontraron registros'
      },
    }
  )
}

function useBulkDeleteMovements(filter) {
  const { marketPrice, createdAt, enabled } = filter
  const key = marketPrice + new Date(createdAt).getTime()

  return useQuery(
    ['connect:useBulkDeleteMovements', key],
    async () => {
      const { data } = await fetch({
        method: 'post',
        url: `market-movement/bulk-delete`,
        data: {
          marketPrice,
          createdAt,
        },
      })
      return data
    },
    {
      enabled,
      manual: true,
      onSuccess: (res) => {},
      onError: (res) => {
        return 'No se encontraron registros'
      },
    }
  )
}

export { useMovementsCount, useBulkDeleteMovements }
