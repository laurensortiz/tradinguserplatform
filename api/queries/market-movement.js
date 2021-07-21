const queries = {
  list: ({ req }) => {
    return {
      where: {
        marketOperationId: req.params.id || -1,
        status: 1,
      },
      order: [['createdAt', 'DESC']],
    }
  },
  get: ({ req }) => {
    return {
      where: {
        marketOperationId: req.params.id,
        status: 1,
      },
      order: [['createdAt', 'DESC']],
    }
  },
}

export default queries
