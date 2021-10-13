import fetch from '../../../common/fetch'

export const getFundMovements = async (fundOperationId) => {
  return fetch({
    method: 'get',
    url: `fund-movement/fund-operation/${fundOperationId}`,
  })
}

export const addFundMovement = async (fundMovement) => {
  return fetch({
    method: 'post',
    url: 'fund-movement',
    data: fundMovement,
  })
}

export const editFundMovement = async (fundMovement) => {
  return fetch({
    method: 'put',
    url: `fund-movement/${fundMovement.id}`,
    data: fundMovement,
  })
}

export const deleteFundMovement = async (fundMovementId) => {
  return fetch({
    method: 'delete',
    url: `fund-movement/${fundMovementId}`,
  })
}
