import _ from 'lodash'
import { MarketMovement, sequelize } from '../models'
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

      const marketMovement = await MarketMovement.create({
        gpInversion: Number(`${gpInversion}`.replace(/\,/g, '')),
        gpAmount: Number(`${gpAmount}`.replace(/\,/g, '')),
        marketPrice: Number(`${marketPrice}`.replace(/\,/g, '')),
        marketOperationId: Number(req.body.marketOperationId),
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
      const { count } = await MarketMovement.findAndCountAll({
        where: {
          marketPrice,
          createdAt: {
            [Op.gt]: moment(createdAt).tz('America/New_York').format('YYYY-MM-DD 00:00:00'),
            [Op.lte]: moment(createdAt).tz('America/New_York').format('YYYY-MM-DD 23:59:59'),
          },
        },
      })

      return res.status(200).send({ count })
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
      await MarketMovement.destroy({
        where: {
          marketPrice,
          createdAt: {
            [Op.between]: [
              moment(createdAt).format('YYYY-MM-DD'),
              moment(createdAt).format('YYYY-MM-DD'),
            ],
          },
        },
      })

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
      const marketMovement = await MarketMovement.findByPk(req.params.id)

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
        marketOperationId: movementId,
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

      const updatedMarketMovement = await marketMovement.update({
        gpInversion: Number(`${gpInversion}`.replace(/\,/g, '')),
        gpAmount: Number(`${gpAmount}`.replace(/\,/g, '')),
        marketPrice: Number(`${marketPrice}`.replace(/\,/g, '')),
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
