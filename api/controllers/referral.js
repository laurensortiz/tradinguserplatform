import { Referral, UserAccount, User } from '../models'
import { referralQuery } from '../queries'
import SendEmail from '../../common/email'

module.exports = {
  async create(req, res) {
    try {
      const referral = await Referral.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        country: req.body.country,
        city: req.body.city,
        jobTitle: req.body.jobTitle,
        initialAmount: req.body.initialAmount,
        hasBrokerGuarantee: req.body.hasBrokerGuarantee,
        brokerName: req.body.brokerName,
        brokerName2: req.body.brokerName2,
        brokerGuaranteeCode: req.body.brokerGuaranteeCode,
        quantity: Number(req.body.quantity),
        personalIdDocument: req.body.personalIdDocument,
        collaboratorIB: req.body.collaboratorIB,
        description: req.body.description,
        username: req.body.username,
        isProcess1Completed: req.body.isProcess1Completed || 0,
        isProcess2Completed: req.body.isProcess2Completed || 0,
        isProcess3Completed: req.body.isProcess3Completed || 0,
        status: 1,
        userAccountId: req.body.userAccountId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      await SendEmail({
        ...req.body,
        ticketId: referral.id,
      })

      return res.status(200).send(referral)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async list(req, res) {
    try {
      const referrals = await Referral.findAll(referralQuery.list({ req, UserAccount, User }))

      if (!referrals) {
        return res.status(404).send({
          message: '404 on Referral get List',
        })
      }
      return res.status(200).send(referrals)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async get(req, res) {
    try {
      const referral = await Referral.findByPk(
        req.params.id,
        referralQuery.get({ UserAccount, User })
      )

      if (!referral) {
        return res.status(404).send({
          message: '404 on Referral get',
        })
      }

      return res.status(200).send(referral)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async getByUserAccountId(req, res) {
    try {
      const referral = await Referral.findAll(referralQuery.listByUsername({ req }))

      if (!referral) {
        return res.status(404).send({
          message: '404 on Referral get',
        })
      }

      return res.status(200).send(referral)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async update(req, res) {
    try {
      const referral = await Referral.findByPk(req.params.id)

      if (!referral) {
        return res.status(404).send({
          message: '404 on Referral update',
        })
      }

      const updatedReferral = await referral.update({
        firstName: req.body.firstName || referral.firstName,
        lastName: req.body.lastName || referral.lastName,
        email: req.body.email || referral.email,
        phoneNumber: req.body.phoneNumber || referral.phoneNumber,
        country: req.body.country || referral.country,
        city: req.body.city || referral.city,
        jobTitle: req.body.jobTitle || referral.jobTitle,
        initialAmount: req.body.initialAmount || referral.initialAmount,
        hasBrokerGuarantee: req.body.hasBrokerGuarantee,
        brokerName: req.body.brokerName || referral.brokerName,
        brokerName2: req.body.brokerName2 || referral.brokerName2,
        brokerGuaranteeCode: req.body.brokerGuaranteeCode || referral.brokerGuaranteeCode,
        quantity: Number(req.body.quantity) || referral.quantity,
        //personalIdDocument: req.body.personalIdDocument || referral.personalIdDocument,
        collaboratorIB: req.body.collaboratorIB || referral.collaboratorIB,
        description: req.body.description || referral.description,
        userAccountId: req.body.userAccountId || referral.userAccountId,
        notes: req.body.notes || referral.notes,
        isProcess1Completed: req.body.isProcess1Completed,
        isProcess2Completed: req.body.isProcess2Completed,
        isProcess3Completed: req.body.isProcess3Completed,
        status: req.body.status,
        updatedAt: new Date(),
      })

      return res.status(200).send(updatedReferral)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async delete(req, res) {
    try {
      const referral = await Referral.findByPk(req.params.id)

      if (!referral) {
        return res.status(404).send({
          message: 'Referral Not Found',
        })
      }

      await referral.update({
        status: 0,
      })

      return res.status(200).send({
        message: 'Referral has been deleted',
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },
}
