const queries = {
  list: ({ req }) => {
    return {
      where: {
        status: 1,
      },
      attributes: [ 'id', 'name', 'value' ],
      order: [ [ 'id', 'DESC' ] ],
    };
  },
  get: ({ req }) => {
    return {
      attributes: [ 'id', 'name', 'value' ],
      order: [ [ 'id', 'DESC' ] ],
    };
  },
};

export default queries;