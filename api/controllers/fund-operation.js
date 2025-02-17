import _ from 'lodash'
import moment from 'moment-timezone'
import Log, {
  FundOperation,
  UserAccount,
  FundMovement,
  ORM,
  Product,
  User,
  Account,
  Broker,
  Commodity,
  AssetClass,
  MarketOperation,
  MarketMovement,
} from '../models'
import { fundOperationQuery } from '../queries'

module.exports = {
  async create(req, res) {
    try {
      await ORM.transaction(async (t) => {
        const fundOperation = await FundOperation.create(
          {
            operationType: req.body.productName,
            productId: req.body.productId,
            userAccountId: _.get(req, 'body.userAccount.id', 0),
            amount: req.body.amount,
            initialAmount: req.body.amount,
            status: _.get(req, 'body.status', 1),
            startDate: req.body.startDate,
            createdAt: moment(new Date()).tz('America/New_York').format(),
            updatedAt: moment(new Date()).tz('America/New_York').format(),
            expirationDate: req.body.expirationDate
              ? moment(req.body.expirationDate).tz('America/New_York').format()
              : null,
          },
          { transaction: t }
        )

        // await FundMovement.create(
        //   {
        //     gpInversion: req.body.amount,
        //     fundOperationId: Number(fundOperation.id),
        //     gpAmount: 0,
        //     status: _.get(req, 'body.status', 1),
        //     createdAt: moment(new Date()).tz('America/New_York').format(),
        //     updatedAt: moment(new Date()).tz('America/New_York').format(),
        //   },
        //   { transaction: t }
        // )
        return res.status(200).send(fundOperation)
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async list(req, res) {
    try {
      const fundOperation = await FundOperation.findAll(
        fundOperationQuery.list({ UserAccount, Product })
      )

      if (!fundOperation) {
        return res.status(404).send({
          message: '404 on FundOperation get List',
        })
      }
      return res.status(200).send(fundOperation)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async get(req, res) {
    try {
      const fundOperation = await FundOperation.findByPk(
        req.params.id,
        fundOperationQuery.get({
          req,
          UserAccount,
          Product,
        })
      )

      if (!fundOperation) {
        return res.status(404).send({
          message: '404 on FundOperation get',
        })
      }

      return res.status(200).send(fundOperation)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async update(req, res) {
    try {
      const fundOperation = await FundOperation.findByPk(req.params.id)

      if (!fundOperation) {
        return res.status(404).send({
          message: '404 on FundOperation update',
        })
      }
      const updatedFundOperation = await fundOperation.update({
        operationType: req.body.productName || fundOperation.productName,
        productId: req.body.productId || fundOperation.productId,
        userAccountId: _.get(req, 'body.userAccount.id', 0) || fundOperation.userAccountId,
        amount: req.body.amount || fundOperation.amount,
        initialAmount: req.body.initialAmount || fundOperation.initialAmount,
        status: req.body.status || fundOperation.status,
        startDate:
          moment(req.body.startDate).tz('America/New_York').format() || fundOperation.startDate,
        expirationDate:
          req.body.expirationDate && req.body.expirationDate !== 'Fecha inválida'
            ? moment(req.body.expirationDate).tz('America/New_York').format()
            : null,
        updatedAt: moment().tz('America/New_York').format(),
      })

      return res.status(200).send(updatedFundOperation)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async bulkUpdate(req, res) {
    const userId = _.get(req, 'user.id', 0)
    try {
      const { operationsIds, updateType, updateValue, updateScope, updateDate } = req.body

      const percentage = Number(updateValue)

      await ORM.transaction(async (t) => {
        switch (updateScope) {
          case 'percentage':
            const fundOperations = await FundOperation.findAll(
              {
                where: {
                  id: operationsIds,
                },
                order: [['id', 'ASC']],
              },
              { transaction: t }
            )

            if (!fundOperations) {
              throw new Error('Ocurrió un error al momento de buscar la operación')
            }

            for (let fundOperation of fundOperations) {
              const operationAmount = Number(_.get(fundOperation, 'amount', 0))
              const gpAmount = Number(parseFloat((operationAmount * percentage) / 100).toFixed(2))

              const gpInversion = operationAmount + gpAmount

              await FundMovement.create(
                {
                  gpInversion,
                  fundOperationId: Number(fundOperation.id),
                  gpAmount,
                  percentage,
                  status: 1,
                  createdAt: updateDate
                    ? moment(updateDate).tz('America/New_York').format()
                    : moment(new Date()).tz('America/New_York').format(),
                  updatedAt: moment(new Date()).tz('America/New_York').format(),
                },
                { transaction: t }
              )

              await fundOperation.update(
                {
                  amount: gpInversion,
                },
                { transaction: t }
              )
            }

            // Log({
            //   userId,
            //   userAccountId: userAccount.id,
            //   tableUpdated: 'userAccount',
            //   action: 'update',
            //   type: 'createOperation',
            //   snapShotBeforeAction: snapShotAccount,
            //   snapShotAfterAction: JSON.stringify(updatedUserAccount),
            // })
            return res.status(200).send('Completed')

          default:
        }
        return res.status(200).send('Completed')
      })
    } catch (err) {
      console.log('[=====  ERROR on BULK  =====>')
      console.log(err)
      console.log('<=====  /ERROR on BULK  =====]')
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async delete(req, res) {
    try {
      const fundOperation = await FundOperation.findByPk(req.params.id)

      if (!fundOperation) {
        return res.status(404).send({
          message: 'FundOperation Not Found',
        })
      }

      await fundOperation.update({
        status: 0,
      })

      return res.status(200).send({
        message: 'FundOperation has been deleted',
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },
}
