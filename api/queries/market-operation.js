import _ from 'lodash'

function getWhereConditions(req, sequelize, userRoleId) {
  const Op = sequelize.Op

  const isAdmin = userRoleId === 1
  let whereConditions = {}

  if (isAdmin) {
    if (req.query.status === '1') {
      whereConditions.status = {
        [Op.gt]: 0,
        [Op.lt]: 4,
      }
    } else {
      whereConditions.status = req.query.status
    }
  } else {
    if (req.query.status === '1') {
      whereConditions = {
        status: {
          [Op.gt]: 0,
        },
        userAccountId: req.query.userAccountId,
      }
    } else {
      whereConditions = {
        status: req.query.status,
        userAccountId: req.query.userAccountId,
      }
    }
  }

  return whereConditions
}
const queries = {
  list: ({
    req,
    limit,
    offset,
    sequelize,
    UserAccount,
    User,
    Product,
    Broker,
    AssetClass,
    Commodity,
  }) => {
    const userRoleId = req.user.roleId || 0
    const isAdmin = userRoleId === 1
    // const config = isAdmin && req.query.status == 4 ? { limit, offset } : null
    const config = isAdmin && req.query.status == 4 ? null : null
    return {
      ...config,
      where: getWhereConditions(req, sequelize, userRoleId),
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
        'updatedAt',
        'endDate',
        'guaranteeOperationValueEndOperation',
        'holdStatusCommissionEndOperation',
      ],
      include: [
        {
          model: UserAccount,
          as: 'userAccount',
          attributes: ['userId'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['username', 'firstName', 'lastName'],
            },
          ],
        },
        {
          model: Product,
          as: 'product',
          attributes: ['name', 'id', 'code'],
        },
        {
          model: Broker,
          as: 'broker',
          attributes: ['name', 'id'],
        },
        {
          model: AssetClass,
          as: 'assetClass',
          attributes: ['name', 'id'],
        },
        {
          model: Commodity,
          as: 'commodity',
          attributes: ['name', 'id'],
        },
      ],
      order: [
        ['createdAt', 'DESC'],
        ['endDate', 'DESC'],
        ['id', 'DESC'],
      ],
      silence: true,
    }
  },
  accountReport: ({ req, UserAccount, User, Product, Broker, Commodity, AssetClass, Account }) => {
    const userAccountId = req.body.userAccountIds
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
              attributes: ['username', 'firstName', 'lastName'],
            },
            {
              model: Account,
              as: 'account',
              attributes: ['name', 'percentage', 'associatedOperation'],
            },
          ],
        },
        {
          model: Product,
          as: 'product',
          attributes: ['name', 'id', 'code'],
        },
        {
          model: Broker,
          as: 'broker',
          attributes: ['name', 'id'],
        },
        {
          model: Commodity,
          as: 'commodity',
          attributes: ['name', 'id'],
        },
        {
          model: AssetClass,
          as: 'assetClass',
          attributes: ['name', 'id'],
        },
      ],
      order: [
        ['status', 'ASC'],
        ['guaranteeOperationValueEndOperation', 'ASC'],
      ],
    }
  },

  getByUser: ({
    accountIds,
    UserAccount,
    Product,
    Broker,
    Commodity,
    User,
    Account,
    AssetClass,
  }) => {
    return {
      where: {
        userAccountId: accountIds,
      },
      attributes: {
        exclude: [],
      },
      include: [
        {
          model: UserAccount,
          as: 'userAccount',
          attributes: {
            exclude: ['snapShotAccount'],
          },
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['username', 'firstName', 'lastName'],
            },
            {
              model: Account,
              as: 'account',
              attributes: ['name', 'percentage', 'associatedOperation'],
            },
          ],
        },
        {
          model: Product,
          as: 'product',
          attributes: ['name', 'id', 'code'],
        },
        {
          model: Broker,
          as: 'broker',
          attributes: ['name', 'id'],
        },
        {
          model: Commodity,
          as: 'commodity',
          attributes: ['name', 'id'],
        },
        {
          model: AssetClass,
          as: 'assetClass',
          attributes: ['name', 'id'],
        },
      ],
      order: [['createdAt', 'DESC']],
    }
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
        'updatedAt',
        'holdStatusCommissionEndOperation',
      ],
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
              attributes: ['id', 'username', 'firstName', 'lastName'],
            },
            {
              model: Account,
              as: 'account',
              attributes: ['id', 'name', 'percentage', 'associatedOperation'],
            },
          ],
        },
        {
          model: Product,
          as: 'product',
          attributes: ['name', 'id', 'code'],
        },
        {
          model: Broker,
          as: 'broker',
          attributes: ['name', 'id'],
        },
        {
          model: Commodity,
          as: 'commodity',
          attributes: ['name', 'id'],
        },
        {
          model: AssetClass,
          as: 'assetClass',
          attributes: ['name', 'id'],
        },
      ],
      silence: true,
    }
  },
}

export default queries
