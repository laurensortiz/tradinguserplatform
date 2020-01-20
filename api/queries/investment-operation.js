import { UserAccount, User, Account } from "../models";

const queries = {
  list: ({ req, UserAccount }) => {
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
              attributes: ['username']
            },
            {
              model: Account,
              as: 'account',
              attributes: ['name']
            },
          ],
        },
      ],
      order: [ [ 'createdAt', 'DESC' ] ],
    };
  },
  get: ({ req, UserAccount }) => {
    return {
      attributes: {
        exclude: [],
      },
      include: [
        {
          model: UserAccount,
          as: 'userAccount',
        },
      ],
      order: [ [ 'createdAt', 'DESC' ] ],
    };
  },
};

export default queries;