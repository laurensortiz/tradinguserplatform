import get from 'lodash/get'
const queries = {
  list: ({ req, Role }) => {
    const status = get(req, 'body.status', 1)
    const roleId = get(req, 'body.roleId', 2)

    return {
      where: {
        status,
        roleId,
      },
      attributes: {
        exclude: ['salt', 'password'],
      },
      include: [
        {
          model: Role,
          as: 'role',
        },
      ],
      order: [['createdAt', 'DESC']],
    }
  },
}

export default queries
