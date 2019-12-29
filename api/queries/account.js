const queries = {
  list: ({ req }) => {
    return {
      where: {
        status: 1,
      },
      attributes: [ 'id', 'name', 'percentage' ],
      order: [ [ 'id', 'DESC' ] ],
    };
  },
  get: ({ req }) => {
    return {
      attributes: [ 'id', 'name', 'percentage' ],
      order: [ [ 'id', 'DESC' ] ],
    };
  },
};

export default queries;