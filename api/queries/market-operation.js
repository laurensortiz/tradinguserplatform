function getWhereConditions(req, sequelize, isAdmin) {
  const Op = sequelize.Op;
  let whereConditions = {}

  if(isAdmin) {
    if (req.params.status === '1') {
      whereConditions.status = req.params.status
    } else {
      whereConditions.status = req.params.status
    }
  } else {
    console.log('[=====  params  =====>');
    console.log(req.params);
    console.log('<=====  /params  =====]');
    if (req.params.status === '1') {
      whereConditions = {
        status: {
          [Op.gt]: 0,
        },
        userAccountId: req.params.userAccountId
      }
    } else {
      whereConditions = {
        status: req.params.status,
        userAccountId: req.params.userAccountId
      }
    }
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
      order: [ [ 'createdAt', 'DESC' ] ],
    };
  },
  listAdmin: ({ req,sequelize, UserAccount, User, Product, Broker, Commodity, AssetClass, Account }) => {
    return {
      where: getWhereConditions(req, sequelize, true),
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