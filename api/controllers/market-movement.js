import _ from 'lodash';
import { MarketOperation, UserAccount, User, Account, MarketMovement } from '../models';
import { marketMovementQuery, userQuery } from '../queries';

module.exports = {
  async create(req, res) {
    try {
      const marketMovement = await MarketMovement.create({
        gpInversion: req.body.gpInversion,
        marketOperationId: Number(req.body.marketOperationId),
        gpAmount: req.body.gpAmount,
        status: _.get(req, 'body.status', 1),
        createdAt: new Date(),
      });

      return res.status(200).send(marketMovement);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async list(req, res) {
    const marketMovement = await MarketMovement.findAll(
      marketMovementQuery.list({ req })
    );

    if (!marketMovement) {
      return res.status(404).send({
        message: '404 on MarketMovement get List',
      });
    }
    return res.status(200).send(marketMovement);
  },

  async get(req, res) {
    const marketMovement = await MarketMovement.findByPk(
      req.params.marketMovementId,
      userQuery.get( { req, UserAccount } )
    );

    if (!marketMovement) {
      return res.status(404).send({
        message: '404 on MarketMovement get',
      });
    }

    return res.status(200).send(marketMovement);
  },

  async update(req, res) {
    const marketMovement = await MarketMovement.findOne({
      where: {
        id: req.params.marketMovementId,
      },
    });

    if (!marketMovement) {
      return res.status(404).send({
        message: '404 on MarketMovement update',
      });
    }

    const updatedMarketMovement = await marketMovement.update({
      operationType: req.body.operationType || marketMovement.operationType,
      userAccountId: _.get(req, 'body.userAccount.id', 0) || marketMovement.userAccountId,
      amount: req.body.amount || marketMovement.amount,
      status: req.body.status || marketMovement.status,
      startDate: req.body.startDate || marketMovement.startDate,
      endDate: req.body.status || marketMovement.endDate,
      updatedAt: new Date(),
    });

    return res.status(200).send(updatedMarketMovement);
  },

  async delete(req, res) {
    const marketMovement = await MarketMovement.findOne({
      where: {
        id: req.params.marketMovementId,
      },
    });

    if (!marketMovement) {
      return res.status(404).send({
        message: 'MarketMovement Not Found',
      });
    }

    //await marketMovement.destroy();
    await marketMovement.update( {
      status: 0,
    } );

    return res.status(200).send({
      message: 'MarketMovement has been deleted',
    });
  },
};
