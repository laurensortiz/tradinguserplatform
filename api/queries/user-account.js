const queries = {
  list: ({ req, User, Account }) => {
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