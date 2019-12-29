const queries = {
  list: ({ req, Scope, Stage, Category, Country }) => {
    return {
      attributes: {
        exclude: [ 'createdAt', 'updatedAt' ],
      },
      include: [
        {
          model: Scope,
          as: 'scope',
          attributes: [ 'id', 'name', 'code' ]
        },
        {
          model: Stage,
          as: 'stage',
          attributes: [ 'id', 'name', 'code' ]
        },
        {
          model: Category,
          as: 'category',
          attributes: [ 'id', 'name', 'code' ]
        },
        {
          model: Country,
          as: 'country',
          attributes: [ 'id', 'name', 'code' ]
        },
      ],
      order: [ [ 'id', 'DESC' ] ],
    };
  },
  get: ({ req, Scope, Stage, Category, Country }) => {
    return {
      attributes: {
        exclude: [ 'createdAt', 'updatedAt' ],
      },
      include: [
        {
          model: Scope,
          as: 'scope',
          attributes: [ 'id', 'name', 'code' ]
        },
        {
          model: Stage,
          as: 'stage',
          attributes: [ 'id', 'name', 'code' ]
        },
        {
          model: Category,
          as: 'category',
          attributes: [ 'id', 'name', 'code' ]
        },
        {
          model: Country,
          as: 'country',
          attributes: [ 'id', 'name', 'code' ]
        },
      ],
      //order: [ [ { model: Task, as: 'task' }, 'name' ] ]
    };
  },
};

export default queries;