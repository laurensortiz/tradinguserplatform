import { User, Account } from '../models'
const queries = {
  list: ({ UserAccount }) => {
    return {
      attributes: {
        exclude: [],
      },
      include: [
        {
          model: UserAccount,
          as: 'userAccount',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['username', 'firstName', 'lastName'],
            },
            {
              model: Account,
              as: 'account',
              attributes: ['name', 'percentage', 'associatedOperation'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      silence: true,
    }
  },
  getByUser: ({ accountIds, UserAccount, User, Account }) => {
    return {
      where: {
        userAccountId: accountIds,
      },
      attributes: {
        exclude: [],
      },
      include: [
        {
          model: UserAccount,
          as: 'userAccount',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['username', 'firstName', 'lastName'],
            },
            {
              model: Account,
              as: 'account',
              attributes: ['name', 'percentage', 'associatedOperation'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    }
  },
  get: ({ UserAccount }) => {
    return {
      include: [
        {
          model: UserAccount,
          as: 'userAccount',
        },
      ],
      order: [['createdAt', 'DESC']],
    }
  },
}

export default queries
