import { get } from 'lodash'
const queries = {
  list: ({ req, UserAccount, User }) => {
    const status = Number(get(req, 'body.status', 1))
    return {
      where: {
        status,
      },
      order: [['id', 'DESC']],
    }
  },
  get: ({ req, UserAccount, User }) => {
    return {
      order: [['id', 'DESC']],
    }
  },
  listByUserAccountId: ({ req }) => {
    const userAccountId = get(req, 'params.userAccountId', '')
    const associatedOperation = get(req, 'params.associatedOperation', 1)
    return {
      where: {
        userAccountId,
        associatedOperation,
        status: 1,
      },
      limit: 1,
      order: [['createdAt', 'DESC']],
      silence: true,
    }
  },
}

export default queries
