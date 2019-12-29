const queries = {
  list: ({ req, User, Role, Account }) => {
    return {
      attributes: {
        exclude: [ 'salt', 'password' ],
      },
      include: [
        {
          model: Role,
          as: 'role',
        },
        {
          model: Account,
          as: 'account',
        },
      ],
      order: [ [ 'createdAt', 'DESC' ] ],
    };
  },
  get: ({ req, User, Role, Account }) => {
    return {
      attributes: {
        exclude: [ 'salt', 'password' ],
      },
      include: [
        {
          model: Role,
          as: 'role',
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