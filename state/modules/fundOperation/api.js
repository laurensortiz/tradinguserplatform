import fetch from '../../../common/fetch'

export const getFundOperations = async (status) => {
  return fetch({
    method: 'get',
    url: `fund-operation`,
  })
}

export const addFundOperation = async (fundOperation) => {
  return fetch({
    method: 'post',
    url: 'fund-operation',
    data: fundOperation,
  })
}

export const editFundOperation = async (fundOperation) => {
  return fetch({
    method: 'put',
    url: `fund-operation/${fundOperation.id}`,
    data: fundOperation,
  })
}

export const deleteFundOperation = async (fundOperationId) => {
  return fetch({
    method: 'delete',
    url: `fund-operation/${fundOperationId}`,
  })
}
