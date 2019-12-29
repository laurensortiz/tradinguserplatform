const queries = {
  list: ({ req, JobTitle }) => {
    return {
      where: {
        status: 1,
      },
      attributes: [ 'id', 'name' ],
      order: [ [ 'id', 'DESC' ] ],
    };
  },
  get: ({ req, JobTitle }) => {
    return {
      attributes: [ 'id', 'name' ],
      order: [ [ 'id', 'DESC' ] ],
    };
  },
};

export default queries;