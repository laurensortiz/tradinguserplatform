import _ from 'lodash';
import { MarketOperation, UserAccount, User, Account, MarketMovement, Product, Broker, Commodity, AssetClass } from '../models';
import { marketOperationQuery, userQuery } from '../queries';
import moment from "moment-timezone";

module.exports = {
  async create(req, res) {
    try {

      const marketOperation = await MarketOperation.create({
        longShort: req.body.longShort,
        userAccountId: _.get(req, 'body.userAccount.id', 0),
        brokerId: _.get(req, 'body.broker.id', 0),
        productId: _.get(req, 'body.product.id', 0),
        commoditiesTotal: req.body.commoditiesTotal,
        commodityId: _.get(req, 'body.commodity.id', 1),
        assetClassId: _.get(req, 'body.assetClass.id', 1),
        buyPrice: req.body.buyPrice,
        takingProfit: req.body.takingProfit,
        stopLost: req.body.stopLost,
        maintenanceMargin: req.body.maintenanceMargin,
        amount: req.body.amount,
        initialAmount: req.body.amount,
        orderId: req.body.orderId || 0,
        status: _.get(req, 'body.status', 1),
        createdAt: moment(req.body.createdAt).tz('America/New_York').format() || moment(new Date()).tz('America/New_York').format(),
        updatedAt: moment(new Date()).tz('America/New_York').format(),
      });


      await MarketMovement.create({
        gpInversion: req.body.amount,
        marketOperationId: Number(marketOperation.id),
        gpAmount: 0,
        marketPrice: 0,
        status: _.get(req, 'body.status', 1),
        createdAt: moment(req.body.createdAt).tz('America/New_York').format() || moment(new Date()).tz('America/New_York').format(),
        updatedAt: moment(new Date()).tz('America/New_York').format()
      });

      return res.status(200).send(marketOperation);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async list(req, res) {
    const marketOperation = await MarketOperation.findAll(
      marketOperationQuery.list({ req, UserAccount, User, Account, Product, Broker, Commodity, AssetClass })
    );

    if (!marketOperation) {
      return res.status(404).send({
        message: '404 on MarketOperation get List',
      });
    }
    return res.status(200).send(marketOperation);
  },

  async get(req, res) {
    const marketOperation = await MarketOperation.findByPk(
      req.params.marketOperationId,
      marketOperationQuery.get( { req, UserAccount, Product, Broker } )
    );

    if (!marketOperation) {
      return res.status(404).send({
        message: '404 on MarketOperation get',
      });
    }

    return res.status(200).send(marketOperation);
  },

  async update(req, res) {
    const marketOperation = await MarketOperation.findOne({
      where: {
        id: req.params.marketOperationId,
      },
      silence: true
    });

    if (!marketOperation) {
      return res.status(404).send({
        message: '404 on MarketOperation update',
      });
    }

    const updatedMarketOperation = await marketOperation.update({
      longShort: req.body.longShort || marketOperation.longShort,
      userAccountId: _.get(req, 'body.userAccount.id', 0) || marketOperation.userAccountId,
      brokerId: _.get(req, 'body.broker.id', 0) || marketOperation.brokerId,
      productId: _.get(req, 'body.product.id', 0) || marketOperation.productId,
      commoditiesTotal: req.body.commoditiesTotal || marketOperation.commoditiesTotal,
      commodityId: _.get(req, 'body.commodity.id', 1) || marketOperation.commodityId,
      assetClassId: _.get(req, 'body.assetClass.id', 1) || marketOperation.assetClassId,
      buyPrice: req.body.buyPrice || marketOperation.buyPrice,
      takingProfit: req.body.takingProfit || marketOperation.takingProfit,
      stopLost: req.body.stopLost || marketOperation.stopLost,
      maintenanceMargin: req.body.maintenanceMargin || marketOperation.maintenanceMargin,
      amount: req.body.amount || marketOperation.amount,
      initialAmount: req.body.initialAmount || marketOperation.initialAmount,
      orderId: req.body.orderId || marketOperation.orderId,
      status: _.get(req, 'body.status', 1) || marketOperation.status,
      createdAt: req.body.createdAt || marketOperation.createdAt,
    });

    return res.status(200).send(updatedMarketOperation);
  },

  async delete(req, res) {
    const marketOperation = await MarketOperation.findOne({
      where: {
        id: req.params.marketOperationId,
      },
    });

    if (!marketOperation) {
      return res.status(404).send({
        message: 'MarketOperation Not Found',
      });
    }

    //await marketOperation.destroy();
    await marketOperation.update( {
      status: 0,
    } );

    return res.status(200).send({
      message: 'MarketOperation has been deleted',
    });
  },
};
