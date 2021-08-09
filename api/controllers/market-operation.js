import _ from 'lodash'
import {
  MarketOperation,
  UserAccount,
  User,
  Account,
  MarketMovement,
  Product,
  Broker,
  Commodity,
  AssetClass,
  ORM,
  sequelize,
} from '../models'

import { marketOperationQuery } from '../queries'
import moment from 'moment-timezone'
import Log from '../../common/log'
import ToFixNumber from '../../common/to-fix-number'
import GetHoldCommissionAmount from '../../common/get-hold-commission-amount'

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)

  return { totalItems, rows, totalPages, currentPage }
}

const getPagination = (page, size) => {
  const limit = size ? +size : 10
  const offset = page ? page * limit : 0

  return { limit, offset }
}

module.exports = {
  async create(req, res) {
    const userId = _.get(req, 'user.id', 0)
    try {
      await ORM.transaction(async (t) => {
        const userAccount = await UserAccount.findOne(
          {
            where: {
              id: _.get(req, 'body.userAccount.id', 0),
            },
          },
          { transaction: t }
        )

        if (!userAccount) {
          throw new Error('Ocurrió un error al momento de buscar la cuenta del usuario')
        }

        const lastMarketOperationEntry = await MarketOperation.findAll({
          limit: 1,
          attributes: ['orderId'],
          order: [['id', 'DESC']],
        })

        const orderId = Number(lastMarketOperationEntry[0].orderId) + 1

        const snapShotAccount = JSON.stringify(userAccount)

        const marketOperation = await MarketOperation.create(
          {
            longShort: req.body.longShort,
            userAccountId: _.get(req, 'body.userAccount.id', 0),
            brokerId: _.get(req, 'body.broker.id', 0),
            productId: _.get(req, 'body.product.id', 0),
            commoditiesTotal: req.body.commoditiesTotal,
            commodityId: _.get(req, 'body.commodity.id', 1),
            assetClassId: _.get(req, 'body.assetClass.id', 1),
            buyPrice: req.body.buyPrice,
            takingProfit: req.body.takingProfit,
            stopLost: req.body.stopLost,
            maintenanceMargin: req.body.maintenanceMargin,
            amount: req.body.amount,
            initialAmount: req.body.amount,
            behavior: 0,
            holdStatusCommission: req.body.holdStatusCommission || 0,
            orderId,
            status: _.get(req, 'body.status', 1),
            createdAt: moment(req.body.createdAt || new Date())
              .tz('America/New_York')
              .format(),
            updatedAt: moment(new Date()).tz('America/New_York').format(),
          },
          { transaction: t }
        )

        // await MarketMovement.create(
        //   {
        //     gpInversion: req.body.amount,
        //     marketOperationId: Number(marketOperation.id),
        //     gpAmount: 0,
        //     marketPrice: 0,
        //     status: _.get(req, 'body.status', 1),
        //     createdAt: moment(req.body.createdAt || new Date())
        //       .tz('America/New_York')
        //       .format(),
        //     updatedAt: moment(new Date()).tz('America/New_York').format(),
        //   },
        //   { transaction: t }
        // )

        const marginOperation = ToFixNumber(
          (Number(req.body.maintenanceMargin) + Number(req.body.amount)) * 0.1
        )
        const guaranteeOperation = ToFixNumber(
          Number(userAccount.guaranteeOperation) -
            (Number(req.body.maintenanceMargin) + Number(req.body.amount) + marginOperation)
        )

        const updatedUserAccount = await userAccount.update(
          {
            guaranteeOperation,
            marginUsed: ToFixNumber(Number(userAccount.marginUsed || 0) + marginOperation), // Margen Utilizado 10%
            updatedAt: moment(new Date()).tz('America/New_York').format(),
          },
          { transaction: t }
        )

        Log({
          userId,
          userAccountId: userAccount.id,
          tableUpdated: 'userAccount',
          action: 'update',
          type: 'createOperation',
          snapShotBeforeAction: snapShotAccount,
          snapShotAfterAction: JSON.stringify(updatedUserAccount),
        })

        return res.status(200).send(marketOperation)
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async list(req, res) {
    //TODO: All these logic should be refactored
    const userRoleId = _.get(req, 'user.roleId', 0)
    const isAdmin = userRoleId === 1

    let adminResponse
    try {
      let marketOperation
      if (isAdmin) {
        const { current, pageSize } = req.query.pagination
        const { limit, offset } = getPagination(current, pageSize)

        marketOperation = await MarketOperation.findAndCountAll(
          marketOperationQuery.list({
            req,
            limit,
            offset,
            sequelize,
            UserAccount,
            User,
            Product,
            Broker,
            AssetClass,
            Commodity,
          })
        )

        adminResponse = getPagingData(marketOperation, current, limit)
      } else {
        marketOperation = await MarketOperation.findAndCountAll(
          marketOperationQuery.list({
            req,
            sequelize,
            UserAccount,
            User,
            Product,
            Broker,
            AssetClass,
            Commodity,
          })
        )
      }

      if (!marketOperation) {
        return res.status(404).send({
          message: '404 on MarketOperation get List',
        })
      }

      const response = isAdmin ? adminResponse : marketOperation.rows

      return res.status(200).send(response)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async accountReport(req, res) {
    try {
      const marketOperation = await MarketOperation.findAll(
        marketOperationQuery.accountReport({
          req,
          sequelize,
          UserAccount,
          User,
          Account,
          Product,
          Broker,
          Commodity,
          AssetClass,
        })
      )

      if (!marketOperation) {
        return res.status(404).send({
          message: '404 on MarketOperation get List',
        })
      }
      return res.status(200).send(marketOperation)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async get(req, res) {
    try {
      const marketOperation = await MarketOperation.findByPk(
        req.params.id,
        marketOperationQuery.get({
          req,
          UserAccount,
          User,
          Account,
          Product,
          Broker,
          Commodity,
          AssetClass,
        })
      )

      if (!marketOperation) {
        return res.status(404).send({
          message: '404 on MarketOperation get',
        })
      }

      return res.status(200).send(marketOperation)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async update(req, res) {
    const userId = _.get(req, 'user.id', 0)
    await ORM.transaction(async (t) => {
      const marketOperation = await MarketOperation.findOne(
        {
          where: {
            id: req.params.id,
          },
          include: [
            {
              model: UserAccount,
              as: 'userAccount',
              include: [
                {
                  model: Account,
                  as: 'account',
                  attributes: ['name', 'percentage', 'associatedOperation'],
                },
              ],
            },
          ],
          silence: true,
        },
        { transaction: t }
      )

      if (!marketOperation) {
        return res.status(404).send({
          message: '404 on MarketOperation update',
        })
      }

      const marketOperationSnapShot = JSON.stringify(marketOperation)

      if (marketOperation.status === 4 && _.isNil(req.body.endDate)) {
        return res.status(401).send({
          message:
            'Esta operación ya se encuentra cerrada. Sólo es permitido cambiar la fecha de cierre',
        })
      }

      if (marketOperation.status === 4 && !_.isNil(req.body.endDate)) {
        try {
          await marketOperation.update(
            {
              updatedAt: moment(new Date()).tz('America/New_York').format(),
              endDate: !_.isNil(req.body.endDate)
                ? moment(req.body.endDate).tz('America/New_York').format()
                : marketOperation.endDate,
            },
            { transaction: t }
          )
          return res.status(200).send(marketOperation)
        } catch (e) {
          return res.status(500).send(e)
        }
      }

      try {
        await marketOperation.update(
          {
            longShort: req.body.longShort || marketOperation.longShort,
            userAccountId: req.body.userAccount.id || marketOperation.userAccountId,
            brokerId: req.body.broker.id || marketOperation.brokerId,
            productId: req.body.product.id || marketOperation.productId,
            commoditiesTotal: req.body.commoditiesTotal || marketOperation.commoditiesTotal,
            commodityId: req.body.commodity.id || marketOperation.commodityId,
            assetClassId: req.body.assetClass.id || marketOperation.assetClassId,
            buyPrice: req.body.buyPrice || marketOperation.buyPrice,
            takingProfit: req.body.takingProfit || marketOperation.takingProfit,
            stopLost: req.body.stopLost || marketOperation.stopLost,
            maintenanceMargin: req.body.maintenanceMargin || marketOperation.maintenanceMargin,
            amount: req.body.amount || marketOperation.amount,
            initialAmount: req.body.initialAmount || marketOperation.initialAmount,
            orderId: req.body.orderId || marketOperation.orderId,
            status: _.get(req, 'body.status', 1) || marketOperation.status,
            holdStatusCommission:
              req.body.holdStatusCommission || marketOperation.holdStatusCommission,
            createdAt: !_.isNil(req.body.createdAt)
              ? moment(req.body.createdAt).tz('America/New_York').format()
              : marketOperation.createdAt,
            updatedAt: moment(new Date()).tz('America/New_York').format(),
          },
          { transaction: t }
        )

        if (marketOperation.status === 4) {
          const userAccount = await UserAccount.findOne(
            {
              where: {
                id: marketOperation.userAccountId,
              },
            },
            { transaction: t }
          )

          if (!userAccount) {
            throw new Error('Ocurrió un error al momento de buscar la cuenta del usuario')
          }
          const accountValueBeforeEndOperation = `${userAccount.accountValue}`
          const { initialAmount, amount, maintenanceMargin, assetClassId } = marketOperation
          const { percentage } = marketOperation.userAccount.account
          const isBrokerGuarantee =
            userAccount.accountId === 10 ||
            userAccount.accountId === 12 ||
            userAccount.accountId === 17 ||
            userAccount.accountId === 18

          const maintenanceMarginAmount =
            assetClassId === 8 ||
            assetClassId === 7 ||
            assetClassId === 5 ||
            assetClassId === 4 ||
            assetClassId === 3 ||
            assetClassId === 1
              ? 0
              : Number(maintenanceMargin)

          const profit = ToFixNumber(Number(amount) - Number(initialAmount))
          const isProfitPositive = Math.sign(profit) >= 0
          const commission = isProfitPositive
            ? ToFixNumber(Number(((profit * Number(percentage)) / 100).toFixed(2)))
            : 0
          const hold = isProfitPositive && !isBrokerGuarantee ? GetHoldCommissionAmount(profit) : 0
          const endProfit = ToFixNumber(profit - commission - hold)
          // Close Calculations
          const marginUsed = ToFixNumber(
            ((Number(initialAmount) + Number(maintenanceMarginAmount)) * 10) / 100
          )
          const guaranteeOperationProduct = ToFixNumber(
            Number(userAccount.guaranteeOperation) +
              Number(initialAmount) +
              Number(maintenanceMarginAmount) +
              Number(marginUsed) +
              endProfit
          )
          const accountValueEndOperation = ToFixNumber(
            Number(userAccount.accountValue) + Number(endProfit)
          )
          const accountGuaranteeEndOperation = ToFixNumber(
            Number(userAccount.guaranteeOperation) + Number(guaranteeOperationProduct)
          )
          const accountMarginUsedEndOperation = ToFixNumber(
            Number(userAccount.marginUsed) - Number(marginUsed)
          )

          const updatedUserAccount = await userAccount.update(
            {
              accountValue: accountValueEndOperation, // Valor de la Cuenta
              guaranteeOperation: guaranteeOperationProduct, // Garantías diponibles
              marginUsed: accountMarginUsedEndOperation, // Margen Utilizado 10%
              updatedAt: new Date(),
            },
            { transaction: t }
          )

          Log({
            userId,
            userAccountId: userAccount.id,
            tableUpdated: 'userAccount',
            action: 'update',
            type: 'sellOperation',
            snapShotAfterAction: JSON.stringify(updatedUserAccount),
          })

          const updatedMarketOperation = await marketOperation.update(
            {
              profitBrut: profit,
              profitNet: endProfit,
              accountValueEndOperation: accountValueEndOperation,
              guaranteeValueEndOperation: accountGuaranteeEndOperation,
              accountValueBeforeEndOperation,
              commissionValueEndOperation: commission,
              guaranteeOperationValueEndOperation: guaranteeOperationProduct,
              holdStatusCommissionEndOperation: hold,
              endDate: !_.isNil(req.body.endDate)
                ? moment(req.body.endDate).tz('America/New_York').format()
                : marketOperation.endDate,
            },
            { transaction: t }
          )

          Log({
            userId,
            userAccountId: userAccount.id,
            tableUpdated: 'marketOperation',
            action: 'update',
            type: 'sellOperation',
            snapShotBeforeAction: marketOperationSnapShot,
            snapShotAfterAction: JSON.stringify(updatedMarketOperation),
          })
        }

        return res.status(200).send(marketOperation)
      } catch (err) {
        return res.status(500).send({
          message: err.message,
          name: err.name,
        })
      }
    })
  },

  async bulkUpdate(req, res) {
    const userId = _.get(req, 'user.id', 0)
    try {
      const { operationsIds, updateType, updateValue, updateScope } = req.body

      await ORM.transaction(async (t) => {
        switch (updateScope) {
          case 'status':
            if (updateValue === 4) {
              /**
               * Close Operation
               */
              let pivotUserAccountTable = []
              const marketOperations = await MarketOperation.findAll(
                {
                  where: {
                    id: operationsIds,
                  },
                  order: [['id', 'ASC']],
                },
                { transaction: t }
              )

              if (!marketOperations) {
                throw new Error('Ocurrió un error al momento de buscar la operación')
              }

              for (let marketOperation of marketOperations) {
                if (marketOperation.status === 4) {
                  throw new Error(
                    `Una o más operaciones seleccionas ya se encuentran cerradas. [Operación ID= ${marketOperation.id}]`
                  )
                }

                const marketOperationSnapShot = JSON.stringify(marketOperation)

                const userAccountIndex = _.findIndex(pivotUserAccountTable, {
                  id: marketOperation.userAccountId,
                })

                const userAccount =
                  userAccountIndex >= 0
                    ? pivotUserAccountTable[userAccountIndex]
                    : await UserAccount.findOne({
                        where: {
                          id: marketOperation.userAccountId,
                        },
                        include: [
                          {
                            model: Account,
                            as: 'account',
                            attributes: ['percentage'],
                          },
                        ],
                      })

                if (!userAccount) {
                  throw new Error('Ocurrió un error al momento de buscar la cuenta del usuario')
                }

                const accountValueBeforeEndOperation = `${userAccount.accountValue}`

                const { initialAmount, amount, maintenanceMargin, assetClassId } = marketOperation

                const { percentage } = userAccount.account

                const isBrokerGuarantee =
                  userAccount.accountId === 10 ||
                  userAccount.accountId === 12 ||
                  userAccount.accountId === 18 ||
                  userAccount.accountId === 17

                const maintenanceMarginAmount =
                  assetClassId === 8 ||
                  assetClassId === 7 ||
                  assetClassId === 5 ||
                  assetClassId === 4 ||
                  assetClassId === 3 ||
                  assetClassId === 1
                    ? 0
                    : Number(maintenanceMargin)

                const profit = ToFixNumber(Number(amount) - Number(initialAmount))
                const isProfitPositive = Math.sign(profit) >= 0
                const commission = isProfitPositive
                  ? ToFixNumber(Number(((profit * Number(percentage)) / 100).toFixed(2)))
                  : 0
                const hold =
                  isProfitPositive && !isBrokerGuarantee ? GetHoldCommissionAmount(profit) : 0
                const endProfit = ToFixNumber(profit - commission - hold)

                // Close Calculations
                const marginUsed = ToFixNumber(
                  ((Number(initialAmount) + Number(maintenanceMarginAmount)) * 10) / 100
                )
                const guaranteeOperationProduct = ToFixNumber(
                  Number(userAccount.guaranteeOperation) +
                    Number(initialAmount) +
                    Number(maintenanceMarginAmount) +
                    Number(marginUsed) +
                    endProfit
                )
                const accountValueEndOperation = ToFixNumber(
                  Number(userAccount.accountValue) + Number(endProfit)
                )
                const accountGuaranteeEndOperation = ToFixNumber(
                  Number(userAccount.guaranteeOperation) + Number(guaranteeOperationProduct)
                )
                const accountMarginUsedEndOperation = ToFixNumber(
                  Number(userAccount.marginUsed) - Number(marginUsed)
                )

                try {
                  const updatedUserAccount = await userAccount.update(
                    {
                      accountValue: accountValueEndOperation, // Valor de la Cuenta
                      guaranteeOperation: guaranteeOperationProduct, // Garantías diponibles
                      marginUsed: accountMarginUsedEndOperation, // Margen Utilizado 10%
                      updatedAt: new Date(),
                    },
                    { transaction: t }
                  )

                  // Validate pivot table
                  if (userAccountIndex >= 0) {
                    pivotUserAccountTable[userAccountIndex] = updatedUserAccount
                  } else {
                    pivotUserAccountTable.push(updatedUserAccount)
                  }

                  const updatedUserAccountSnapShot = JSON.stringify(updatedUserAccount)

                  Log({
                    userId,
                    userAccountId: userAccount.id,
                    tableUpdated: 'userAccount',
                    action: 'update',
                    type: 'sellOperation',
                    snapShotAfterAction: updatedUserAccountSnapShot.replace('\\', ''),
                  })

                  const updatedMarketOperation = await marketOperation.update(
                    {
                      profitBrut: profit,
                      profitNet: endProfit,
                      accountValueEndOperation: accountValueEndOperation,
                      guaranteeValueEndOperation: accountGuaranteeEndOperation,
                      accountValueBeforeEndOperation,
                      commissionValueEndOperation: commission,
                      guaranteeOperationValueEndOperation: guaranteeOperationProduct,
                      holdStatusCommissionEndOperation: hold,
                      endDate: moment(new Date()).tz('America/New_York').format(),
                      status: 4,
                    },
                    { transaction: t }
                  )

                  Log({
                    userId,
                    userAccountId: userAccount.id,
                    tableUpdated: 'marketOperation',
                    action: 'update',
                    type: 'sellOperation',
                    snapShotBeforeAction: marketOperationSnapShot,
                    snapShotAfterAction: JSON.stringify(updatedMarketOperation),
                  })
                } catch (e) {
                  throw new Error(
                    `Ocurrió un error al momento de actualizar la cuenta del usuario. Error: ${e}`
                  )
                }
              }
              pivotUserAccountTable = []
            } else {
              await MarketOperation.update(
                {
                  [updateType]: updateValue,
                },
                { where: { id: operationsIds } },
                { transaction: t }
              )
            }

            return res.status(200).send('Completed')

          case 'stopLost':
            await MarketOperation.update(
              {
                stopLost: updateValue,
              },
              { where: { id: operationsIds } },
              { transaction: t }
            )
            return res.status(200).send('Completed')

          case 'takingProfit':
            await MarketOperation.update(
              {
                takingProfit: updateValue,
              },
              { where: { id: operationsIds } },
              { transaction: t }
            )
            return res.status(200).send('Completed')

          case 'buyPrice':
            await MarketOperation.update(
              {
                buyPrice: updateValue,
              },
              { where: { id: operationsIds } },
              { transaction: t }
            )
            return res.status(200).send('Completed')

          case 'price':
            const allOperations = await MarketOperation.findAll(
              {
                where: {
                  id: operationsIds,
                },
              },
              { transaction: t }
            )

            if (!allOperations) {
              throw new Error('Ocurrió un error al momento de buscar la cuenta del usuario')
            }

            for (let marketOperation of allOperations) {
              /**
               * Run some basic validations
               */
              if (!marketOperation) {
                throw new Error('Ocurrió un error al momento de buscar la operación')
              }

              if (marketOperation.status !== 1) {
                throw new Error(
                  `Una o más operaciones seleccionadas no se encuentran Activas. [Operación = ${marketOperation.id}]`
                )
              }

              /**
               * Define base information
               */
              const gpAmount = Number(_.get(updateValue, 'gpAmount', 0).replace(/\,/g, ''))
              const marketPrice = Number(_.get(updateValue, 'marketPrice', 0).replace(/\,/g, ''))
              const commoditiesTotal = Number(marketOperation.commoditiesTotal)
              const amount = Number(marketOperation.amount)
              let calculatedValue = 0
              /**
               * Start product price update based on market
               */

              switch (updateType) {
                /**
                 * STOCKS
                 */
                case 'stocks':
                  if (marketOperation.commodityId === 1) {
                    calculatedValue = gpAmount * commoditiesTotal
                  } else {
                    throw new Error(
                      `Una o más operaciones seleccionadas no corresponde al mercados de Stocks. [Operación = ${marketOperation.id}]`
                    )
                  }
                  break
                /**
                 * GOLD FU | OP
                 */
                case 'gold-FU-OP':
                  if (marketOperation.assetClassId === 2 || marketOperation.assetClassId === 1) {
                    calculatedValue = 50 * gpAmount * commoditiesTotal // 1 FT = $50
                  } else {
                    throw new Error(
                      `Una o más operaciones seleccionadas no corresponde al Mercado y su Derivado de Inversión. [Operación = ${marketOperation.id}]`
                    )
                  }
                  break
                /**
                 * GOLD FU | OP
                 */
                case 'gold-CFD-Ounces':
                case 'platinum-CFD-Ounces':
                case 'silver-CFD-Ounces':
                  if (marketOperation.assetClassId === 11) {
                    calculatedValue = gpAmount * commoditiesTotal // 1 FT = $1
                  } else {
                    throw new Error(
                      `Una o más operaciones seleccionadas no corresponde al Mercado y su Derivado de Inversión. [Operación = ${marketOperation.id}]`
                    )
                  }
                  break

                /**
                 * GOLD Spot XAU/USD
                 */
                case 'gold-Spot-XAU':
                  if (marketOperation.assetClassId === 14) {
                    calculatedValue = gpAmount * commoditiesTotal // 1 FT = $1
                  } else {
                    throw new Error(
                      `Una o más operaciones seleccionadas no corresponde al Mercado y su Derivado de Inversión. [Operación = ${marketOperation.id}]`
                    )
                  }
                  break

                /**
                 * SILVER FT | OP
                 */
                case 'silver-FT-OP':
                  if (marketOperation.assetClassId === 1 || marketOperation.assetClassId === 2) {
                    calculatedValue = 5000 * gpAmount * commoditiesTotal // 1 FT = $5000
                  } else {
                    throw new Error(
                      `Una o más operaciones seleccionadas no corresponde al Mercado y su Derivado de Inversión. [Operación = ${marketOperation.id}]`
                    )
                  }

                  break

                /**
                 * PLATINUM FT | OP
                 */
                case 'platinum-FT-OP':
                  if (marketOperation.assetClassId === 1 || marketOperation.assetClassId === 2) {
                    calculatedValue = 50 * gpAmount * commoditiesTotal // 1 FT = $50
                  } else {
                    throw new Error(
                      `Una o más operaciones seleccionadas no corresponde al Mercado y su Derivado de Inversión. [Operación = ${marketOperation.id}]`
                    )
                  }
                  break

                /**
                 * CRUDE OIL FT | OP
                 */
                case 'crudeOil-FT-OP':
                  if (marketOperation.assetClassId === 1 || marketOperation.assetClassId === 2) {
                    calculatedValue = 500 * gpAmount * commoditiesTotal // 1 FT = $500
                  } else {
                    throw new Error(
                      `Una o más operaciones seleccionadas no corresponde al Mercado y su Derivado de Inversión. [Operación = ${marketOperation.id}]`
                    )
                  }
                  break

                /**
                 * CRUDE CFDs Barrels
                 */
                case 'crude-CFDs-Barrels':
                  if (marketOperation.assetClassId === 12) {
                    calculatedValue = commoditiesTotal * gpAmount // 1 Barrel = $1
                  } else {
                    throw new Error(
                      `Una o más operaciones seleccionadas no corresponde al Mercado y su Derivado de Inversión. [Operación = ${marketOperation.id}]`
                    )
                  }
                  break

                /**
                 * US Wheat Contract FT
                 */
                case 'us-Wheat-Contract-FT-OP':
                  if (marketOperation.assetClassId === 1 || marketOperation.assetClassId === 2) {
                    calculatedValue = 25 * gpAmount * commoditiesTotal // 1 FT = $25
                  } else {
                    throw new Error(
                      `Una o más operaciones seleccionadas no corresponde al Mercado y su Derivado de Inversión. [Operación = ${marketOperation.id}]`
                    )
                  }
                  break

                /**
                 * COOPER FT | OP
                 */
                case 'cooper-FT-OP':
                  if (marketOperation.assetClassId === 1 || marketOperation.assetClassId === 2) {
                    calculatedValue = 1250 * gpAmount * commoditiesTotal
                  } else {
                    throw new Error(
                      `Una o más operaciones seleccionadas no corresponde al Mercado y su Derivado de Inversión. [Operación = ${marketOperation.id}]`
                    )
                  }
                  break

                /**
                 * CBO FT | OP
                 */
                case 'cbo-FT-OP':
                  if (marketOperation.assetClassId === 1 || marketOperation.assetClassId === 2) {
                    calculatedValue = 10 * gpAmount * commoditiesTotal
                  } else {
                    throw new Error(
                      `Una o más operaciones seleccionadas no corresponde al Mercado y su Derivado de Inversión. [Operación = ${marketOperation.id}]`
                    )
                  }
                  break

                /**
                 * ORANGE FT | OP
                 */
                case 'orange-FT-OP':
                  if (marketOperation.assetClassId === 1 || marketOperation.assetClassId === 2) {
                    calculatedValue = 150 * gpAmount * commoditiesTotal
                  } else {
                    throw new Error(
                      `Una o más operaciones seleccionadas no corresponde al Mercado y su Derivado de Inversión. [Operación = ${marketOperation.id}]`
                    )
                  }
                  break

                /**
                 * NATURAL FT
                 */
                case 'natural-FT-OP':
                  if (marketOperation.assetClassId === 1 || marketOperation.assetClassId === 2) {
                    calculatedValue = 1000 * gpAmount * commoditiesTotal // 1 FT = $1000
                  } else {
                    throw new Error(
                      `Una o más operaciones seleccionadas no corresponde al Mercado y su Derivado de Inversión. [Operación = ${marketOperation.id}]`
                    )
                  }
                  break

                /**
                 * COCOA FU | OP
                 */
                case 'cocoa-FU-OP':
                  if (marketOperation.assetClassId === 2 || marketOperation.assetClassId === 1) {
                    calculatedValue = 10 * gpAmount * commoditiesTotal // 1 FT = $10
                  } else {
                    throw new Error(
                      `Una o más operaciones seleccionadas no corresponde al Mercado y su Derivado de Inversión. [Operación = ${marketOperation.id}]`
                    )
                  }
                  break

                /**
                 * LUMBER  FT
                 */
                case 'lumber-FT-OP':
                  if (marketOperation.assetClassId === 1 || marketOperation.assetClassId === 2) {
                    calculatedValue = 110 * gpAmount * commoditiesTotal // 1 FT = $375  (3.75 dollars per cent)
                  } else {
                    throw new Error(
                      `Una o más operaciones seleccionadas no corresponde al Mercado y su Derivado de Inversión. [Operación = ${marketOperation.id}]`
                    )
                  }
                  break

                /**
                 * SOYBEAN OIL US  FT
                 */
                case 'soybean-oil-FT-OP':
                  if (marketOperation.assetClassId === 1 || marketOperation.assetClassId === 2) {
                    calculatedValue = 600 * gpAmount * commoditiesTotal // 1 FT = $375  (3.75 dollars per cent)
                  } else {
                    throw new Error(
                      `Una o más operaciones seleccionadas no corresponde al Mercado y su Derivado de Inversión. [Operación = ${marketOperation.id}]`
                    )
                  }
                  break

                /**
                 * COFFEE US FT OP
                 */
                case 'coffee-FT-OP':
                  if (marketOperation.assetClassId === 2 || marketOperation.assetClassId === 1) {
                    calculatedValue = 375 * gpAmount * commoditiesTotal // 1 FT = $375  (3.75 dollars per cent)
                  } else {
                    throw new Error(
                      `Una o más operaciones seleccionadas no corresponde al Mercado y su Derivado de Inversión. [Operación = ${marketOperation.id}]`
                    )
                  }
                  break

                /**
                 * GASOLINE FT OP
                 */
                case 'gasoline-FT-OP':
                  if (marketOperation.assetClassId === 2 || marketOperation.assetClassId === 1) {
                    calculatedValue = 420 * gpAmount * commoditiesTotal // 1 FT = $420  (4.20 dollars per cent)
                  } else {
                    throw new Error(
                      `Una o más operaciones seleccionadas no corresponde al Mercado y su Derivado de Inversión. [Operación = ${marketOperation.id}]`
                    )
                  }
                  break

                /**
                 * AVENA FT OP
                 */
                case 'avena-FT-OP':
                  if (marketOperation.assetClassId === 2 || marketOperation.assetClassId === 1) {
                    calculatedValue = 50 * gpAmount * commoditiesTotal // 1 FT = $50  (0.05 dollars per cent)
                  } else {
                    throw new Error(
                      `Una o más operaciones seleccionadas no corresponde al Mercado y su Derivado de Inversión. [Operación = ${marketOperation.id}]`
                    )
                  }
                  break

                /**
                 * AZUCAR FT OP
                 */
                case 'sugar-FT':
                  if (
                    marketOperation.assetClassId === 2 ||
                    marketOperation.assetClassId === 12 ||
                    marketOperation.assetClassId === 15
                  ) {
                    calculatedValue = 1120 * gpAmount * commoditiesTotal // 1 FT = $50  (0.05 dollars per cent)
                  } else {
                    throw new Error(
                      `Una o más operaciones seleccionadas no corresponde al Mercado y su Derivado de Inversión. [Operación = ${marketOperation.id}]`
                    )
                  }
                  break

                /**
                 * AZUCAR FT OP
                 */
                case 'sugar-CFD':
                  if (
                    marketOperation.assetClassId === 2 ||
                    marketOperation.assetClassId === 12 ||
                    marketOperation.assetClassId === 15
                  ) {
                    calculatedValue = 0.01 * gpAmount * commoditiesTotal // 1 FT = $50  (0.05 dollars per cent)
                  } else {
                    throw new Error(
                      `Una o más operaciones seleccionadas no corresponde al Mercado y su Derivado de Inversión. [Operación = ${marketOperation.id}]`
                    )
                  }
                  break
                /**
                 * CORN BUSHELS
                 */
                case 'bushels-CFD':
                  if (
                    marketOperation.assetClassId === 2 ||
                    marketOperation.assetClassId === 12 ||
                    marketOperation.assetClassId === 15 ||
                    marketOperation.assetClassId === 16
                  ) {
                    calculatedValue = 0.01 * gpAmount * commoditiesTotal // 1 FT = $50  (0.05 dollars per cent)
                  } else {
                    throw new Error(
                      `Una o más operaciones seleccionadas no corresponde al Mercado y su Derivado de Inversión. [Operación = ${marketOperation.id}]`
                    )
                  }
                  break

                /**
                 * US SOYBEANS
                 */
                case 'soybeans-CFD':
                  if (
                    marketOperation.assetClassId === 2 ||
                    marketOperation.assetClassId === 12 ||
                    marketOperation.assetClassId === 15 ||
                    marketOperation.assetClassId === 16
                  ) {
                    calculatedValue = 0.01 * gpAmount * commoditiesTotal // 1 FT = $50  (0.05 dollars per cent)
                  } else {
                    throw new Error(
                      `Una o más operaciones seleccionadas no corresponde al Mercado y su Derivado de Inversión. [Operación = ${marketOperation.id}]`
                    )
                  }
                  break

                /**
                 * EUR USD FOREX
                 */
                case 'eur-usd':
                  if (
                    marketOperation.assetClassId === 1 ||
                    marketOperation.assetClassId === 2 ||
                    marketOperation.assetClassId === 10 ||
                    marketOperation.assetClassId === 12
                  ) {
                    /**
                     *
                     * La ganancia por Pip es de 10 dólares para un lotaje de 100,000 unidades de moneda
                     100,000 x 0.0001 = 10

                     Ejemplo:
                     Compra: 1.1900
                     Venta: 1.1920
                     Diferencia: 20 pips
                     Ganancia: 200 dólares.

                     */
                    const pips = commoditiesTotal.toString()[0] * 10

                    calculatedValue = pips * gpAmount
                  } else {
                    throw new Error(
                      `Una o más operaciones seleccionadas no corresponde al Mercado y su Derivado de Inversión. [Operación = ${marketOperation.id}]`
                    )
                  }
                  break

                /**
                 * GBP USD FOREX
                 */
                case 'gbp-usd':
                  if (
                    marketOperation.assetClassId === 1 ||
                    marketOperation.assetClassId === 2 ||
                    marketOperation.assetClassId === 10 ||
                    marketOperation.assetClassId === 12
                  ) {
                    const pips = commoditiesTotal.toString()[0] * 10

                    calculatedValue = pips * gpAmount // 1 FT = $50  (0.05 dollars per cent)
                  } else {
                    throw new Error(
                      `Una o más operaciones seleccionadas no corresponde al Mercado y su Derivado de Inversión. [Operación = ${marketOperation.id}]`
                    )
                  }
                  break

                default:
              }

              /**
               * End product price update based on market
               */
              await MarketMovement.create(
                {
                  gpInversion: ToFixNumber(calculatedValue + amount),
                  marketOperationId: marketOperation.id,
                  gpAmount: ToFixNumber(calculatedValue),
                  marketPrice,
                  status: 1,
                  createdAt: moment(new Date()).tz('America/New_York').format(),
                  updatedAt: moment(new Date()).tz('America/New_York').format(),
                },
                { transaction: t }
              )
            }

            break
          case 'create-operation':
            let nextOrderId = 0
            let index = 0
            const userAccounts = await UserAccount.findAll(
              {
                where: {
                  id: operationsIds,
                },
              },
              { transaction: t }
            )

            if (!userAccounts) {
              throw new Error('Ocurrió un error al momento de buscar la cuenta del usuario')
            }
            // In this case operationsIds refers to User Accounts Ids

            for (let userAccount of userAccounts) {
              const snapShotAccount = JSON.stringify(userAccount)

              try {
                if (index === 0) {
                  const lastMarketOperationEntry = await MarketOperation.findAll(
                    {
                      limit: 1,
                      attributes: ['orderId'],
                      order: [['id', 'DESC']],
                    },
                    { transaction: t }
                  )
                  nextOrderId = Number(lastMarketOperationEntry[0].orderId) + 1
                } else {
                  nextOrderId = nextOrderId + 1
                }

                await MarketOperation.create(
                  {
                    longShort: updateValue.longShort,
                    userAccountId: userAccount.id,
                    brokerId: userAccount.brokerId,
                    productId: _.get(updateValue, 'product.id', 0),
                    commoditiesTotal: updateValue.commoditiesTotal,
                    commodityId: _.get(updateValue, 'commodity.id', 1),
                    assetClassId: _.get(updateValue, 'assetClass.id', 1),
                    buyPrice: updateValue.buyPrice,
                    takingProfit: updateValue.takingProfit,
                    stopLost: updateValue.stopLost,
                    maintenanceMargin: updateValue.maintenanceMargin,
                    amount: updateValue.amount,
                    initialAmount: updateValue.amount,
                    behavior: 0,
                    holdStatusCommission: updateValue.holdStatusCommission || 0,
                    orderId: nextOrderId,
                    status: _.get(updateValue, 'status', 1),
                    createdAt: moment(updateValue.createdAt || new Date())
                      .tz('America/New_York')
                      .format(),
                    updatedAt: moment(new Date()).tz('America/New_York').format(),
                  },
                  { transaction: t }
                )

                const marginOperation = ToFixNumber(
                  (Number(updateValue.maintenanceMargin) + Number(updateValue.amount)) * 0.1
                )
                const guaranteeOperation = ToFixNumber(
                  Number(userAccount.guaranteeOperation) -
                    (Number(updateValue.maintenanceMargin) +
                      Number(updateValue.amount) +
                      marginOperation)
                )

                const updatedUserAccount = await userAccount.update(
                  {
                    guaranteeOperation,
                    marginUsed: ToFixNumber(Number(userAccount.marginUsed || 0) + marginOperation), // Margen Utilizado 10%
                    updatedAt: moment(new Date()).tz('America/New_York').format(),
                  },
                  { transaction: t }
                )

                Log({
                  userId,
                  userAccountId: userAccount.id,
                  tableUpdated: 'userAccount',
                  action: 'update',
                  type: 'createOperation',
                  snapShotBeforeAction: snapShotAccount,
                  snapShotAfterAction: JSON.stringify(updatedUserAccount),
                })
              } catch (e) {
                throw new Error(
                  `Ocurrió un error al momento de actualizar la cuenta del usuario. Error: ${e}`
                )
              }
              index++
            }

            break
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
      const marketOperation = await MarketOperation.findByPk(req.params.id)

      if (!marketOperation) {
        return res.status(404).send({
          message: 'MarketOperation Not Found',
        })
      }

      await marketOperation.update({
        status: 0,
      })

      return res.status(200).send({
        message: 'MarketOperation has been deleted',
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },
}
