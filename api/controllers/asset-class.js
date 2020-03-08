import { AssetClass } from '../models';
import { assetClassQuery } from '../queries';

module.exports = {
  async create(req, res) {
    try {
      const assetClass = await AssetClass.create({
        name: req.body.name,
        status: 1,
        createdAt: new Date(),
      });

      return res.status(200).send(assetClass);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async list(req, res) {
    const assetClasses = await AssetClass.findAll(
      assetClassQuery.list({ req })
    );

    if (!assetClasses) {
      return res.status(404).send({
        message: '404 on AssetClass get List',
      });
    }
    return res.status(200).send(assetClasses);
  },

  async get(req, res) {
    const assetClass = await AssetClass.findByPk(
      req.params.assetClassId
    );

    if (!assetClass) {
      return res.status(404).send({
        message: '404 on AssetClass get',
      });
    }

    return res.status(200).send(assetClass);
  },

  async update(req, res) {
    const assetClass = await AssetClass.findOne({
      where: {
        id: req.params.assetClassId,
      },
    });

    if (!assetClass) {
      return res.status(404).send({
        message: '404 on AssetClass update',
      });
    }

    const updatedAssetClass = await assetClass.update({
      name: req.body.name || assetClass.name,
      code: req.body.code || assetClass.code,
      updatedAt: new Date(),
    });

    return res.status(200).send(updatedAssetClass);
  },

  async delete(req, res) {
    const assetClass = await AssetClass.findOne({
      where: {
        id: req.params.assetClassId,
      },
    });

    if (!assetClass) {
      return res.status(404).send({
        message: 'AssetClass Not Found',
      });
    }

    //await assetClass.destroy();
    await assetClass.update( {
      status: 0,
    } );

    return res.status(200).send({
      message: 'AssetClass has been deleted',
    });
  },
};
