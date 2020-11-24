import { get } from 'lodash';

function conditionalStatus(req, sequelize) {
  const Op = sequelize.Op;
  let requestedStatus = Number( get( req, 'body.status', 4 ) );


  if (requestedStatus !== 4) {
    requestedStatus = {
      [ Op.lte ]: 4,
      [ Op.gt ]: 0
    }
  }

  return requestedStatus
}

const queries = {
  list: ({ req, sequelize, User, Account, MarketOperation, Product, Broker }) => {
    const statusActive = get( req, 'body.status', 1 );
    const associatedOperation = get( req, 'body.associatedOperation', 1 );
    const Op = sequelize.Op;
    return {
      where: {
        status: statusActive,
      },
      attributes: {
        exclude: [ 'snapShotAccount' ],
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: [ 'firstName', 'lastName', 'username' ],
        },
        {
          model: Account,
          as: 'account',
          where: {
            associatedOperation,
          },
        },
        {
          model: Broker,
          as: 'broker',
          attributes: [ 'name', 'id' ],
        },
        {
          model: MarketOperation,
          as: 'marketOperation',
          attributes: [ 'status' ],
          include: [
            {
              model: Product,
              as: 'product',
              attributes: [ 'name' ],
            },
          ]
        },
      ],

      order: [ [ 'createdAt', 'DESC' ] ],
    };
  },
  get: ({ req }) => {
    return {
      where: {
        id: req.params.userAccountId || 0,
        status: 1,
      },
      attributes: {
        exclude: [ 'snapShotAccount' ],
      },
      order: [ [ 'createdAt', 'DESC' ] ],
    };
  },
  getByUser: ({ req, User, Account, UserAccountMovement }) => {
    return {
      where: {
        status: 1,
        userId: req.params.userId || 0
      },
      attributes: {
        exclude: [ 'snapShotAccount' ],
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
        {
          model: UserAccountMovement,
          as: 'userAccountMovement',
          order: [ [ 'createdAt', 'ASC' ] ],
        },
      ],
      order: [ [ 'createdAt', 'DESC' ] ],
    };
  },
  accountReport: ({ req, User, Account, UserAccount, MarketMovement, Product, Broker, Commodity, AssetClass, sequelize }) => {

    return {
      where: {
        userAccountId: req.body.id,
        status: conditionalStatus( req, sequelize ),
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
              attributes: [ 'username', 'firstName', 'lastName' ]
            },
            {
              model: Account,
              as: 'account',
              attributes: [ 'name', 'percentage', 'associatedOperation' ]
            },
          ],
          order: [ [ 'guaranteeOperation', 'ASC' ] ],
        },
        {
          model: MarketMovement,
          as: 'marketMovement',
          limit: 1,
          order: [ [ 'createdAt', 'DESC' ] ],
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
      order: [ [ 'guaranteeOperationValueEndOperation', 'ASC' ] ],
      silence: true,
    };
  },

};

export default queries;