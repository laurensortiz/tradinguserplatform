import { get } from 'lodash'
const queries = {
  list: ({ req, UserAccount, User }) => {
    const status = get(req, 'body.status', 1)
    return {
      where: {
        status,
      },
      attributes: {
        exclude: ['personalIdDocument'],
      },
      include: [
        {
          model: UserAccount,
          as: 'userAccount',
          attributes: ['id'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['username', 'firstName', 'lastName'],
            },
          ],
        },
      ],
      order: [['id', 'DESC']],
    }
  },
  get: ({ UserAccount, User }) => {
    return {
      include: [
        {
          model: UserAccount,
          as: 'userAccount',
          attributes: ['userId'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['username', 'firstName', 'lastName'],
            },
          ],
        },
      ],
      order: [['id', 'DESC']],
    }
  },
  listByUsername: ({ req }) => {
    const username = get(req, 'body.username', '')
    return {
      where: {
        username,
      },
      attributes: {
        exclude: ['personalIdDocument'],
      },
      order: [['id', 'DESC']],
    }
  },
}

export default queries
