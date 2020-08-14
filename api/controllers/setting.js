import { Setting } from '../models';
import { settingQuery } from '../queries';

module.exports = {
  async create(req, res) {
    try {
      const setting = await Setting.create({
        name: req.body.name,
        value: req.body.value,
        status: 1,
        createdAt: new Date(),
      });

      return res.status(200).send(setting);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async list(req, res) {
    const settings = await Setting.findAll(
      settingQuery.list({ req })
    );

    if (!settings) {
      return res.status(404).send({
        message: '404 on Setting get List',
      });
    }
    return res.status(200).send(settings);
  },

  async get(req, res) {
    const setting = await Setting.findByPk(
      req.params.settingId
    );

    if (!setting) {
      return res.status(404).send({
        message: '404 on Setting get',
      });
    }

    return res.status(200).send(setting);
  },

  async update(req, res) {
    const setting = await Setting.findOne({
      where: {
        id: req.params.settingId,
      },
    });

    if (!setting) {
      return res.status(404).send({
        message: '404 on Setting update',
      });
    }

    const updatedSetting = await setting.update({
      name: req.body.name || setting.name,
      value: req.body.value || setting.value,
      status: req.body.status || setting.status,
      updatedAt: new Date(),
    });

    return res.status(200).send(updatedSetting);
  },

  async delete(req, res) {
    const setting = await Setting.findOne({
      where: {
        id: req.params.settingId,
      },
    });

    if (!setting) {
      return res.status(404).send({
        message: 'Setting Not Found',
      });
    }

    //await setting.destroy();
    await setting.update( {
      status: 0,
    } );

    return res.status(200).send({
      message: 'Setting has been deleted',
    });
  },
};
