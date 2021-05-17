import { Commodity } from '../models'

module.exports = {
  async create(req, res) {
    try {
      const commodity = await Commodity.create({
        name: req.body.name,
        status: 1,
        createdAt: new Date(),
      })

      return res.status(200).send(commodity)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async list(req, res) {
    try {
      const commodities = await Commodity.findAll({
        where: {
          status: 1,
        },
        attributes: ['id', 'name'],
        order: [['id', 'DESC']],
      })

      if (!commodities) {
        return res.status(404).send({
          message: '404 on Commodity get List',
        })
      }
      return res.status(200).send(commodities)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async get(req, res) {
    try {
      const commodity = await Commodity.findByPk(req.params.id)

      if (!commodity) {
        return res.status(404).send({
          message: '404 on Commodity get',
        })
      }

      return res.status(200).send(commodity)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async update(req, res) {
    try {
      const commodity = await Commodity.findByPk(req.params.id)

      if (!commodity) {
        return res.status(404).send({
          message: '404 on Commodity update',
        })
      }

      const updatedCommodity = await commodity.update({
        name: req.body.name || commodity.name,
        code: req.body.code || commodity.code,
        updatedAt: new Date(),
      })

      return res.status(200).send(updatedCommodity)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async delete(req, res) {
    try {
      const commodity = await Commodity.findByPk(req.params.id)

      if (!commodity) {
        return res.status(404).send({
          message: 'Commodity Not Found',
        })
      }

      await commodity.update({
        status: 0,
      })

      return res.status(200).send({
        message: 'Commodity has been deleted',
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },
}
