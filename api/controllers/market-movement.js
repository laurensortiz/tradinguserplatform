import _ from 'lodash';
import { MarketOperation, UserAccount, User, Account, MarketMovement } from '../models';
import { marketMovementQuery, userQuery } from '../queries';
import moment from "moment-timezone";


module.exports = {
  async create(req, res) {
    try {
      const marketMovement = await MarketMovement.create({
        gpInversion: req.body.gpInversion === '' || req.body.gpInversion === 'NaN' ? 0 : req.body.gpInversion,
        marketOperationId: Number(req.body.marketOperationId),
        gpAmount: req.body.gpAmount === '' || req.body.gpAmount === 'NaN' ? 0 : req.body.gpAmount,
        marketPrice: req.body.marketPrice === '' || req.body.marketPrice === 'NaN' ? 0 : req.body.marketPrice || 0,
        status: _.get(req, 'body.status', 1),
        createdAt: moment(req.body.createdAt).tz('America/New_York').format() || moment(new Date()).tz('America/New_York').format(),
        updatedAt: moment(new Date()).tz('America/New_York').format()
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

  async getLastMovement(operationId) {
    const lastMovement = await MarketMovement.findAll({
      where: {
        marketOperationId: operationId,
      },
      limit: 1,
      order: [ [ 'createdAt', 'DESC' ]],
      silence: true
    });

    return lastMovement;
  },

  async update(req, res) {
    const marketMovement = await MarketMovement.findOne({
      where: {
        id: req.params.marketMovementId,
      },
      silence: true
    });

    if (!marketMovement) {
      return res.status(404).send({
        message: '404 on MarketMovement update',
      });
    }


    const updatedMarketMovement = await marketMovement.update({
      gpInversion: req.body.gpInversion === '' || req.body.gpInversion === 'NaN' ? 0 : req.body.gpInversion || marketMovement.gpInversion,
      gpAmount: req.body.gpAmount === '' || req.body.gpAmount === 'NaN' ? 0 : req.body.gpAmount || marketMovement.gpAmount,
      marketPrice: req.body.marketPrice === '' || req.body.marketPrice === 'NaN'  ? 0 : req.body.marketPrice || marketMovement.marketPrice,
      status: _.get(req, 'body.status', 1),
      createdAt: req.body.createdAt || marketMovement.createdAt,
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

    await marketMovement.destroy();
    // await marketMovement.update( {
    //   status: 0,
    // } );

    return res.status(200).send({
      message: 'MarketMovement has been deleted',
    });
  },
};
