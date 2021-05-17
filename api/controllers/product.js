import { Product } from '../models'

module.exports = {
  async create(req, res) {
    try {
      const product = await Product.create({
        name: req.body.name,
        code: req.body.code,
        status: 1,
        createdAt: new Date(),
      })

      return res.status(200).send(product)
    } catch (err) {
      return res.status(500).send(err)
    }
  },

  async list(req, res) {
    try {
      const products = await Product.findAll({
        where: {
          status: 1,
        },
        attributes: ['id', 'name', 'code'],
        order: [['id', 'DESC']],
      })

      if (!products) {
        return res.status(404).send({
          message: '404 on Product get List',
        })
      }

      return res.status(200).send(products)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async get(req, res) {
    try {
      const product = await Product.findByPk(req.params.id)

      if (!product) {
        return res.status(404).send({
          message: '404 on Product get',
        })
      }

      return res.status(200).send(product)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async update(req, res) {
    try {
      const product = await Product.findByPk(req.params.id)

      if (!product) {
        return res.status(404).send({
          message: '404 on Product update',
        })
      }

      const updatedProduct = await product.update({
        name: req.body.name || product.name,
        code: req.body.code || product.code,
        updatedAt: new Date(),
      })

      return res.status(200).send(updatedProduct)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async delete(req, res) {
    try {
      const product = await Product.findByPk(req.params.id)

      if (!product) {
        return res.status(404).send({
          message: 'Product Not Found',
        })
      }

      await product.update({
        status: 0,
      })

      return res.status(200).send({
        message: 'Product has been deleted',
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },
}
