import { Role } from '../models';
import { roleQuery } from '../queries';

module.exports = {
  async create(req, res) {
    try {
      const role = await Role.create({
        name: req.body.name,
        percentage: req.body.percentage,
        status: 1,
        createdAt: new Date(),
      });

      return res.status(200).send(role);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async list(req, res) {
    const roles = await Role.findAll(
      roleQuery.list({ req })
    );

    if (!roles) {
      return res.status(404).send({
        message: '404 on Role get List',
      });
    }
    return res.status(200).send(roles);
  },

  async get(req, res) {
    const role = await Role.findByPk(
      req.params.roleId
    );

    if (!role) {
      return res.status(404).send({
        message: '404 on Role get',
      });
    }

    return res.status(200).send(role);
  },

  async update(req, res) {
    const role = await Role.findOne({
      where: {
        id: req.params.roleId,
      },
    });

    if (!role) {
      return res.status(404).send({
        message: '404 on Role update',
      });
    }

    const updatedRole = await role.update({
      name: req.body.name || role.name,
      code: req.body.code || role.code,
      updatedAt: new Date(),
    });

    return res.status(200).send(updatedRole);
  },

  async delete(req, res) {
    const role = await Role.findOne({
      where: {
        id: req.params.roleId,
      },
    });

    if (!role) {
      return res.status(404).send({
        message: 'Role Not Found',
      });
    }

    //await role.destroy();
    await role.update( {
      status: 0,
    } );

    return res.status(200).send({
      message: 'Role has been deleted',
    });
  },
};
