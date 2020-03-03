const queries = {
  list: ({ req, User, Role }) => {
    return {
      attributes: {
        exclude: [ 'salt', 'password' ],
      },
      include: [
        {
          model: Role,
          as: 'role',
        },
      ],
      order: [ [ 'createdAt', 'DESC' ] ],
    };
  },
  get: ({ req, User, Role }) => {
    return {
      attributes: {
        exclude: [ 'salt', 'password' ],
      },
      include: [
        {
          model: Role,
          as: 'role',
        },
      ],
      order: [ [ 'createdAt', 'DESC' ] ],
    };
  },
};

export default queries;