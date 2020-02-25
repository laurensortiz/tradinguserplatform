import { Commodity } from '../models';
import { commodityQuery } from '../queries';

module.exports = {
  async create(req, res) {
    try {
      const commodity = await Commodity.create({
        name: req.body.name,
        status: 1,
        createdAt: new Date(),
      });

      return res.status(200).send(commodity);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async list(req, res) {
    const commodities = await Commodity.findAll(
      commodityQuery.list({ req })
    );

    if (!commodities) {
      return res.status(404).send({
        message: '404 on Commodity get List',
      });
    }
    return res.status(200).send(commodities);
  },

  async get(req, res) {
    const commodity = await Commodity.findByPk(
      req.params.commodityId
    );

    if (!commodity) {
      return res.status(404).send({
        message: '404 on Commodity get',
      });
    }

    return res.status(200).send(commodity);
  },

  async update(req, res) {
    const commodity = await Commodity.findOne({
      where: {
        id: req.params.commodityId,
      },
    });

    if (!commodity) {
      return res.status(404).send({
        message: '404 on Commodity update',
      });
    }

    const updatedCommodity = await commodity.update({
      name: req.body.name || commodity.name,
      code: req.body.code || commodity.code,
      updatedAt: new Date(),
    });

    return res.status(200).send(updatedCommodity);
  },

  async delete(req, res) {
    const commodity = await Commodity.findOne({
      where: {
        id: req.params.commodityId,
      },
    });

    if (!commodity) {
      return res.status(404).send({
        message: 'Commodity Not Found',
      });
    }

    //await commodity.destroy();
    await commodity.update( {
      status: 0,
    } );

    return res.status(200).send({
      message: 'Commodity has been deleted',
    });
  },
};
