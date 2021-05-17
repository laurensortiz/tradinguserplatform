import _ from 'lodash'
import moment from 'moment-timezone'
import { InvestmentMovement } from '../models'
import { investmentMovementQuery } from '../queries'

module.exports = {
  async create(req, res) {
    try {
      const investmentMovement = await InvestmentMovement.create({
        gpInversion: req.body.gpInversion,
        investmentOperationId: Number(req.body.investmentOperationId),
        gpAmount: req.body.gpAmount,
        status: _.get(req, 'body.status', 1),
        createdAt:
          moment(req.body.createdAt).tz('America/New_York').format() ||
          moment().tz('America/New_York').format(),
        updatedAt: moment().tz('America/New_York').format(),
      })

      return res.status(200).send(investmentMovement)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async list(req, res) {
    try {
      const investmentMovement = await InvestmentMovement.findAll(
        investmentMovementQuery.list({ req })
      )

      if (!investmentMovement) {
        return res.status(404).send({
          message: '404 on InvestmentMovement get List',
        })
      }
      return res.status(200).send(investmentMovement)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async get(req, res) {
    try {
      const investmentMovement = await InvestmentMovement.findByPk(req.params.id)

      if (!investmentMovement) {
        return res.status(404).send({
          message: '404 on InvestmentMovement get',
        })
      }

      return res.status(200).send(investmentMovement)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async update(req, res) {
    try {
      const investmentMovement = await InvestmentMovement.findByPk(req.params.id)

      if (!investmentMovement) {
        return res.status(404).send({
          message: '404 on InvestmentMovement update',
        })
      }

      const updatedInvestmentMovement = await investmentMovement.update({
        gpInversion: req.body.gpInversion || investmentMovement.gpInversion,
        gpAmount: req.body.gpAmount || investmentMovement.gpAmount,
        status: _.get(req, 'body.status', 1),
        createdAt:
          moment(req.body.createdAt).tz('America/New_York').format() ||
          investmentMovement.createdAt,
        updatedAt: moment().tz('America/New_York').format(),
      })

      return res.status(200).send(updatedInvestmentMovement)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async delete(req, res) {
    try {
      const investmentMovement = await InvestmentMovement.findByPk(req.params.id)

      if (!investmentMovement) {
        return res.status(404).send({
          message: 'InvestmentMovement Not Found',
        })
      }

      await investmentMovement.destroy()

      return res.status(200).send({
        message: 'InvestmentMovement has been deleted',
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },
}
