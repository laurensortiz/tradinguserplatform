import {
  User,
  Account,
  UserAccount,
  Role,
  MarketOperation,
  MarketMovement,
  Product,
  Broker,
  Commodity,
  AssetClass,
  sequelize,
  UserAccountMovement
} from '../models';
import { userAccountQuery } from '../queries';
import { getLastMovement } from './market-movement';

import _ from 'lodash';

module.exports = {
  async create(req, res) {
    try {

      const userAccount = await UserAccount.create({
        userId: req.body.user.id,
        accountId: req.body.account.id,
        accountValue: req.body.accountValue,
        brokerId: req.body.broker.id,
        guaranteeOperation: req.body.guaranteeOperation,
        guaranteeCredits: req.body.guaranteeCredits,
        balanceInitial: req.body.balanceInitial,
        balanceFinal: req.body.balanceFinal,
        maintenanceMargin: req.body.maintenanceMargin,
        commissionByReference: req.body.commissionByReference,
        status: 1,
        createdAt: new Date(),
        marginUsed: _.get(req, 'body.marginUsed', 0),
      });

      return res.status(200).send(userAccount);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async list(req, res) {
    const userAccounts = await UserAccount.findAll(
      userAccountQuery.list({ req, sequelize, User, Account, MarketOperation, Product, Broker, })
    );

    if (!userAccounts) {
      return res.status(404).send({
        message: '404 on UserAccount get List',
      });
    }
    return res.status(200).send(userAccounts);
  },

  async get(req, res) {
    const userAccount = await UserAccount.findAll(
      userAccountQuery.get( { req, User, Role, Account, Broker } )
    );

    if (!userAccount) {
      return res.status(404).send({
        message: '404 on UserAccount get',
      });
    }

    return res.status(200).send(userAccount);
  },

  async getReport(req, res) {

    const userAccountSoldOperations = await MarketOperation.findAll(
      userAccountQuery.accountReport( { req, User, Account, UserAccount, MarketMovement, Product, Broker, Commodity, AssetClass, sequelize } )
    )

    if (!userAccountSoldOperations) {
      return res.status(404).send({
        message: 'No se encontraron Operaciones Vendidas para la cuenta indicada',
      });
    }

    return res.status(200).send(userAccountSoldOperations);
  },

  async getByUser(req, res) {

    const userAccount = await UserAccount.findAll(
      userAccountQuery.getByUser( { req, User, Role, Account, Broker, UserAccountMovement } )
    );

    if (!userAccount) {
      return res.status(404).send({
        message: '404 on UserAccount get',
      });
    }

    return res.status(200).send(userAccount);

    // const accountIds = _.map(userAccount, ({id}) => id);
    // const marketOperations = await MarketOperation.findAll(
    //   marketOperationQuery.getByUser({ accountIds, UserAccount, User, Account, Product, Broker, Commodity })
    // );
    //
    // const investmentOperations = await InvestmentOperation.findAll(
    //   investmentOperationQuery.getByUser({ accountIds, UserAccount, User, Account })
    // );
    //
    // return res.status(200).send({
    //   marketOperations,
    //   investmentOperations,
    // });
  },

  async update(req, res) {
    const userId = _.get(req, 'user.id', 0)
    const userAccount = await UserAccount.findOne({
      where: {
        id: req.params.userAccountId,
      },
    });

    if (!userAccount) {
      return res.status(404).send({
        message: '404 on UserAccount update',
      });
    }

    const updatedUserAccount = await userAccount.update({
      userId: _.get(req, 'body.user.id', userAccount.userId),
      accountId: _.get(req, 'body.account.id', userAccount.accountId),
      brokerId: _.get(req, 'body.broker.id', userAccount.brokerId),
      accountValue: req.body.accountValue || userAccount.accountValue,
      guaranteeOperation: req.body.guaranteeOperation || userAccount.guaranteeOperation,
      guaranteeCredits: req.body.guaranteeCredits || userAccount.guaranteeCredits,
      balanceInitial: req.body.balanceInitial || userAccount.balanceInitial,
      balanceFinal: req.body.balanceFinal || userAccount.balanceFinal,
      maintenanceMargin: req.body.maintenanceMargin || userAccount.maintenanceMargin,
      commissionByReference: req.body.commissionByReference || userAccount.commissionByReference,
      status: req.body.status || userAccount.status,
      snapShotAccount: JSON.stringify( {
        actionType: 'update',
        actionByUser: userId,
        userAccount
      } ),
      updatedAt: new Date(),
      marginUsed: req.body.marginUsed || userAccount.marginUsed,

    });

    return res.status(200).send(updatedUserAccount);
  },

  async delete(req, res) {
    const userAccount = await UserAccount.findOne({
      where: {
        id: req.params.userAccountId,
      },
    });

    if (!userAccount) {
      return res.status(404).send({
        message: 'UserAccount Not Found',
      });
    }

    //await userAccount.destroy();
    await userAccount.update( {
      status: 0,
    } );

    return res.status(200).send({
      message: 'UserAccount has been deleted',
    });
  },
};
