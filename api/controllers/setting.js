import { Setting } from '../models'

module.exports = {
  async create(req, res) {
    try {
      const setting = await Setting.create({
        name: req.body.name,
        value: req.body.value,
        status: 1,
        createdAt: new Date(),
      })

      return res.status(200).send(setting)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async list(req, res) {
    try {
      const settings = await Setting.findAll({
        where: {
          status: 1,
        },
        attributes: ['id', 'name', 'value'],
        order: [['id', 'DESC']],
      })

      if (!settings) {
        return res.status(404).send({
          message: '404 on Setting get List',
        })
      }
      return res.status(200).send(settings)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async get(req, res) {
    try {
      const setting = await Setting.findByPk(req.params.id)

      if (!setting) {
        return res.status(404).send({
          message: '404 on Setting get',
        })
      }

      return res.status(200).send(setting)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async update(req, res) {
    try {
      const setting = await Setting.findByPk(req.params.id)

      if (!setting) {
        return res.status(404).send({
          message: '404 on Setting update',
        })
      }

      const updatedSetting = await setting.update({
        name: req.body.name || setting.name,
        value: req.body.value || setting.value,
        status: req.body.status || setting.status,
        updatedAt: new Date(),
      })

      return res.status(200).send(updatedSetting)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async delete(req, res) {
    try {
      const setting = await Setting.findByPk(req.params.id)

      if (!setting) {
        return res.status(404).send({
          message: 'Setting Not Found',
        })
      }

      await setting.update({
        status: 0,
      })

      return res.status(200).send({
        message: 'Setting has been deleted',
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },
}
