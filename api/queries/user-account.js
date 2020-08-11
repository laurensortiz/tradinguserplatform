import {get} from 'lodash';
const queries = {
  list: ({ req, User, Account }) => {
    const statusActive = get(req, 'body.status', 1);
    const associatedOperation = get(req, 'body.associatedOperation', 1);
    return {
      where: {
        status: statusActive,
      },
      attributes: {
        exclude: [ 'salt', 'password' ],
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: [ 'salt', 'password' ],
          },
        },
        {
          model: Account,
          as: 'account',
          where: {
            associatedOperation,
          },
        },
      ],
      order: [ [ 'createdAt', 'DESC' ] ],
    };
  },
  get: ({ req, User, Account }) => {
    return {
      where: {
        status: 1,
      },
      attributes: {
        exclude: [ 'salt', 'password' ],
      },
      include: [
        {
          model: User,
          as: 'user',
        },
        {
          model: Account,
          as: 'account',
        },
      ],
      order: [ [ 'createdAt', 'DESC' ] ],
    };
  },
  getByUser: ({ req, User, Account }) => {
    return {
      where: {
        status: 1,
        userId: req.params.userId || 0
      },

      include: [
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: [ 'salt', 'password' ],
          },
        },
        {
          model: Account,
          as: 'account',
        },
      ],
      order: [ [ 'createdAt', 'DESC' ] ],
    };
  },
};

export default queries;