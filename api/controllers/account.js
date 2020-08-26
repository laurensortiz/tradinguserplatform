import { Account } from '../models';
import { accountQuery } from '../queries';

module.exports = {
  async create(req, res) {
    try {
      const account = await Account.create({
        name: req.body.name,
        percentage: Number(req.body.percentage),
        status: 1,
        associatedOperation: req.body.associatedOperation,
        holdStatusCommissionAmount: req.body.holdStatusCommissionAmount || 0,
        createdAt: new Date(),
      });

      return res.status(200).send(account);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async list(req, res) {
    const accounts = await Account.findAll(
      accountQuery.list({ req })
    );

    if (!accounts) {
      return res.status(404).send({
        message: '404 on Account get List',
      });
    }
    return res.status(200).send(accounts);
  },

  async get(req, res) {
    const account = await Account.findByPk(
      req.params.accountId
    );

    if (!account) {
      return res.status(404).send({
        message: '404 on Account get',
      });
    }

    return res.status(200).send(account);
  },

  async update(req, res) {
    const account = await Account.findOne({
      where: {
        id: req.params.accountId,
      },
    });

    if (!account) {
      return res.status(404).send({
        message: '404 on Account update',
      });
    }

    const updatedAccount = await account.update({
      name: req.body.name || account.name,
      percentage: Number(req.body.percentage) || account.percentage,
      associatedOperation: req.body.associatedOperation || account.associatedOperation,
      holdStatusCommissionAmount: req.body.holdStatusCommissionAmount || account.holdStatusCommissionAmount,
      updatedAt: new Date(),
    });

    return res.status(200).send(updatedAccount);
  },

  async delete(req, res) {
    const account = await Account.findOne({
      where: {
        id: req.params.accountId,
      },
    });

    if (!account) {
      return res.status(404).send({
        message: 'Account Not Found',
      });
    }

    //await account.destroy();
    await account.update( {
      status: 0,
    } );

    return res.status(200).send({
      message: 'Account has been deleted',
    });
  },
};
