import { Account } from '../models'

module.exports = {
  async create(req, res) {
    try {
      const account = await Account.create({
        name: req.body.name,
        percentage: Number(req.body.percentage),
        status: 1,
        associatedOperation: req.body.associatedOperation,
        holdStatusCommissionAmount: req.body.holdStatusCommissionAmount || 0,
        createdAt: new Date(),
      })

      return res.status(200).send(account)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async list(req, res) {
    try {
      const accounts = await Account.findAll({
        where: {
          status: 1,
        },
        attributes: [
          'id',
          'name',
          'percentage',
          'associatedOperation',
          'holdStatusCommissionAmount',
        ],
        order: [['id', 'DESC']],
      })

      if (!accounts) {
        return res.status(404).send({
          message: '404 on Account get List',
        })
      }
      return res.status(200).send(accounts)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async get(req, res) {
    try {
      const account = await Account.findByPk(req.params.id)

      if (!account) {
        return res.status(404).send({
          message: '404 on Account get',
        })
      }

      return res.status(200).send(account)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async update(req, res) {
    try {
      const account = await Account.findByPk(req.params.id)

      if (!account) {
        return res.status(404).send({
          message: '404 on Account update',
        })
      }

      const updatedAccount = await account.update({
        name: req.body.name || account.name,
        percentage: Number(req.body.percentage) || account.percentage,
        associatedOperation: req.body.associatedOperation || account.associatedOperation,
        holdStatusCommissionAmount:
          req.body.holdStatusCommissionAmount || account.holdStatusCommissionAmount,
        updatedAt: new Date(),
      })

      return res.status(200).send(updatedAccount)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async delete(req, res) {
    try {
      const account = await Account.findByPk(req.params.id)

      if (!account) {
        return res.status(404).send({
          message: 'Account Not Found',
        })
      }

      await account.update({
        status: 0,
      })

      return res.status(200).send({
        message: 'Account has been deleted',
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },
}
