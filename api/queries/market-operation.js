import { UserAccount, User, Account, Product, Broker } from "../models";

const queries = {
  list: ({ req, UserAccount, Product, Broker }) => {
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
              attributes: ['username', 'firstName', 'lastName']
            },
            {
              model: Account,
              as: 'account',
              attributes: ['name', 'percentage']
            },

          ],
        },
        {
          model: Product,
          as: 'product',
          attributes: ['name', 'code']
        },
        {
          model: Broker,
          as: 'broker',
          attributes: ['name']
        },
      ],
      order: [ [ 'createdAt', 'DESC' ] ],
    };
  },
  get: ({ req, UserAccount, Product, Broker }) => {
    return {
      attributes: {
        exclude: [],
      },
      include: [
        {
          model: UserAccount,
          as: 'userAccount',
        },
        {
          model: Product,
          as: 'product',
          attributes: ['name', 'code']
        },
        {
          model: Broker,
          as: 'broker',
          attributes: ['name']
        },
      ],
      order: [ [ 'createdAt', 'DESC' ] ],
    };
  },
};

export default queries;