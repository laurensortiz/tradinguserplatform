import _ from 'lodash';
import { InvestmentOperation, UserAccount, User, Account, InvestmentMovement } from '../models';
import { investmentOperationQuery, userQuery } from '../queries';

module.exports = {
  async create(req, res) {
    try {

      const investmentOperation = await InvestmentOperation.create({
        operationType: req.body.operationType,
        userAccountId: _.get(req, 'body.userAccount.id', 0),
        amount: req.body.amount,
        initialAmount: req.body.amount,
        status: _.get(req, 'body.status', 1),
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        createdAt: new Date(),
      });

      await InvestmentMovement.create({
        gpInversion: req.body.amount,
        investmentOperationId: Number(investmentOperation.id),
        gpAmount: 0,
        status: _.get(req, 'body.status', 1),
        createdAt: new Date(),
      });

      return res.status(200).send(investmentOperation);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async list(req, res) {
    const investmentOperation = await InvestmentOperation.findAll(
      investmentOperationQuery.list({ req, UserAccount, User, Account })
    );

    if (!investmentOperation) {
      return res.status(404).send({
        message: '404 on InvestmentOperation get List',
      });
    }
    return res.status(200).send(investmentOperation);
  },

  async get(req, res) {
    const investmentOperation = await InvestmentOperation.findByPk(
      req.params.investmentOperationId,
      userQuery.get( { req, UserAccount } )
    );

    if (!investmentOperation) {
      return res.status(404).send({
        message: '404 on InvestmentOperation get',
      });
    }

    return res.status(200).send(investmentOperation);
  },

  async update(req, res) {
    const investmentOperation = await InvestmentOperation.findOne({
      where: {
        id: req.params.investmentOperationId,
      },
    });

    if (!investmentOperation) {
      return res.status(404).send({
        message: '404 on InvestmentOperation update',
      });
    }

    const updatedInvestmentOperation = await investmentOperation.update({
      operationType: req.body.operationType || investmentOperation.operationType,
      userAccountId: _.get(req, 'body.userAccount.id', 0) || investmentOperation.userAccountId,
      amount: investmentOperation.amount,
      initialAmount: req.body.initialAmount || investmentOperation.initialAmount,
      status: req.body.status || investmentOperation.status,
      startDate: req.body.startDate || investmentOperation.startDate,
      endDate: req.body.status || investmentOperation.endDate,
      updatedAt: new Date(),
    });

    return res.status(200).send(updatedInvestmentOperation);
  },

  async delete(req, res) {
    const investmentOperation = await InvestmentOperation.findOne({
      where: {
        id: req.params.investmentOperationId,
      },
    });

    if (!investmentOperation) {
      return res.status(404).send({
        message: 'InvestmentOperation Not Found',
      });
    }

    //await investmentOperation.destroy();
    await investmentOperation.update( {
      status: 0,
    } );

    return res.status(200).send({
      message: 'InvestmentOperation has been deleted',
    });
  },
};
