import { AssetClass } from '../models'

module.exports = {
  async create(req, res) {
    try {
      const assetClass = await AssetClass.create({
        name: req.body.name,
        status: 1,
        createdAt: new Date(),
      })

      return res.status(200).send(assetClass)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async list(req, res) {
    try {
      const assetClasses = await AssetClass.findAll({
        where: {
          status: 1,
        },
        attributes: ['id', 'name'],
        order: [['id', 'DESC']],
      })

      if (!assetClasses) {
        return res.status(404).send({
          message: '404 on AssetClass get List',
        })
      }
      return res.status(200).send(assetClasses)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async get(req, res) {
    try {
      const assetClass = await AssetClass.findByPk(req.params.id)

      if (!assetClass) {
        return res.status(404).send({
          message: '404 on AssetClass get',
        })
      }

      return res.status(200).send(assetClass)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async update(req, res) {
    try {
      const assetClass = await AssetClass.findByPk(req.params.id)

      if (!assetClass) {
        return res.status(404).send({
          message: '404 on AssetClass update',
        })
      }

      const updatedAssetClass = await assetClass.update({
        name: req.body.name || assetClass.name,
        code: req.body.code || assetClass.code,
        updatedAt: new Date(),
      })

      return res.status(200).send(updatedAssetClass)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async delete(req, res) {
    try {
      const assetClass = await AssetClass.findByPk(req.params.id)

      if (!assetClass) {
        return res.status(404).send({
          message: 'AssetClass Not Found',
        })
      }

      await assetClass.update({
        status: 0,
      })

      return res.status(200).send({
        message: 'AssetClass has been deleted',
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },
}
