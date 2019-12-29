import { Category } from '../models';
import { categoryQuery } from '../queries';

module.exports = {
  async create(req, res) {
    try {
      const category = await Category.create({
        name: req.body.name,
        code: req.body.code,
        status: 1,
        createdAt: new Date(),
      });

      return res.status(200).send(category);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async list(req, res) {
    const categories = await Category.findAll(
      categoryQuery.list({ req })
    );

    if (!categories) {
      return res.status(404).send({
        message: '404 on Category get List',
      });
    }

    return res.status(200).send(categories);
  },

  async get(req, res) {
    const category = await Category.findByPk(
      req.params.categoryId
    );

    if (!category) {
      return res.status(404).send({
        message: '404 on Category get',
      });
    }

    return res.status(200).send(category);
  },

  async update(req, res) {
    const category = await Category.findOne({
      where: {
        id: req.params.categoryId,
      },
    });

    if (!category) {
      return res.status(404).send({
        message: '404 on Category update',
      });
    }

    const updatedCategory = await category.update({
      name: req.body.name || category.name,
      code: req.body.code || category.code,
      updatedAt: new Date(),
    });

    return res.status(200).send(updatedCategory);
  },

  async delete(req, res) {
    const category = await Category.findOne({
      where: {
        id: req.params.categoryId,
      },
    });

    if (!category) {
      return res.status(404).send({
        message: 'Category Not Found',
      });
    }

    //await category.destroy();
    await category.update( {
      status: 0,
    } );

    return res.status(200).send({
      message: 'Category has been deleted',
    });
  },
};
