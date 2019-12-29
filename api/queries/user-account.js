const queries = {
  list: ({ req, User, Account }) => {
    return {
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
};

export default queries;