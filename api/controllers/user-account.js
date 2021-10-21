import {
  User,
  Account,
  UserAccount,
  Role,
  MarketOperation,
  MarketMovement,
  Product,
  Broker,
  Commodity,
  AssetClass,
  sequelize,
  UserAccountMovement,
  WireTransferRequest,
  ORM,
} from '../models'
import { userAccountQuery } from '../queries'
import Log from '../../common/log'

import _ from 'lodash'

function getAccountTypeFromAmount(accountAmountValue) {
  const accountValue = Number(accountAmountValue)

  switch (true) {
    case accountValue < 5000:
      return 1 // Miro
    case accountValue >= 5000 && accountValue < 50000:
      return 2 // Classic
    case accountValue >= 50000:
      return 3 // Gold
  }
}

module.exports = {
  async create(req, res) {
    try {
      const userAccount = await UserAccount.create({
        userId: req.body.user.id,
        accountId: req.body.account.id,
        accountValue: req.body.accountValue,
        brokerId: req.body.broker.id,
        guaranteeOperation: req.body.guaranteeOperation,
        guaranteeCredits: req.body.guaranteeCredits,
        balanceInitial: req.body.balanceInitial,
        balanceFinal: req.body.balanceFinal,
        maintenanceMargin: req.body.maintenanceMargin,
        commissionByReference: req.body.commissionByReference,
        status: 1,
        createdAt: new Date(),
        marginUsed: _.get(req, 'body.marginUsed', 0),
      })

      return res.status(200).send(userAccount)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async list(req, res) {
    try {
      const userAccounts = await UserAccount.findAll(
        userAccountQuery.list({ req, sequelize, User, Account, MarketOperation, Product, Broker })
      )

      if (!userAccounts) {
        return res.status(404).send({
          message: '404 on UserAccount get List',
        })
      }

      return res.status(200).send(userAccounts)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async getListReport(req, res) {
    try {
      const userAccounts = await UserAccount.findAll(
        userAccountQuery.accountsReport({
          req,
          sequelize,
          User,
          Account,
          MarketOperation,
          Product,
          Broker,
        })
      )

      if (!userAccounts) {
        return res.status(404).send({
          message: '404 on UserAccount get List',
        })
      }

      return res.status(200).send(userAccounts)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async fix(req, res) {
    const ids = [224, 704]
    try {
      await ORM.transaction(async (t) => {
        for (const userAccountId of ids) {
          const sum = await WireTransferRequest.findAll(
            {
              where: {
                userAccountId,
                status: 1,
                associatedOperation: 1,
              },
              attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'total']],
              raw: true,
            },
            { transaction: t }
          )

          const total = Number(sum[0].total)

          const userAccount = await UserAccount.findOne(
            {
              where: {
                id: userAccountId,
              },
            },
            { transaction: t }
          )

          if (!userAccount) {
            return res.status(404).send({
              message: '404 on UserAccount update',
            })
          }

          const guaranteeOperation = userAccount.guaranteeOperation

          await userAccount.update(
            {
              guaranteeOperationNet: Number(guaranteeOperation) - Number(total),
              wireTransferAmount: Number(total),
            },
            { transaction: t }
          )
        }

        return res.status(200).send('DONE')
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async get(req, res) {
    try {
      const userAccount = await UserAccount.findByPk(req.params.id)

      if (!userAccount) {
        return res.status(404).send({
          message: '404 on UserAccount get',
        })
      }

      return res.status(200).send(userAccount)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async getReport(req, res) {
    try {
      const userAccountSoldOperations = await MarketOperation.findAll(
        userAccountQuery.accountReport({
          req,
          User,
          Account,
          UserAccount,
          MarketMovement,
          Product,
          Broker,
          Commodity,
          AssetClass,
          sequelize,
        })
      )

      if (!userAccountSoldOperations) {
        return res.status(404).send({
          message: 'No se encontraron Operaciones Vendidas para la cuenta indicada',
        })
      }

      return res.status(200).send(userAccountSoldOperations)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async getByUser(req, res) {
    try {
      const userAccount = await UserAccount.findAll(
        userAccountQuery.getByUser({
          req,
          User,
          Role,
          Account,
          Broker,
          UserAccountMovement,
          UserAccount,
        })
      )

      if (!userAccount) {
        return res.status(404).send({
          message: '404 on UserAccount get',
        })
      }

      return res.status(200).send(userAccount)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async update(req, res) {
    try {
      const userId = _.get(req, 'user.id', 0)
      const userAccount = await UserAccount.findByPk(req.params.id)

      const otcAccountsIds = await Account.findAll({
        where: {
          status: 1,
          associatedOperation: 1,
          name: ['Micro', 'Classic', 'Gold'],
        },
        attributes: ['id'],
        raw: true,
      })

      if (!userAccount) {
        return res.status(404).send({
          message: '404 on UserAccount update',
        })
      }

      const userAccountSnapShot = JSON.stringify(userAccount)

      const accountId = _.get(req, 'body.account.id', userAccount.accountId)
      const accountValue = req.body.accountValue || userAccount.accountValue

      const accountShouldByValidated = otcAccountsIds.some(({ id }) => id == accountId)

      const updatedUserAccount = await userAccount.update({
        userId: _.get(req, 'body.user.id', userAccount.userId),
        //accountId: accountShouldByValidated ? getAccountTypeFromAmount(accountValue) : accountId,
        brokerId: _.get(req, 'body.broker.id', userAccount.brokerId),
        accountId,
        accountValue,
        guaranteeOperation: req.body.guaranteeOperation || userAccount.guaranteeOperation,
        guaranteeCredits: req.body.guaranteeCredits || userAccount.guaranteeCredits,
        balanceInitial: req.body.balanceInitial || userAccount.balanceInitial,
        balanceFinal: req.body.balanceFinal || userAccount.balanceFinal,
        maintenanceMargin: req.body.maintenanceMargin || userAccount.maintenanceMargin,
        commissionByReference: req.body.commissionByReference || userAccount.commissionByReference,
        status: req.body.status || userAccount.status,
        updatedAt: new Date(),
        marginUsed: req.body.marginUsed || userAccount.marginUsed,
        guaranteeOperationNet: req.body.guaranteeOperationNet || userAccount.guaranteeOperationNet,
        wireTransferAmount: req.body.wireTransferAmount || userAccount.wireTransferAmount,
      })

      Log({
        userId,
        userAccountId: userAccount.id,
        tableUpdated: 'userAccount',
        action: 'update',
        type: 'update',
        snapShotBeforeAction: userAccountSnapShot,
        snapShotAfterAction: JSON.stringify(updatedUserAccount),
      })

      return res.status(200).send(updatedUserAccount)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async delete(req, res) {
    try {
      const userId = _.get(req, 'user.id', 0)
      const userAccount = await UserAccount.findByPk(req.params.id)

      if (!userAccount) {
        return res.status(404).send({
          message: 'UserAccount Not Found',
        })
      }

      Log({ userId, action: 'update', type: 'delete' })

      await userAccount.update({
        status: 0,
      })

      return res.status(200).send({
        message: 'UserAccount has been deleted',
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },
}
