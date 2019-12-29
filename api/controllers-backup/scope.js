import { Scope } from '../models';
import { scopeQuery } from '../queries';

module.exports = {
  async create(req, res) {
    try {
      const scope = await Scope.create({
        name: req.body.name,
        code: req.body.code,
        status: 1,
        createdAt: new Date(),
      });

      return res.status(200).send(scope);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async list(req, res) {
    const scopes = await Scope.findAll(
      scopeQuery.list({ req })
    );

    if (!scopes) {
      return res.status(404).send({
        message: '404 on Scope get List',
      });
    }

    return res.status(200).send(scopes);
  },

  async get(req, res) {
    const scope = await Scope.findByPk(
      req.params.scopeId
    );

    if (!scope) {
      return res.status(404).send({
        message: '404 on Scope get',
      });
    }

    return res.status(200).send(scope);
  },

  async update(req, res) {
    const scope = await Scope.findOne({
      where: {
        id: req.params.scopeId,
      },
    });

    if (!scope) {
      return res.status(404).send({
        message: '404 on Scope update',
      });
    }

    const updatedScope = await scope.update({
      name: req.body.name || scope.name,
      code: req.body.code || scope.code,
      updatedAt: new Date(),
    });

    return res.status(200).send(updatedScope);
  },

  async delete(req, res) {
    const scope = await Scope.findOne({
      where: {
        id: req.params.scopeId,
      },
    });

    if (!scope) {
      return res.status(404).send({
        message: 'Scope Not Found',
      });
    }

    //await scope.destroy();
    await scope.update( {
      status: 0,
    } );

    return res.status(200).send({
      message: 'Scope has been deleted',
    });
  },
};
