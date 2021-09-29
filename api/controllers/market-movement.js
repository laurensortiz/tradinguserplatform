import _ from 'lodash'
import { MarketMovement, sequelize, ORM } from '../models'
import { marketMovementQuery } from '../queries'
import moment from 'moment-timezone'

module.exports = {
  async create(req, res) {
    try {
      const gpInversion =
        req.body.gpInversion === '' || req.body.gpInversion === 'NaN' ? 0 : req.body.gpInversion
      const gpAmount =
        req.body.gpAmount === '' || req.body.gpAmount === 'NaN' ? 0 : req.body.gpAmount
      const marketPrice =
        req.body.marketPrice === '' || req.body.marketPrice === 'NaN' ? 0 : req.body.marketPrice
      const fundsPercentage =
        req.body.fundsPercentage === '' || req.body.fundsPercentage === 'NaN'
          ? 0
          : req.body.fundsPercentage

      const marketMovement = await MarketMovement.create({
        gpInversion: Number(`${gpInversion}`.replace(/\,/g, '')),
        gpAmount: Number(`${gpAmount}`.replace(/\,/g, '')),
        marketPrice: Number(`${marketPrice}`.replace(/\,/g, '')),
        marketOperationId: Number(req.body.marketOperationId),
        fundsPercentage: Number(fundsPercentage),
        status: _.get(req, 'body.status', 1),
        createdAt:
          moment(req.body.createdAt).tz('America/New_York').format() ||
          moment(new Date()).tz('America/New_York').format(),
        updatedAt: moment(new Date()).tz('America/New_York').format(),
      })

      return res.status(200).send(marketMovement)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async list(req, res) {
    try {
      const marketMovement = await MarketMovement.findAll(marketMovementQuery.list({ req }))

      if (!marketMovement) {
        return res.status(404).send({
          message: '404 on MarketMovement get List',
        })
      }
      return res.status(200).send(marketMovement)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async count(req, res) {
    const Op = sequelize.Op
    const { marketPrice, createdAt } = req.body
    try {
      const count = await ORM.query(
        `SELECT count(*) FROM public."MarketMovement" where "marketPrice" = ${marketPrice} and "createdAt"::date ='${createdAt}'`,
        {
          raw: true,
          plain: true,
          type: sequelize.QueryTypes.SELECT,
        }
      )

      return res.status(200).send(count)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async bulkDelete(req, res) {
    const Op = sequelize.Op
    const { marketPrice, createdAt } = req.body
    try {
      await ORM.query(
        `DELETE FROM public."MarketMovement" where "marketPrice" = ${marketPrice} and "createdAt"::date ='${createdAt}'`,
        {
          raw: true,
          plain: true,
          type: sequelize.QueryTypes.SELECT,
        }
      )

      return res.status(200).send('Done Deletion')
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async get(req, res) {
    try {
      const marketMovement = await MarketMovement.findByPk(req.params.id || -1)

      if (!marketMovement) {
        return res.status(404).send({
          message: '404 on MarketMovement get',
        })
      }

      return res.status(200).send(marketMovement)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async getLastMovement(movementId) {
    return await MarketMovement.findAll({
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
      const marketMovement = await MarketMovement.findByPk(req.params.id)

      if (!marketMovement) {
        return res.status(404).send({
          message: '404 on MarketMovement update',
        })
      }

      const gpInversion =
        req.body.gpInversion === '' || req.body.gpInversion === 'NaN'
          ? 0
          : req.body.gpInversion || marketMovement.gpInversion
      const gpAmount =
        req.body.gpAmount === '' || req.body.gpAmount === 'NaN'
          ? 0
          : req.body.gpAmount || marketMovement.gpAmount

      const marketPrice =
        req.body.marketPrice === '' || req.body.marketPrice === 'NaN'
          ? 0
          : req.body.marketPrice || marketMovement.marketPrice

      const fundsPercentage =
        req.body.fundsPercentage === '' || req.body.fundsPercentage === 'NaN'
          ? 0
          : req.body.fundsPercentage || marketMovement.fundsPercentage

      const updatedMarketMovement = await marketMovement.update({
        gpInversion: Number(`${gpInversion}`.replace(/\,/g, '')),
        gpAmount: Number(`${gpAmount}`.replace(/\,/g, '')),
        marketPrice: Number(`${marketPrice}`.replace(/\,/g, '')),
        fundsPercentage: Number(fundsPercentage),
        status: _.get(req, 'body.status', 1),
        createdAt: req.body.createdAt || marketMovement.createdAt,
        updatedAt: new Date(),
      })

      return res.status(200).send(updatedMarketMovement)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async delete(req, res) {
    try {
      const marketMovement = await MarketMovement.findByPk(req.params.id)

      if (!marketMovement) {
        return res.status(404).send({
          message: 'MarketMovement Not Found',
        })
      }

      await marketMovement.destroy()

      return res.status(200).send({
        message: 'MarketMovement has been deleted',
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },
}
