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
  listByUsername: ({ req }) => {
    const username = get(req, 'params.username', '')
    const associatedOperation = get(req, 'params.associatedOperation', 1)
    return {
      where: {
        username,
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
