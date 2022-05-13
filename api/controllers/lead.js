import { Lead } from '../models'
import moment from 'moment-timezone'
import SendEmail from '../../common/email/lead'

module.exports = {
  async create(req, res) {
    try {
      const lead = await Lead.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        country: req.body.country,
        status: 1,
        createdAt: moment(new Date()).tz('America/New_York').format(),
        updatedAt: moment(new Date()).tz('America/New_York').format(),
      })
      await SendEmail(req.body)

      return res.status(200).send(lead)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async list(req, res) {
    try {
      const leads = await Lead.findAll({
        where: {
          status: req.params.status || 1,
        },
        order: [['id', 'DESC']],
      })

      if (!leads) {
        return res.status(404).send({
          message: '404 on Lead get List',
        })
      }
      return res.status(200).send(leads)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async get(req, res) {
    try {
      const lead = await Lead.findByPk(req.params.id)

      if (!lead) {
        return res.status(404).send({
          message: '404 on Lead get',
        })
      }

      return res.status(200).send(lead)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async update(req, res) {
    try {
      const lead = await Lead.findByPk(req.params.id)

      if (!lead) {
        return res.status(404).send({
          message: '404 on Lead update',
        })
      }

      const updatedLead = await lead.update({
        firstName: req.body.firstName || lead.firstName,
        lastName: req.body.lastName || lead.lastName,
        email: req.body.email || lead.email,
        phoneNumber: req.body.phoneNumber || lead.phoneNumber,
        country: req.body.country || lead.country,
        notes: req.body.notes || lead.notes,
        status: req.body.status,
        updatedAt: moment(new Date()).tz('America/New_York').format(),
      })

      return res.status(200).send(updatedLead)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async delete(req, res) {
    try {
      const lead = await Lead.findByPk(req.params.id)

      if (!lead) {
        return res.status(404).send({
          message: 'Lead Not Found',
        })
      }

      await lead.update({
        status: 0,
      })

      return res.status(200).send({
        message: 'Lead has been deleted',
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },
}
