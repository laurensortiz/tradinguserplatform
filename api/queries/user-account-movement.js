const queries = {
  list: ({ req }) => {
    return {
      where: {
        userAccountId: req.params.id,
        status: 1,
      },
      order: [['createdAt', 'DESC']],
    }
  },
  get: ({ req }) => {
    return {
      where: {
        userAccountId: req.params.id,
        status: 1,
      },
      order: [['createdAt', 'DESC']],
    }
  },
}

export default queries
