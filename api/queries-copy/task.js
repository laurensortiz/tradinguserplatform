const queries = {
  listByScopeStage: ({ req, Scope, Task, Stage }) => {
    return {
      where: {
        stageId: req.params.stageId,
        scopeId: req.params.scopeId,
      },
      attributes: {
        exclude: [ 'id', 'createdAt', 'updatedAt' ],
      },
      include: [
        {
          model: Task,
          as: 'task',
          attributes: [ 'id', 'name' ]
        },
        // {
        //   model: Scope,
        //   as: 'scope',
        //   attributes: [ 'id', 'name' ]
        // },
        // {
        //   model: Stage,
        //   as: 'stage',
        //   attributes: [ 'id', 'name' ]
        // },

      ],
      order: [ [ { model: Task, as: 'task' }, 'name' ] ]
    };
  },
  list: ({ req }) => {
    return {
      order: [ [ 'name', 'ASC' ] ],
    };
  },
};

export default queries;