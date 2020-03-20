import _ from 'lodash';
import { InvestmentOperation, UserAccount, User, Account, InvestmentMovement } from '../models';
import { investmentMovementQuery, userQuery } from '../queries';

module.exports = {
  async create(req, res) {
    try {

      const investmentMovement = await InvestmentMovement.create({
        gpInversion: req.body.gpInversion,
        investmentOperationId: Number(req.body.investmentOperationId),
        gpAmount: req.body.gpAmount,
        status: _.get(req, 'body.status', 1),
        createdAt: req.body.createdAt || new Date(),
      });

      return res.status(200).send(investmentMovement);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async list(req, res) {
    const investmentMovement = await InvestmentMovement.findAll(
      investmentMovementQuery.list({ req })
    );

    if (!investmentMovement) {
      return res.status(404).send({
        message: '404 on InvestmentMovement get List',
      });
    }
    return res.status(200).send(investmentMovement);
  },

  async get(req, res) {
    const investmentMovement = await InvestmentMovement.findByPk(
      req.params.investmentMovementId,
      userQuery.get( { req, UserAccount } )
    );

    if (!investmentMovement) {
      return res.status(404).send({
        message: '404 on InvestmentMovement get',
      });
    }

    return res.status(200).send(investmentMovement);
  },

  async update(req, res) {
    const investmentMovement = await InvestmentMovement.findOne({
      where: {
        id: req.params.investmentMovementId,
      },
    });

    if (!investmentMovement) {
      return res.status(404).send({
        message: '404 on InvestmentMovement update',
      });
    }

    const updatedInvestmentMovement = await investmentMovement.update({
      gpInversion: req.body.gpInversion || investmentMovement.gpInversion,
      gpAmount: req.body.gpAmount || investmentMovement.gpAmount,
      status: _.get(req, 'body.status', 1),
      createdAt: req.body.createdAt || investmentMovement.createdAt,
      updatedAt: new Date(),
    });

    return res.status(200).send(updatedInvestmentMovement);
  },

  async delete(req, res) {
    const investmentMovement = await InvestmentMovement.findOne({
      where: {
        id: req.params.investmentMovementId,
      },
    });

    if (!investmentMovement) {
      return res.status(404).send({
        message: 'InvestmentMovement Not Found',
      });
    }

    await investmentMovement.destroy();
    // await investmentMovement.update( {
    //   status: 0,
    // } );

    return res.status(200).send({
      message: 'InvestmentMovement has been deleted',
    });
  },
};
