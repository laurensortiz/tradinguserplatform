import get from 'lodash/get'
const queries = {
  list: ({ req, Role }) => {
    const status = get(req, 'params.status', 1)
    const roleId = get(req, 'params.role', 2)

    return {
      where: {
        status,
        roleId,
      },
      attributes: {
        exclude: ['salt', 'password'],
      },
      order: [['createdAt', 'DESC']],
    }
  },
}

export default queries
