import { WireTransferRequest, UserAccount, User, ORM, sequelize } from '../models'
import { wireTransferRequestQuery } from '../queries'
import moment from 'moment-timezone'
import _ from 'lodash'
import Log from '../../common/log'

const NO_MONEY_ERROR_MESSAGE =
  'Su solicitud sobrepasa lo permitido por el exchange o no tiene garantías suficientes en su cuenta.'

module.exports = {
  async create(req, res) {
    const userId = _.get(req, 'user.id', 0)
    const userStartedDay = _.get(req, 'user.startDate', '')
    const isOTCAccount = req.body.associatedOperation === 1
    const amount = Number(req.body.amount.replace(',', ''))

    const is10percent = moment(userStartedDay).isBefore('2020-12-15', 'day')

    try {
      await ORM.transaction(async (t) => {
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

        let percentageFromAccount

        if (isOTCAccount) {
          percentageFromAccount = is10percent ? 10 : 7.5
        } else {
          percentageFromAccount = 100
        }

        const amountAvailable = (userAccount.accountValue / 100) * percentageFromAccount

        if (isOTCAccount) {
          if (parseFloat(userAccount.guaranteeOperation) < 0) {
            throw new Error(NO_MONEY_ERROR_MESSAGE)
          }
          if (parseFloat(userAccount.guaranteeOperation) - parseFloat(amount) < 0) {
            throw new Error(NO_MONEY_ERROR_MESSAGE)
          }
        }

        if (parseFloat(amountAvailable) - parseFloat(amount) < 0) {
          throw new Error(NO_MONEY_ERROR_MESSAGE)
        }

        const wireTransferRequest = await WireTransferRequest.create({
          currencyType: req.body.currencyType,
          accountRCM: req.body.accountRCM,
          amount,
          amountBK: req.body.amount,
          commissionsCharge: Number(req.body.commissionsCharge),
          commissionsReferenceDetail: req.body.commissionsReferenceDetail,

          beneficiaryPersonAccountNumber: req.body.beneficiaryPersonAccountNumber,
          beneficiaryPersonFirstName: req.body.beneficiaryPersonFirstName,
          beneficiaryPersonLastName: req.body.beneficiaryPersonLastName,
          beneficiaryPersonAddress: req.body.beneficiaryPersonAddress,

          beneficiaryBankName: req.body.beneficiaryBankName,
          beneficiaryPersonID: req.body.beneficiaryPersonID,
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
          createdAt: !!req.body.createdAt
            ? moment(new Date(req.body.createdAt)).tz('America/New_York').format()
            : moment(new Date()).tz('America/New_York').format(),
          updatedAt: moment(new Date()).tz('America/New_York').format(),
        })

        const userAccountSnapShot = JSON.stringify(userAccount)

        const wireTransferAmountReq = req.body.amount === 0 ? '0' : `${req.body.amount}`
        const currentGuaranteeOperationNet = userAccount.guaranteeOperationNet
          ? userAccount.guaranteeOperationNet
          : 0
        const currentWireTransferAmount = userAccount.wireTransferAmount
          ? userAccount.wireTransferAmount
          : 0
        const updatedUserAccount = await userAccount.update(
          {
            guaranteeOperationNet:
              parseFloat(userAccount.guaranteeOperation) -
              parseFloat(wireTransferAmountReq.replace(',', '')) +
              parseFloat(currentGuaranteeOperationNet),
            wireTransferAmount:
              parseFloat(wireTransferAmountReq.replace(',', '')) +
              parseFloat(currentWireTransferAmount),
          },
          { transaction: t }
        )

        Log({
          userId,
          userAccountId: userAccount.id,
          tableUpdated: 'userAccount',
          action: 'create',
          type: 'wire-transfer',
          snapShotBeforeAction: userAccountSnapShot,
          snapShotAfterAction: JSON.stringify(updatedUserAccount),
        })

        return res.status(200).send(wireTransferRequest)
      })
    } catch (err) {
      console.log('[=====  ERR  =====>')
      console.log(err)
      console.log('<=====  /ERR  =====]')
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async list(req, res) {
    try {
      const wireTransferRequests = await WireTransferRequest.findAll(
        wireTransferRequestQuery.list({ req, UserAccount, User })
      )

      if (!wireTransferRequests) {
        return res.status(404).send({
          message: '404 on WireTransferRequest get List',
        })
      }
      return res.status(200).send(wireTransferRequests)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async get(req, res) {
    try {
      const wireTransferRequest = await WireTransferRequest.findByPk(req.params.id)

      if (!wireTransferRequest) {
        return res.status(404).send({
          message: '404 on WireTransferRequest get',
        })
      }

      return res.status(200).send(wireTransferRequest)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async getByUsername(req, res) {
    try {
      const wireTransferRequest = await WireTransferRequest.findAll(
        wireTransferRequestQuery.listByUsername({ req, sequelize })
      )

      if (!wireTransferRequest) {
        return res.status(404).send({
          message: '404 on WireTransferRequest get',
        })
      }

      return res.status(200).send(wireTransferRequest)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async update(req, res) {
    const userId = _.get(req, 'user.id', 0)
    const wireTransferRequest = await WireTransferRequest.findByPk(req.params.id)

    if (!wireTransferRequest) {
      return res.status(404).send({
        message: '404 on WireTransferRequest update',
      })
    }

    const wireTransferRequestSnapShot = JSON.stringify(wireTransferRequest)

    try {
      await ORM.transaction(async (t) => {
        let closedAt
        if (req.body.status === 4 && !wireTransferRequest.closedAt) {
          closedAt = moment(new Date()).tz('America/New_York').format()
        } else {
          closedAt = !!req.body.closedAt
            ? moment(req.body.closedAt).tz('America/New_York').format()
            : wireTransferRequest.closedAt
        }

        const updatedWireTransferRequest = await wireTransferRequest.update(
          {
            currencyType: req.body.currencyType || wireTransferRequest.currencyType,
            accountRCM: req.body.accountRCM || wireTransferRequest.accountRCM,
            amount: req.body.amount
              ? Number(req.body.amount.replace(',', ''))
              : wireTransferRequest.amount,
            commissionsCharge: req.body.commissionsCharge
              ? Number(req.body.commissionsCharge)
              : wireTransferRequest.commissionsCharge,
            commissionsReferenceDetail:
              req.body.commissionsReferenceDetail || wireTransferRequest.commissionsReferenceDetail,
            beneficiaryPersonAccountNumber:
              req.body.beneficiaryPersonAccountNumber ||
              wireTransferRequest.beneficiaryPersonAccountNumber,
            beneficiaryPersonID:
              req.body.beneficiaryPersonID || wireTransferRequest.beneficiaryPersonID,
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
            updatedAt: moment(new Date()).tz('America/New_York').format(),
            createdAt: !!req.body.createdAt
              ? moment(req.body.createdAt).tz('America/New_York').format()
              : wireTransferRequest.createdAt,
            closedAt,
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

          const hasActiveWireTransfer = await WireTransferRequest.findAll({
            where: {
              username: wireTransferRequest.username,
              status: 1,
            },
          })

          if (hasActiveWireTransfer.length > 1) {
            await userAccount.update(
              {
                guaranteeOperationNet:
                  Number(userAccount.guaranteeOperationNet) - Number(wireTransferRequest.amount),
                wireTransferAmount:
                  Number(userAccount.wireTransferAmount) - Number(wireTransferRequest.amount),
              },
              { transaction: t }
            )
          } else {
            await userAccount.update(
              {
                guaranteeOperationNet: 0.0,
                wireTransferAmount: 0.0,
              },
              { transaction: t }
            )
          }

          Log({
            userId,
            userAccountId: userAccount.id,
            tableUpdated: 'userAccount',
            action: 'update',
            type: 'wire-transfer',
            snapShotBeforeAction: wireTransferRequestSnapShot,
            snapShotAfterAction: JSON.stringify(updatedWireTransferRequest),
          })
        }

        return res.status(200).send(updatedWireTransferRequest)
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async delete(req, res) {
    try {
      const wireTransferRequest = await WireTransferRequest.findByPk(req.params.id)

      if (!wireTransferRequest) {
        return res.status(404).send({
          message: 'WireTransferRequest Not Found',
        })
      }

      await wireTransferRequest.update({
        status: 0,
      })

      return res.status(200).send({
        message: 'WireTransferRequest has been deleted',
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async check(req, res) {
    try {
      const wireTransferRequests = await WireTransferRequest.findAll({
        where: {
          status: 1,
        },
      })

      if (!wireTransferRequests) {
        return res.status(404).send({
          message: '404 on WireTransferRequest get List',
        })
      }
      let ids = []

      wireTransferRequests.map((el) => ids.push(el.userAccountId))

      await UserAccount.update(
        {
          wireTransferAmount: 0,
        },
        {
          where: {
            id: ids,
          },
        }
      )

      let diff = []

      for (let wt of wireTransferRequests) {
        const { userAccountId, amount } = wt
        const userAccount = await UserAccount.findByPk(userAccountId)

        if (userAccount.wireTransferAmount != amount) {
          diff.push(userAccount.id)

          const wtAmount =
            userAccount.wireTransferAmount == 'NaN' ? 0 : userAccount.wireTransferAmount

          await userAccount.update({
            wireTransferAmount: Number(wtAmount) + Number(amount),
          })
        }
      }

      for (let wt of wireTransferRequests) {
        const { userAccountId } = wt
        const userAccount = await UserAccount.findByPk(userAccountId)

        await userAccount.update({
          guaranteeOperationNet:
            Number(userAccount.guaranteeOperation) - Number(userAccount.wireTransferAmount),
        })
      }

      return res.status(200).send(diff)
    } catch (err) {
      console.log('[=====  ERR  =====>')
      console.log(err)
      console.log('<=====  /ERR  =====]')
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },
}
