import { Role } from '../models'
import { roleQuery } from '../queries'

module.exports = {
  async create(req, res) {
    try {
      const role = await Role.create({
        name: req.body.name,
        percentage: req.body.percentage,
        status: 1,
        createdAt: new Date(),
      })

      return res.status(200).send(role)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async list(req, res) {
    try {
      const roles = await Role.findAll({
        where: {
          status: 1,
        },
        attributes: ['id', 'name'],
        order: [['id', 'DESC']],
      })

      if (!roles) {
        return res.status(404).send({
          message: '404 on Role get List',
        })
      }
      return res.status(200).send(roles)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async get(req, res) {
    try {
      const role = await Role.findByPk(req.params.id)

      if (!role) {
        return res.status(404).send({
          message: '404 on Role get',
        })
      }

      return res.status(200).send(role)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async update(req, res) {
    try {
      const role = await Role.findByPk(req.params.id)

      if (!role) {
        return res.status(404).send({
          message: '404 on Role update',
        })
      }

      const updatedRole = await role.update({
        name: req.body.name || role.name,
        code: req.body.code || role.code,
        updatedAt: new Date(),
      })

      return res.status(200).send(updatedRole)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async delete(req, res) {
    try {
      const role = await Role.findByPk(req.params.id)

      if (!role) {
        return res.status(404).send({
          message: 'Role Not Found',
        })
      }

      await role.update({
        status: 0,
      })

      return res.status(200).send({
        message: 'Role has been deleted',
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },
}
