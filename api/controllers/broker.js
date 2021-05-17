import { Broker } from '../models'

module.exports = {
  async create(req, res) {
    try {
      const broker = await Broker.create({
        name: req.body.name,
        status: 1,
        createdAt: new Date(),
      })

      return res.status(200).send(broker)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async list(req, res) {
    try {
      const brokers = await Broker.findAll({
        where: {
          status: 1,
        },
        attributes: ['id', 'name'],
        order: [['id', 'DESC']],
      })

      if (!brokers) {
        return res.status(404).send({
          message: '404 on Broker get List',
        })
      }
      return res.status(200).send(brokers)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async get(req, res) {
    try {
      const broker = await Broker.findByPk(req.params.id)

      if (!broker) {
        return res.status(404).send({
          message: '404 on Broker get',
        })
      }

      return res.status(200).send(broker)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async update(req, res) {
    try {
      const broker = await Broker.findByPk(req.params.id)

      if (!broker) {
        return res.status(404).send({
          message: '404 on Broker update',
        })
      }

      const updatedBroker = await broker.update({
        name: req.body.name || broker.name,
        code: req.body.code || broker.code,
        updatedAt: new Date(),
      })

      return res.status(200).send(updatedBroker)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async delete(req, res) {
    try {
      const broker = await Broker.findByPk(req.params.id)

      if (!broker) {
        return res.status(404).send({
          message: 'Broker Not Found',
        })
      }

      await broker.update({
        status: 0,
      })

      return res.status(200).send({
        message: 'Broker has been deleted',
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },
}
