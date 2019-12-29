import { User, Account, UserAccount, Role } from '../models';
import { userAccountQuery, userQuery } from '../queries';

module.exports = {
  async create(req, res) {
    try {
      const userAccount = await UserAccount.create({
        userId: req.body.user.id,
        accountId: req.body.account.id,
        accountValue: req.body.accountValue,
        guaranteeOperation: req.body.guaranteeOperation,
        guaranteeCredits: req.body.guaranteeCredits,
        balanceInitial: req.body.balanceInitial,
        balanceFinal: req.body.balanceFinal,
        maintenanceMargin: req.body.maintenanceMargin,
        status: 1,
        createdAt: new Date(),
      });

      return res.status(200).send(userAccount);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async list(req, res) {
    const userAccounts = await UserAccount.findAll(
      userAccountQuery.list({ req, User, Account })
    );

    if (!userAccounts) {
      return res.status(404).send({
        message: '404 on UserAccount get List',
      });
    }
    return res.status(200).send(userAccounts);
  },

  async get(req, res) {
    const userAccount = await UserAccount.findByPk(
      req.params.userAccountId,
      userAccountQuery.get( { req, User, Role, Account } )
    );

    if (!userAccount) {
      return res.status(404).send({
        message: '404 on UserAccount get',
      });
    }

    return res.status(200).send(userAccount);
  },

  async update(req, res) {
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
      userId: req.body.user.id || userAccount.userId,
      accountId: req.body.account.id || userAccount.accountId,
      accountValue: req.body.accountValue || userAccount.accountValue,
      guaranteeOperation: req.body.guaranteeOperation || userAccount.guaranteeOperation,
      guaranteeCredits: req.body.guaranteeCredits || userAccount.guaranteeCredits,
      balanceInitial: req.body.balanceInitial || userAccount.balanceInitial,
      balanceFinal: req.body.balanceFinal || userAccount.balanceFinal,
      maintenanceMargin: req.body.maintenanceMargin || userAccount.maintenanceMargin,
      updatedAt: new Date(),
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
