const queries = {
  list: ({ req }) => {
    return {
      where: {
        fundOperationId: req.params.id,
        status: 1,
      },
      order: [['createdAt', 'DESC']],
    }
  },
  get: ({ req }) => {
    return {
      where: {
        fundOperationId: req.params.id,
        status: 1,
      },
      order: [['createdAt', 'DESC']],
    }
  },
}

export default queries
