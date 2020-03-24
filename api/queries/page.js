const queries = {
  list: ({ req }) => {
    return {
      where: {
        status: 1,
      },
      order: [ [ 'id', 'DESC' ] ],
    };
  },
  get: ({ req }) => {
    return {
      order: [ [ 'id', 'DESC' ] ],
    };
  },
};

export default queries;