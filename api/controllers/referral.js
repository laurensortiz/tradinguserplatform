import { Referral, UserAccount, User } from '../models';
import { referralQuery } from '../queries';
import SendEmail from '../../common/email';

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
        brokerGuaranteeCode: req.body.brokerGuaranteeCode,
        quantity: Number(req.body.quantity),
        personalIdDocument: req.body.personalIdDocument,
        collaboratorIB: req.body.collaboratorIB,
        description: req.body.description,
        status: 1,
        userAccountId: req.body.userAccountId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const sendEmail = await SendEmail({
        ...req.body,
        ticketId: referral.id
      });


      return res.status(200).send(referral);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async list(req, res) {
    const referrals = await Referral.findAll(
      referralQuery.list({ req, UserAccount, User })
    );

    if (!referrals) {
      return res.status(404).send({
        message: '404 on Referral get List',
      });
    }
    return res.status(200).send(referrals);
  },

  async get(req, res) {
    const referral = await Referral.findByPk(
      req.params.referralId
    );

    if (!referral) {
      return res.status(404).send({
        message: '404 on Referral get',
      });
    }

    return res.status(200).send(referral);
  },

  async getByUserAccountId(req, res) {
    const referral = await Referral.findAll(
      req.params.userAccountId
    );

    if (!referral) {
      return res.status(404).send({
        message: '404 on Referral get',
      });
    }

    return res.status(200).send(referral);
  },

  async update(req, res) {
    const referral = await Referral.findOne({
      where: {
        id: req.params.referralId,
      },
    });

    if (!referral) {
      return res.status(404).send({
        message: '404 on Referral update',
      });
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
      brokerGuaranteeCode: req.body.brokerGuaranteeCode || referral.brokerGuaranteeCode,
      quantity: Number(req.body.quantity) || referral.quantity,
      personalIdDocument: req.body.personalIdDocument || referral.personalIdDocument,
      collaboratorIB: req.body.collaboratorIB || referral.collaboratorIB,
      description: req.body.description || referral.description,
      userAccountId: req.body.userAccountId || referral.userAccountId,
      notes: req.body.notes || referral.notes,
      status: req.body.status,
      updatedAt: new Date(),
    });

    return res.status(200).send(updatedReferral);
  },

  async delete(req, res) {
    const referral = await Referral.findOne({
      where: {
        id: req.params.referralId,
      },
    });

    if (!referral) {
      return res.status(404).send({
        message: 'Referral Not Found',
      });
    }

    //await referral.destroy();
    await referral.update( {
      status: 0,
    } );

    return res.status(200).send({
      message: 'Referral has been deleted',
    });
  },
};
