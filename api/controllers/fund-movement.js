import _ from 'lodash'
import moment from 'moment-timezone'
import { FundMovement, FundOperation } from '../models'
import { fundMovementQuery } from '../queries'

module.exports = {
  async create(req, res) {
    const percentage =
      req.body.percentage === '' || req.body.percentage === 'NaN' ? 0 : req.body.percentage
    try {
      const fundMovement = await FundMovement.create({
        gpInversion: req.body.gpInversion,
        gpAmount: req.body.gpAmount,
        fundOperationId: Number(req.body.fundOperationId),
        percentage: Number(percentage),
        status: _.get(req, 'body.status', 1),
        createdAt:
          moment(req.body.createdAt).tz('America/New_York').format() ||
          moment().tz('America/New_York').format(),
        updatedAt: moment().tz('America/New_York').format(),
      })

      const fundOperation = await FundOperation.findByPk(req.body.fundOperationId)

      await fundOperation.update({
        amount: req.body.gpInversion || fundOperation.amount,
      })

      return res.status(200).send(fundMovement)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async list(req, res) {
    try {
      const fundMovement = await FundMovement.findAll(fundMovementQuery.list({ req }))

      if (!fundMovement) {
        return res.status(404).send({
          message: '404 on FundMovement get List',
        })
      }
      return res.status(200).send(fundMovement)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async get(req, res) {
    try {
      const fundMovement = await FundMovement.findByPk(req.params.id)

      if (!fundMovement) {
        return res.status(404).send({
          message: '404 on FundMovement get',
        })
      }

      return res.status(200).send(fundMovement)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async getLastMovement(movementId) {
    return await FundMovement.findAll({
      where: {
        marketOperationId: movementId || -1,
      },
      limit: 1,
      order: [['createdAt', 'DESC']],
      silence: true,
    })
  },

  async update(req, res) {
    try {
      const fundMovement = await FundMovement.findByPk(req.params.id)

      if (!fundMovement) {
        return res.status(404).send({
          message: '404 on FundMovement update',
        })
      }

      const percentage =
        req.body.percentage === '' || req.body.percentage === 'NaN'
          ? 0
          : req.body.percentage || fundMovement.percentage

      const updatedFundMovement = await fundMovement.update({
        gpInversion: req.body.gpInversion || fundMovement.gpInversion,
        gpAmount: req.body.gpAmount || fundMovement.gpAmount,
        status: _.get(req, 'body.status', 1),
        percentage: Number(percentage),
        createdAt:
          moment(req.body.createdAt).tz('America/New_York').format() || fundMovement.createdAt,
        updatedAt: moment().tz('America/New_York').format(),
      })

      return res.status(200).send(updatedFundMovement)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async delete(req, res) {
    try {
      const fundMovement = await FundMovement.findByPk(req.params.id)

      if (!fundMovement) {
        return res.status(404).send({
          message: 'FundMovement Not Found',
        })
      }

      await fundMovement.destroy()

      return res.status(200).send({
        message: 'FundMovement has been deleted',
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },
}
