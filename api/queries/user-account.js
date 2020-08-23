import {get} from 'lodash';

function conditionalStatus(req, sequelize) {
  const Op = sequelize.Op;
  let requestedStatus = Number(get(req, 'body.status', 4));


  if (requestedStatus !== 4) {
    requestedStatus = {
      [Op.lte]: 4,
      [Op.gt]: 0
    }
  }

  return requestedStatus
}

const queries = {
  list: ({ req, User, Account }) => {
    const statusActive = get(req, 'body.status', 1);
    const associatedOperation = get(req, 'body.associatedOperation', 1);
    return {
      where: {
        status: statusActive,
      },
      attributes: {
        exclude: [ 'salt', 'password' ],
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: [ 'salt', 'password' ],
          },
        },
        {
          model: Account,
          as: 'account',
          where: {
            associatedOperation,
          },
        },
      ],
      order: [ [ 'createdAt', 'DESC' ] ],
    };
  },
  get: ({ req, User, Account }) => {
    return {
      where: {
        status: 1,
      },
      attributes: {
        exclude: [ 'salt', 'password' ],
      },
      include: [
        {
          model: User,
          as: 'user',
        },
        {
          model: Account,
          as: 'account',
        },
      ],
      order: [ [ 'createdAt', 'DESC' ] ],
    };
  },
  getByUser: ({ req, User, Account }) => {
    return {
      where: {
        status: 1,
        userId: req.params.userId || 0
      },

      include: [
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: [ 'salt', 'password' ],
          },
        },
        {
          model: Account,
          as: 'account',
        },
      ],
      order: [ [ 'createdAt', 'DESC' ] ],
    };
  },
  accountReport: ({req, User, Account, UserAccount, MarketMovement, Product, Broker, Commodity, AssetClass, sequelize }) => {

    return {
      where: {
        userAccountId: req.body.id,
        status: conditionalStatus(req, sequelize),
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
          model: MarketMovement,
          as: 'marketMovement',
          limit: 1,
          order: [ [ 'createdAt', 'DESC' ]],
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
      silence: true,
      order: [ [ 'endDate', 'DESC' ] ],
    };
  },

};

export default queries;