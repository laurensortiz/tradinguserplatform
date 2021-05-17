import _ from 'lodash'
import moment from 'moment-timezone'
import { InvestmentOperation, UserAccount, InvestmentMovement, ORM } from '../models'
import { investmentOperationQuery, userQuery } from '../queries'

module.exports = {
  async create(req, res) {
    try {
      await ORM.transaction(async (t) => {
        const investmentOperation = await InvestmentOperation.create(
          {
            operationType: req.body.operationType,
            userAccountId: _.get(req, 'body.userAccount.id', 0),
            amount: req.body.amount,
            initialAmount: req.body.amount,
            status: _.get(req, 'body.status', 1),
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            createdAt: moment(new Date()).tz('America/New_York').format(),
            updatedAt: moment(new Date()).tz('America/New_York').format(),
          },
          { transaction: t }
        )

        await InvestmentMovement.create(
          {
            gpInversion: req.body.amount,
            investmentOperationId: Number(investmentOperation.id),
            gpAmount: 0,
            status: _.get(req, 'body.status', 1),
            createdAt: moment(new Date()).tz('America/New_York').format(),
            updatedAt: moment(new Date()).tz('America/New_York').format(),
          },
          { transaction: t }
        )
        return res.status(200).send(investmentOperation)
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async list(req, res) {
    try {
      const investmentOperation = await InvestmentOperation.findAll(
        investmentOperationQuery.list({ UserAccount })
      )

      if (!investmentOperation) {
        return res.status(404).send({
          message: '404 on InvestmentOperation get List',
        })
      }
      return res.status(200).send(investmentOperation)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async get(req, res) {
    try {
      const investmentOperation = await InvestmentOperation.findByPk(req.params.id)

      if (!investmentOperation) {
        return res.status(404).send({
          message: '404 on InvestmentOperation get',
        })
      }

      return res.status(200).send(investmentOperation)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async update(req, res) {
    try {
      const investmentOperation = await InvestmentOperation.findByPk(req.params.id)

      if (!investmentOperation) {
        return res.status(404).send({
          message: '404 on InvestmentOperation update',
        })
      }

      const updatedInvestmentOperation = await investmentOperation.update({
        operationType: req.body.operationType || investmentOperation.operationType,
        userAccountId: _.get(req, 'body.userAccount.id', 0) || investmentOperation.userAccountId,
        amount: investmentOperation.amount,
        initialAmount: req.body.initialAmount || investmentOperation.initialAmount,
        status: req.body.status || investmentOperation.status,
        startDate:
          moment(req.body.startDate).tz('America/New_York').format() ||
          investmentOperation.startDate,
        endDate:
          moment(req.body.endDate).tz('America/New_York').format() || investmentOperation.endDate,
        updatedAt: moment().tz('America/New_York').format(),
      })

      return res.status(200).send(updatedInvestmentOperation)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async delete(req, res) {
    try {
      const investmentOperation = await InvestmentOperation.findByPk(req.params.id)

      if (!investmentOperation) {
        return res.status(404).send({
          message: 'InvestmentOperation Not Found',
        })
      }

      await investmentOperation.update({
        status: 0,
      })

      return res.status(200).send({
        message: 'InvestmentOperation has been deleted',
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },
}
