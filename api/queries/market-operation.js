function getWhereConditions(req, sequelize) {
  const Op = sequelize.Op;
  let whereConditions = {}
  if (req.params.status === 'active') {
    whereConditions.status = {
      [Op.gt]: 0
    }
  } else {
    whereConditions.status = 0
  }

  return whereConditions
}
const queries = {
  list: ({ req,sequelize, UserAccount, User, Product, Broker, Commodity, AssetClass, Account }) => {
    return {
      where: getWhereConditions(req, sequelize),
      attributes: {
        exclude: [],
      },
      include: [
        {
          model: UserAccount,
          as: 'userAccount',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['username', 'firstName', 'lastName']
            },
            {
              model: Account,
              as: 'account',
              attributes: ['name', 'percentage', 'associatedOperation']
            },

          ],
        },

        {
          model: Product,
          as: 'product',
        },
        {
          model: Broker,
          as: 'broker',
        },
        {
          model: Commodity,
          as: 'commodity',
        },
        {
          model: AssetClass,
          as: 'assetClass',
        },
      ],
      order: [ [ 'status', 'ASC' ], [ 'createdAt', 'DESC' ] ],
    };
  },
  accountReport: ({ req,sequelize, UserAccount, User, Product, Broker, Commodity, AssetClass, Account }) => {
    const userAccountId = req.body.userAccountIds;
    return {
      where: {
        userAccountId,
      },
      attributes: {
        exclude: [],
      },
      include: [
        {
          model: UserAccount,
          as: 'userAccount',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['username', 'firstName', 'lastName']
            },
            {
              model: Account,
              as: 'account',
              attributes: ['name', 'percentage', 'associatedOperation']
            },

          ],
        },

        {
          model: Product,
          as: 'product',
        },
        {
          model: Broker,
          as: 'broker',
        },
        {
          model: Commodity,
          as: 'commodity',
        },
        {
          model: AssetClass,
          as: 'assetClass',
        },
      ],
      order: [ [ 'status', 'ASC' ], [ 'guaranteeOperationValueEndOperation', 'ASC' ] ],
    };
  },

  getByUser: ({ accountIds, UserAccount, Product, Broker, Commodity, User, Account, AssetClass }) => {
    return {
      where: {
        userAccountId: accountIds
      },
      attributes: {
        exclude: [],
      },
      include: [
        {
          model: UserAccount,
          as: 'userAccount',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['username', 'firstName', 'lastName']
            },
            {
              model: Account,
              as: 'account',
              attributes: ['name', 'percentage', 'associatedOperation']
            },

          ],
        },
        {
          model: Product,
          as: 'product',
        },
        {
          model: Broker,
          as: 'broker',
        },
        {
          model: Commodity,
          as: 'commodity',
        },
        {
          model: AssetClass,
          as: 'assetClass',
        },
      ],
      order: [ [ 'createdAt', 'DESC' ] ],
    };
  },
  get: ({ req, UserAccount, Product, Broker }) => {
    return {
      attributes: {
        exclude: [],
      },
      include: [
        {
          model: UserAccount,
          as: 'userAccount',
        },
        {
          model: Product,
          as: 'product',
        },
        {
          model: Broker,
          as: 'broker',
        },
      ],
      order: [ [ 'createdAt', 'DESC' ] ],
    };
  },
};

export default queries;