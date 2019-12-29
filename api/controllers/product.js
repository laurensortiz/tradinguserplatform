import { Product } from '../models';
import { productQuery } from '../queries';

module.exports = {
  async create(req, res) {
    try {
      const product = await Product.create({
        name: req.body.name,
        code: req.body.code,
        status: 1,
        createdAt: new Date(),
      });

      return res.status(200).send(product);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async list(req, res) {
    const products = await Product.findAll(
      productQuery.list({ req })
    );

    if (!products) {
      return res.status(404).send({
        message: '404 on Product get List',
      });
    }

    return res.status(200).send(products);
  },

  async get(req, res) {
    const product = await Product.findByPk(
      req.params.productId
    );

    if (!product) {
      return res.status(404).send({
        message: '404 on Product get',
      });
    }

    return res.status(200).send(product);
  },

  async update(req, res) {
    const product = await Product.findOne({
      where: {
        id: req.params.productId,
      },
    });

    if (!product) {
      return res.status(404).send({
        message: '404 on Product update',
      });
    }

    const updatedProduct = await product.update({
      name: req.body.name || product.name,
      code: req.body.code || product.code,
      updatedAt: new Date(),
    });

    return res.status(200).send(updatedProduct);
  },

  async delete(req, res) {
    const product = await Product.findOne({
      where: {
        id: req.params.productId,
      },
    });

    if (!product) {
      return res.status(404).send({
        message: 'Product Not Found',
      });
    }

    //await product.destroy();
    await product.update( {
      status: 0,
    } );

    return res.status(200).send({
      message: 'Product has been deleted',
    });
  },
};
