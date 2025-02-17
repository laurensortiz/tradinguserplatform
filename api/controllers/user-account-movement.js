import _ from 'lodash'
import { UserAccount, UserAccountMovement, ORM, Account } from '../models'
import { userAccountMovementQuery, userQuery } from '../queries'
import moment from 'moment-timezone'
import ToFixNumber from '../../common/to-fix-number'
import Log from '../../common/log'

module.exports = {
  async create(req, res) {
    try {
      const userId = _.get(req, 'user.id', 0)
      await ORM.transaction(async (t) => {
        const userAccount = await UserAccount.findOne(
          {
            where: {
              id: Number(req.body.userAccountId),
            },
            include: [
              {
                model: Account,
                as: 'account',
                attributes: ['associatedOperation'],
              },
            ],
          },
          { transaction: t }
        )

        if (!userAccount) {
          return res.status(404).send({
            message: '404 on UserAccount update',
          })
        }

        const snapShotAccount = JSON.stringify(userAccount)

        let accountValue = Number(req.body.accountValue || 0.0)
        let guaranteeOperation = Number(userAccount.guaranteeOperation)
        const debit = Number(req.body.debit || 0.0)
        const credit = Number(req.body.credit || 0.0)
        let previousAccountValue = Number(req.body.previousAccountValue || 0.0)

        if (userAccount.account.associatedOperation !== 2) {
          previousAccountValue = userAccount.accountValue
          accountValue = Number(userAccount.accountValue || 0.0)
          if (credit > 0) {
            accountValue = ToFixNumber(accountValue + credit)
            guaranteeOperation = ToFixNumber(guaranteeOperation + credit)
          } else if (debit > 0) {
            accountValue = ToFixNumber(accountValue - debit)
            guaranteeOperation = ToFixNumber(guaranteeOperation - debit)
          } else {
            return res.status(404).send({
              message: 'Movimiento inválido',
            })
          }
        }

        const isFirstMovement =
          req.body.isFirstMovement && parseInt(previousAccountValue) === 0
            ? {
                balanceInitial: accountValue,
              }
            : null

        const userAccountMovement = await UserAccountMovement.create(
          {
            userAccountId: Number(req.body.userAccountId),
            debit,
            credit,
            accountValue,
            previousAccountValue,
            reference: req.body.reference || '',
            status: _.get(req, 'body.status', 1),
            createdAt: moment(req.body.createdAt || new Date())
              .tz('America/New_York')
              .format(),
            updatedAt: moment(new Date()).tz('America/New_York').format(),
          },
          { transaction: t }
        )

        if (userAccount.account.associatedOperation !== 2) {
          const updatedUserAccount = await userAccount.update(
            {
              accountValue,
              guaranteeOperation,
              updatedAt: moment(new Date()).tz('America/New_York').format(),
              ...isFirstMovement,
            },
            { transaction: t }
          )
          Log({
            userId,
            userAccountId: req.body.userAccountId,
            tableUpdated: 'userAccount',
            action: 'update',
            type: 'update | movement',
            snapShotBeforeAction: snapShotAccount,
            snapShotAfterAction: JSON.stringify(updatedUserAccount),
          })
        }

        return res.status(200).send(userAccountMovement)
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async list(req, res) {
    const userAccountMovement = await UserAccountMovement.findAll(
      userAccountMovementQuery.list({ req })
    )

    if (!userAccountMovement) {
      return res.status(404).send({
        message: '404 on UserAccountMovement get List',
      })
    }
    return res.status(200).send(userAccountMovement)
  },

  async get(req, res) {
    const userAccountMovement = await UserAccountMovement.findByPk(req.params.id)

    if (!userAccountMovement) {
      return res.status(404).send({
        message: '404 on UserAccountMovement get',
      })
    }

    return res.status(200).send(userAccountMovement)
  },

  async getLastMovement(userAccountId) {
    return UserAccountMovement.findAll({
      where: {
        userAccountId,
      },
      limit: 1,
      order: [['createdAt', 'DESC']],
      silence: true,
    })
  },

  async update(req, res) {
    const userId = _.get(req, 'user.id', 0)
    try {
      await ORM.transaction(async (t) => {
        const userAccountMovement = await UserAccountMovement.findByPk(req.params.id)

        if (!userAccountMovement) {
          return res.status(404).send({
            message: '404 on UserAccountMovement update',
          })
        }

        const userAccount = await UserAccount.findOne(
          {
            where: {
              id: Number(userAccountMovement.userAccountId),
            },
            include: [
              {
                model: Account,
                as: 'account',
                attributes: ['associatedOperation'],
              },
            ],
          },
          { transaction: t }
        )

        if (!userAccount) {
          return res.status(404).send({
            message: '404 on UserAccount update',
          })
        }

        const snapShotAccount = JSON.stringify(userAccount)

        let accountValue = Number(userAccount.accountValue || 0)
        let guaranteeOperation = Number(userAccount.guaranteeOperation || 0)
        const debit = Number(req.body.debit) || 0
        const credit = Number(req.body.credit) || 0
        const isDebitOrCreditChange =
          Number(req.body.debit) !== Number(userAccountMovement.debit) ||
          Number(req.body.credit) !== Number(userAccountMovement.credit)

        if (userAccount.account.associatedOperation !== 2 && isDebitOrCreditChange) {
          if (credit > 0) {
            accountValue = Number(accountValue - Number(userAccountMovement.credit || 0) + credit)
            guaranteeOperation = Number(
              guaranteeOperation - Number(userAccountMovement.credit || 0) + credit
            )
          } else if (debit > 0) {
            accountValue = Number(accountValue + Number(userAccountMovement.debit || 0) - debit)
            guaranteeOperation = Number(
              guaranteeOperation + Number(userAccountMovement.debit || 0) - debit
            )
          } else {
            return res.status(404).send({
              message: 'Movimiento inválido',
            })
          }
        }

        await userAccountMovement.update(
          {
            debit,
            credit,
            accountValue: isDebitOrCreditChange
              ? userAccountMovement.accountValue
              : req.body.accountValue,
            reference: req.body.reference || userAccountMovement.reference,
            previousAccountValue:
              req.body.previousAccountValue || userAccountMovement.previousAccountValue,
            status: _.get(req, 'body.status', 1),
            createdAt: req.body.createdAt || userAccountMovement.createdAt,
            updatedAt: new Date(),
          },
          { transaction: t }
        )

        if (userAccount.account.associatedOperation !== 2 && isDebitOrCreditChange) {
          const updatedUserAccount = await userAccount.update(
            {
              accountValue,
              guaranteeOperation,
              updatedAt: moment(new Date()).tz('America/New_York').format(),
            },
            { transaction: t }
          )

          Log({
            userId,
            userAccountId: userAccountMovement.userAccountId,
            tableUpdated: 'userAccount',
            action: 'create',
            type: 'create | movement',
            snapShotBeforeAction: snapShotAccount,
            snapShotAfterAction: JSON.stringify(updatedUserAccount),
          })
        }
      })
      return res.status(200).send('updated')
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async delete(req, res) {
    const userId = _.get(req, 'user.id', 0)

    try {
      await ORM.transaction(async (t) => {
        const userAccountMovement = await UserAccountMovement.findByPk(req.params.id)

        if (!userAccountMovement) {
          return res.status(404).send({
            message: 'UserAccountMovement Not Found',
          })
        }

        const userAccount = await UserAccount.findOne({
          where: {
            id: Number(userAccountMovement.userAccountId),
          },
        })

        if (!userAccount) {
          return res.status(404).send({
            message: '404 on UserAccount update',
          })
        }

        const snapShotAccount = JSON.stringify(userAccount)

        let accountValue = Number(userAccount.accountValue)
        let guaranteeOperation = Number(userAccount.guaranteeOperation)

        accountValue = ToFixNumber(
          accountValue - Number(userAccountMovement.credit) + Number(userAccountMovement.debit)
        )
        guaranteeOperation = ToFixNumber(
          guaranteeOperation -
            Number(userAccountMovement.credit) +
            Number(userAccountMovement.debit)
        )

        const updatedUserAccount = await userAccount.update(
          {
            accountValue,
            guaranteeOperation,
            updatedAt: moment(new Date()).tz('America/New_York').format(),
          },
          { transaction: t }
        )

        await userAccountMovement.destroy()

        Log({
          userId,
          userAccountId: userAccountMovement.userAccountId,
          tableUpdated: 'userAccount',
          action: 'update',
          type: 'update',
          snapShotBeforeAction: snapShotAccount,
          snapShotAfterAction: JSON.stringify(updatedUserAccount),
        })

        return res.status(200).send({
          message: 'Movimiento de la cuenta eliminado exitosamente',
        })
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },
}
