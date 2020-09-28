import _ from 'lodash';
import { MarketOperation, UserAccount, User, Account, UserAccountMovement } from '../models';
import { userAccountMovementQuery, userQuery } from '../queries';
import moment from "moment-timezone";


module.exports = {
  async create(req, res) {
    try {
      const userAccountMovement = await UserAccountMovement.create({
        debit: req.body.debit || 0.00,
        userAccountId: Number(req.body.userAccountId),
        credit: req.body.credit || 0.00,
        accountValue: req.body.accountValue || 0.00,
        reference: req.body.reference || '',
        status: _.get(req, 'body.status', 1),
        createdAt: moment(req.body.createdAt).tz('America/New_York').format() || moment(new Date()).tz('America/New_York').format(),
        updatedAt: moment(new Date()).tz('America/New_York').format()
      });

      return res.status(200).send(userAccountMovement);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async list(req, res) {
    const userAccountMovement = await UserAccountMovement.findAll(
      userAccountMovementQuery.list({ req })
    );

    if (!userAccountMovement) {
      return res.status(404).send({
        message: '404 on UserAccountMovement get List',
      });
    }
    return res.status(200).send(userAccountMovement);
  },

  async get(req, res) {
    const userAccountMovement = await UserAccountMovement.findByPk(
      req.params.userAccountMovementId,
      userQuery.get( { req, UserAccount } )
    );

    if (!userAccountMovement) {
      return res.status(404).send({
        message: '404 on UserAccountMovement get',
      });
    }

    return res.status(200).send(userAccountMovement);
  },

  async getLastMovement(userAccountId) {
    return await UserAccountMovement.findAll({
      where: {
        userAccountId,
      },
      limit: 1,
      order: [ [ 'createdAt', 'DESC' ]],
      silence: true
    });

  },

  async update(req, res) {
    const userAccountMovement = await UserAccountMovement.findOne({
      where: {
        id: req.params.userAccountMovementId,
      },
      silence: true
    });

    if (!userAccountMovement) {
      return res.status(404).send({
        message: '404 on UserAccountMovement update',
      });
    }

    const updatedUserAccountMovement = await userAccountMovement.update({
      debit: req.body.debit || userAccountMovement.debit,
      credit: req.body.credit || userAccountMovement.credit,
      accountValue: req.body.accountValue || userAccountMovement.accountValue,
      reference: req.body.reference || userAccountMovement.reference,
      status: _.get(req, 'body.status', 1),
      createdAt: req.body.createdAt || userAccountMovement.createdAt,
      updatedAt: new Date(),
    });

    return res.status(200).send(updatedUserAccountMovement);
  },

  async delete(req, res) {
    const userAccountMovement = await UserAccountMovement.findOne({
      where: {
        id: req.params.userAccountMovementId,
      },
    });

    if (!userAccountMovement) {
      return res.status(404).send({
        message: 'UserAccountMovement Not Found',
      });
    }

    await userAccountMovement.destroy();

    return res.status(200).send({
      message: 'UserAccountMovement has been deleted',
    });
  },
};
