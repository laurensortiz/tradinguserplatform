function getWhereConditions(req, sequelize, isAdmin) {
  const Op = sequelize.Op;
  let whereConditions = {}

  if(isAdmin) {
    if (req.params.status === '1') {
      whereConditions.status = {
        [Op.gt]: 0,
        [Op.lt]: 4,
      }
    } else {
      whereConditions.status = req.params.status
    }
  } else {

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
      attributes: [
        'id',
        'status',
        'behavior',
        'amount',
        'initialAmount',
        'longShort',
        'commoditiesTotal',
        'buyPrice',
        'holdStatusCommission',
        'maintenanceMargin',
        'takingProfit',
        'stopLost',
        'orderId',
        'createdAt',
        'updatedAt'],
      include: [
        {
          model: UserAccount,
          as: 'userAccount',
          attributes: ['userId', 'accountId'],
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
          attributes: ['name']
        },
        {
          model: Broker,
          as: 'broker',
          attributes: ['name']
        },
        {
          model: AssetClass,
          as: 'assetClass',
          attributes: ['name']
        },
      ],
      order: [ [ 'createdAt', 'DESC' ] ],
    };
  },
  listAdmin: ({ req,sequelize, UserAccount, User, Product, Broker, AssetClass, Account, Commodity }) => {
    return {
      where: getWhereConditions(req, sequelize, true),
      attributes: [
        'id',
        'status',
        'behavior',
        'amount',
        'initialAmount',
        'longShort',
        'commoditiesTotal',
        'buyPrice',
        'holdStatusCommission',
        'maintenanceMargin',
        'takingProfit',
        'stopLost',
        'orderId',
        'createdAt',
        'updatedAt'],
      include: [
        {
          model: UserAccount,
          as: 'userAccount',
          attributes: ['userId', 'accountId'],
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
          attributes: ['name', 'id', 'code']
        },
        {
          model: Broker,
          as: 'broker',
          attributes: ['name']
        },
        {
          model: Commodity,
          as: 'commodity',
          attributes: ['name', 'id']
        },
        {
          model: AssetClass,
          as: 'assetClass',
          attributes: ['name', 'id']
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
          attributes: {
            exclude: [ 'snapShotAccount' ],
          },
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
          attributes: ['name', 'id', 'code']
        },
        {
          model: Broker,
          as: 'broker',
          attributes: ['name', 'id']
        },
        {
          model: Commodity,
          as: 'commodity',
          attributes: ['name', 'id']
        },
        {
          model: AssetClass,
          as: 'assetClass',
          attributes: ['name', 'id']
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
          attributes: {
            exclude: [ 'snapShotAccount' ],
          },
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
          attributes: ['name', 'id', 'code']
        },
        {
          model: Broker,
          as: 'broker',
          attributes: ['name', 'id']
        },
        {
          model: Commodity,
          as: 'commodity',
          attributes: ['name', 'id']
        },
        {
          model: AssetClass,
          as: 'assetClass',
          attributes: ['name', 'id']
        },
      ],
      order: [ [ 'createdAt', 'DESC' ] ],
    };
  },
  get: ({ UserAccount, User, Product, Broker, AssetClass, Account, Commodity }) => {
    return {
      attributes: [
        'id',
        'status',
        'behavior',
        'amount',
        'initialAmount',
        'longShort',
        'commoditiesTotal',
        'buyPrice',
        'holdStatusCommission',
        'maintenanceMargin',
        'takingProfit',
        'stopLost',
        'orderId',
        'createdAt',
        'updatedAt'],
      include: [
        {
          model: UserAccount,
          as: 'userAccount',
          attributes: [
            'id',
            'userId',
            'accountId',
            'accountValue',
            'balanceInitial',
            'maintenanceMargin',
            'marginUsed',
            'guaranteeOperation',
            'guaranteeCredits',
            'commissionByReference',

          ],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id','username', 'firstName', 'lastName']
            },
            {
              model: Account,
              as: 'account',
              attributes: ['id','name', 'percentage', 'associatedOperation']
            },

          ],
        },
        {
          model: Product,
          as: 'product',
          attributes: ['name', 'id', 'code']
        },
        {
          model: Broker,
          as: 'broker',
          attributes: ['name', 'id']
        },
        {
          model: Commodity,
          as: 'commodity',
          attributes: ['name', 'id']
        },
        {
          model: AssetClass,
          as: 'assetClass',
          attributes: ['name', 'id']
        },
      ],
    };
  },
};

export default queries;