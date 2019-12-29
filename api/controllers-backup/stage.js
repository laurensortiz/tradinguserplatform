import { Stage } from '../models';
import { stageQuery } from '../queries';

module.exports = {
  async create(req, res) {
    try {
      const stage = await Stage.create({
        name: req.body.name,
        code: req.body.code,
        status: 1,
        createdAt: new Date(),
      });

      return res.status(200).send(stage);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async list(req, res) {
    const stages = await Stage.findAll(
      stageQuery.list({ req })
    );

    if (!stages) {
      return res.status(404).send({
        message: '404 on Stage get List',
      });
    }

    return res.status(200).send(stages);
  },

  async get(req, res) {
    const stage = await Stage.findByPk(
      req.params.stageId
    );

    if (!stage) {
      return res.status(404).send({
        message: '404 on Stage get',
      });
    }

    return res.status(200).send(stage);
  },

  async update(req, res) {
    const stage = await Stage.findOne({
      where: {
        id: req.params.stageId,
      },
    });

    if (!stage) {
      return res.status(404).send({
        message: '404 on Stage update',
      });
    }

    const updatedStage = await stage.update({
      name: req.body.name || stage.name,
      code: req.body.code || stage.code,
      updatedAt: new Date(),
    });

    return res.status(200).send(updatedStage);
  },

  async delete(req, res) {
    const stage = await Stage.findOne({
      where: {
        id: req.params.stageId,
      },
    });

    if (!stage) {
      return res.status(404).send({
        message: 'Stage Not Found',
      });
    }

    //await stage.destroy();
    await stage.update( {
      status: 0,
    } );

    return res.status(200).send({
      message: 'Stage has been deleted',
    });
  },
};
