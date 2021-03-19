import { WireTransferRequest, UserAccount, User, ORM } from '../models'
import { wireTransferRequestQuery } from '../queries'
import moment from 'moment-timezone'

module.exports = {
  async create(req, res) {
    try {
      await ORM.transaction(async (t) => {
        const wireTransferRequest = await WireTransferRequest.create({
          currencyType: req.body.currencyType,
          accountRCM: req.body.accountRCM,
          amount: Number(req.body.amount),
          commissionsCharge: Number(req.body.commissionsCharge),
          commissionsReferenceDetail: req.body.commissionsReferenceDetail,

          beneficiaryPersonAccountNumber: req.body.beneficiaryPersonAccountNumber,
          beneficiaryPersonFirstName: req.body.beneficiaryPersonFirstName,
          beneficiaryPersonLastName: req.body.beneficiaryPersonLastName,
          beneficiaryPersonAddress: req.body.beneficiaryPersonAddress,

          beneficiaryBankName: req.body.beneficiaryBankName,
          beneficiaryBankSwift: req.body.beneficiaryBankSwift,
          beneficiaryBankABA: req.body.beneficiaryBankABA,
          beneficiaryBankAddress: req.body.beneficiaryBankAddress,

          intermediaryBankName: req.body.intermediaryBankName,
          intermediaryBankSwift: req.body.intermediaryBankSwift,
          intermediaryBankABA: req.body.intermediaryBankABA,
          intermediaryBankAddress: req.body.intermediaryBankAddress,
          intermediaryBankAccountInterBank: req.body.intermediaryBankAccountInterBank,

          transferMethod: req.body.transferMethod,
          accountWithdrawalRequest: req.body.accountWithdrawalRequest,
          username: req.body.username,
          status: 1,
          userAccountId: req.body.userAccountId,
          associatedOperation: req.body.associatedOperation,
          createdAt: req.body.createdAt
            ? moment(new Date(req.body.createdAt)).tz('America/New_York').format()
            : moment(new Date()).tz('America/New_York').format(),
          updatedAt: moment(new Date()).tz('America/New_York').format(),
        })

        const userAccount = await UserAccount.findOne(
          {
            where: {
              id: req.body.userAccountId,
            },
          },
          { transaction: t }
        )

        if (!userAccount) {
          throw new Error('Ocurrió un error al momento de buscar la cuenta del usuario')
        }

        await userAccount.update(
          {
            guaranteeOperationNet: req.body.guaranteeOperationNet,
            wireTransferAmount: Number(req.body.amount) + Number(req.body.commissionsCharge),
          },
          { transaction: t }
        )

        return res.status(200).send(wireTransferRequest)
      })
    } catch (err) {
      console.error(err)
      return res.status(500).send(err)
    }
  },

  async list(req, res) {
    const wireTransferRequests = await WireTransferRequest.findAll(
      wireTransferRequestQuery.list({ req, UserAccount, User })
    )

    if (!wireTransferRequests) {
      return res.status(404).send({
        message: '404 on WireTransferRequest get List',
      })
    }
    return res.status(200).send(wireTransferRequests)
  },

  async get(req, res) {
    const wireTransferRequest = await WireTransferRequest.findByPk(req.params.wireTransferRequestId)

    if (!wireTransferRequest) {
      return res.status(404).send({
        message: '404 on WireTransferRequest get',
      })
    }

    return res.status(200).send(wireTransferRequest)
  },

  async getByUserAccountId(req, res) {
    const wireTransferRequest = await WireTransferRequest.findAll(
      wireTransferRequestQuery.listByUserAccountId({ req })
    )

    if (!wireTransferRequest) {
      return res.status(404).send({
        message: '404 on WireTransferRequest get',
      })
    }

    return res.status(200).send(wireTransferRequest)
  },

  async update(req, res) {
    const wireTransferRequest = await WireTransferRequest.findOne({
      where: {
        id: req.params.wireTransferRequestId,
      },
    })

    if (!wireTransferRequest) {
      return res.status(404).send({
        message: '404 on WireTransferRequest update',
      })
    }

    try {
      await ORM.transaction(async (t) => {
        const updatedWireTransferRequest = await wireTransferRequest.update(
          {
            currencyType: req.body.currencyType || wireTransferRequest.currencyType,
            accountRCM: req.body.accountRCM || wireTransferRequest.accountRCM,
            amount: Number(req.body.amount) || wireTransferRequest.amount,
            commissionsCharge:
              Number(req.body.commissionsCharge) || wireTransferRequest.commissionsCharge,
            commissionsReferenceDetail:
              req.body.commissionsReferenceDetail || wireTransferRequest.commissionsReferenceDetail,
            beneficiaryPersonAccountNumber:
              req.body.beneficiaryPersonAccountNumber ||
              wireTransferRequest.beneficiaryPersonAccountNumber,
            beneficiaryPersonFirstName:
              req.body.beneficiaryPersonFirstName || wireTransferRequest.beneficiaryPersonFirstName,

            beneficiaryPersonLastName:
              req.body.beneficiaryPersonLastName || wireTransferRequest.beneficiaryPersonLastName,
            beneficiaryPersonAddress:
              req.body.beneficiaryPersonAddress || wireTransferRequest.beneficiaryPersonAddress,
            beneficiaryBankName:
              req.body.beneficiaryBankName || wireTransferRequest.beneficiaryBankName,
            beneficiaryBankSwift:
              req.body.beneficiaryBankSwift || wireTransferRequest.beneficiaryBankSwift,
            beneficiaryBankABA:
              req.body.beneficiaryBankABA || wireTransferRequest.beneficiaryBankABA,
            beneficiaryBankAddress:
              req.body.beneficiaryBankAddress || wireTransferRequest.beneficiaryBankAddress,
            intermediaryBankName:
              req.body.intermediaryBankName || wireTransferRequest.intermediaryBankName,
            intermediaryBankSwift:
              req.body.intermediaryBankSwift || wireTransferRequest.intermediaryBankSwift,
            intermediaryBankABA:
              req.body.intermediaryBankABA || wireTransferRequest.intermediaryBankABA,
            intermediaryBankAddress:
              req.body.intermediaryBankAddress || wireTransferRequest.intermediaryBankAddress,
            intermediaryBankAccountInterBank:
              req.body.intermediaryBankAccountInterBank ||
              wireTransferRequest.intermediaryBankAccountInterBank,
            username: req.body.username || wireTransferRequest.username,
            transferMethod: req.body.transferMethod || wireTransferRequest.transferMethod,
            accountWithdrawalRequest:
              req.body.accountWithdrawalRequest || wireTransferRequest.accountWithdrawalRequest,
            userAccountId: req.body.userAccountId || wireTransferRequest.userAccountId,
            notes: req.body.notes || wireTransferRequest.notes,
            associatedOperation:
              req.body.associatedOperation | wireTransferRequest.associatedOperation,
            status: req.body.status,
            updatedAt: new Date(),
            closedAt:
              req.body.status === 4
                ? moment(new Date()).tz('America/New_York').format()
                : wireTransferRequest.closedAt,
          },
          { transaction: t }
        )

        /**
         * 4 = closed
         * On operation closed we need to clean the values guaranteeOperationNet and wireTransferAmount
         * from userAccount table
         */

        if (req.body.status === 4) {
          const userAccount = await UserAccount.findOne(
            {
              where: {
                id: req.body.userAccountId,
              },
            },
            { transaction: t }
          )

          if (!userAccount) {
            throw new Error('Ocurrió un error al momento de buscar la cuenta del usuario')
          }

          await userAccount.update(
            {
              guaranteeOperationNet: 0.0,
              wireTransferAmount: 0.0,
            },
            { transaction: t }
          )
        }

        return res.status(200).send(updatedWireTransferRequest)
      })
    } catch (e) {}
  },

  async delete(req, res) {
    const wireTransferRequest = await WireTransferRequest.findOne({
      where: {
        id: req.params.wireTransferRequestId,
      },
    })

    if (!wireTransferRequest) {
      return res.status(404).send({
        message: 'WireTransferRequest Not Found',
      })
    }

    //await wireTransferRequest.destroy();
    await wireTransferRequest.update({
      status: 0,
    })

    return res.status(200).send({
      message: 'WireTransferRequest has been deleted',
    })
  },
}
