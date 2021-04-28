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

        await MarketMovement.create(
          {
            gpInversion: req.body.amount,
            marketOperationId: Number(marketOperation.id),
            gpAmount: 0,
            marketPrice: 0,
            status: _.get(req, 'body.status', 1),
            createdAt: moment(req.body.createdAt || new Date())
              .tz('America/New_York')
              .format(),
            updatedAt: moment(new Date()).tz('America/New_York').format(),
          },
          { transaction: t }
        )

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
      return res.status(500).send(err)
    }
  },

  async list(req, res) {
    let marketOperation
    if (req.user.roleId == 1) {
      marketOperation = await MarketOperation.findAll(
        marketOperationQuery.listAdmin({
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
    } else {
      marketOperation = await MarketOperation.findAll(
        marketOperationQuery.list({
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
    }

    if (!marketOperation) {
      return res.status(404).send({
        message: '404 on MarketOperation get List',
      })
    }
    return res.status(200).send(marketOperation)
  },
  async listByUserAccount(req, res) {
    const marketOperation = await MarketOperation.findAll(
      marketOperationQuery.list({
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
  },

  async accountReport(req, res) {
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
  },

  async get(req, res) {
    const marketOperation = await MarketOperation.findByPk(
      req.params.marketOperationId,
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
  },

  async update(req, res) {
    const userId = _.get(req, 'user.id', 0)
    await ORM.transaction(async (t) => {
      const marketOperation = await MarketOperation.findOne({
        where: {
          id: req.params.marketOperationId,
        },
        include: [
          {
            model: UserAccount,
            as: 'userAccount',
            attributes: {
              exclude: ['snapShotAccount'],
            },
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
      })

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
      }

      try {
        await marketOperation.update(
          {
            longShort: req.body.longShort || marketOperation.longShort,
            userAccountId: _.get(req, 'body.userAccount.id', 0) || marketOperation.userAccountId,
            brokerId: _.get(req, 'body.broker.id', 0) || marketOperation.brokerId,
            productId: _.get(req, 'body.product.id', 0) || marketOperation.productId,
            commoditiesTotal: req.body.commoditiesTotal || marketOperation.commoditiesTotal,
            commodityId: _.get(req, 'body.commodity.id', 1) || marketOperation.commodityId,
            assetClassId: _.get(req, 'body.assetClass.id', 1) || marketOperation.assetClassId,
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
          const userAccount = await UserAccount.findOne({
            where: {
              id: marketOperation.userAccountId,
            },
          })

          if (!userAccount) {
            throw new Error('Ocurrió un error al momento de buscar la cuenta del usuario')
          }
          const accountValueBeforeEndOperation = `${userAccount.accountValue}`
          const {
            initialAmount,
            amount,
            holdStatusCommission,
            maintenanceMargin,
            assetClassId,
          } = marketOperation
          const { percentage } = marketOperation.userAccount.account
          const isBrokerGuarantee = userAccount.accountId === 10 || userAccount.accountId === 12

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
      } catch (e) {
        return res.status(401).send({
          message: e.message,
        })
      }
    })
  },

  async bulkUpdate(req, res) {
    const userId = _.get(req, 'user.id', 0)
    let valueFT = 0
    try {
      const { operationsIds, updateType, updateValue, updateScope } = req.body
      console.log('[=====  BULK DETAIIL  =====>')
      console.log('IDS', operationsIds)
      console.log('Type', updateType)
      console.log('Value', updateValue)
      console.log('Scope', updateScope)
      console.log('<=====  /BULK DETAIIL  =====]')
      let result
      await ORM.transaction(async (t) => {
        switch (updateScope) {
          case 'status':
            if (updateValue === 4) {
              /**
               * Close Operation
               */
              let pivotUserAccountTable = []
              for (const operationID of operationsIds) {
                const marketOperation = await MarketOperation.findOne(
                  {
                    where: {
                      id: operationID,
                    },
                    include: [
                      {
                        model: UserAccount,
                        as: 'userAccount',
                        attributes: {
                          exclude: ['snapShotAccount'],
                        },
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
                  throw new Error('Ocurrió un error al momento de buscar la operación')
                }

                const marketOperationSnapShot = JSON.stringify(marketOperation)

                if (marketOperation.status === 4) {
                  throw new Error('Una o más operaciones seleccionas ya se encuentran cerradas')
                }

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
                      })

                if (!userAccount) {
                  throw new Error('Ocurrió un error al momento de buscar la cuenta del usuario')
                }
                const accountValueBeforeEndOperation = `${userAccount.accountValue}`
                const {
                  initialAmount,
                  amount,
                  holdStatusCommission,
                  maintenanceMargin,
                  assetClassId,
                } = marketOperation
                const { percentage } = marketOperation.userAccount.account
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
              result = 'All operations has been sold'
              //END SELL OPERATION
            } else {
              result = await MarketOperation.update(
                {
                  [updateType]: updateValue,
                },
                { where: { id: operationsIds } },
                { transaction: t }
              )
            }

            return res.status(200).send(result)

          case 'stopLost':
            result = await MarketOperation.update(
              {
                stopLost: updateValue,
              },
              { where: { id: operationsIds } },
              { transaction: t }
            )
            return res.status(200).send(result)

          case 'takingProfit':
            result = await MarketOperation.update(
              {
                takingProfit: updateValue,
              },
              { where: { id: operationsIds } },
              { transaction: t }
            )
            return res.status(200).send(result)

          case 'price':
            result = await Promise.all(
              operationsIds.map(async (operationID) => {
                // Find Operation
                const marketOperation = await MarketOperation.findOne(
                  {
                    where: {
                      id: operationID,
                    },
                    silence: true,
                  },
                  { transaction: t }
                )

                /**
                 * Run some basic validations
                 */
                if (!marketOperation) {
                  throw new Error('Ocurrió un error al momento de buscar la operación')
                }

                if (marketOperation.status !== 1) {
                  throw new Error('Una o más operaciones seleccionadas no se encuentran Activas')
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
                        'Una o más operaciones seleccionadas no corresponde al mercados de Stocks'
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
                        'Una o más operaciones seleccionadas no corresponde al Mercados y su Derivado de Inversión'
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
                        'Una o más operaciones seleccionadas no corresponde al Mercados y su Derivado de Inversión'
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
                        'Una o más operaciones seleccionadas no corresponde al Mercados y su Derivado de Inversión'
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
                        'Una o más operaciones seleccionadas no corresponde al Mercados y su Derivado de Inversión'
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
                        'Una o más operaciones seleccionadas no corresponde al Mercados y su Derivado de Inversión'
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
                        'Una o más operaciones seleccionadas no corresponde al Mercados y su Derivado de Inversión'
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
                        'Una o más operaciones seleccionadas no corresponde al Mercados y su Derivado de Inversión'
                      )
                    }
                    break

                  /**
                   * US Wheat Contract FT
                   */
                  case 'us-Wheat-Contract':
                    if (marketOperation.assetClassId === 2) {
                      calculatedValue = 25 * gpAmount * commoditiesTotal // 1 FT = $25
                    } else {
                      throw new Error(
                        'Una o más operaciones seleccionadas no corresponde al Mercados y su Derivado de Inversión'
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
                        'Una o más operaciones seleccionadas no corresponde al Mercados y su Derivado de Inversión'
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
                        'Una o más operaciones seleccionadas no corresponde al Mercados y su Derivado de Inversión'
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
                        'Una o más operaciones seleccionadas no corresponde al Mercados y su Derivado de Inversión'
                      )
                    }
                    break

                  /**
                   * NATURAL FT
                   */
                  case 'natural-FT':
                    if (marketOperation.assetClassId === 2) {
                      calculatedValue = 1000 * gpAmount * commoditiesTotal // 1 FT = $1000
                    } else {
                      throw new Error(
                        'Una o más operaciones seleccionadas no corresponde al Mercados y su Derivado de Inversión'
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
                        'Una o más operaciones seleccionadas no corresponde al Mercados y su Derivado de Inversión'
                      )
                    }
                    break

                  /**
                   * LUMBER  FT
                   */
                  case 'lumber-FT':
                    if (marketOperation.assetClassId === 2) {
                      calculatedValue = 110 * gpAmount * commoditiesTotal // 1 FT = $375  (3.75 dollars per cent)
                    } else {
                      throw new Error(
                        'Una o más operaciones seleccionadas no corresponde al Mercados y su Derivado de Inversión'
                      )
                    }
                    break

                  /**
                   * SOYBEAN OIL US  FT
                   */
                  case 'soybean-oil-FT':
                    if (marketOperation.assetClassId === 2) {
                      calculatedValue = 600 * gpAmount * commoditiesTotal // 1 FT = $375  (3.75 dollars per cent)
                    } else {
                      throw new Error(
                        'Una o más operaciones seleccionadas no corresponde al Mercados y su Derivado de Inversión'
                      )
                    }
                    break

                  /**
                   * COFFEE US FT
                   */
                  case 'coffee-FT-OP':
                    if (marketOperation.assetClassId === 2 || marketOperation.assetClassId === 1) {
                      calculatedValue = 375 * gpAmount * commoditiesTotal // 1 FT = $375  (3.75 dollars per cent)
                    } else {
                      throw new Error(
                        'Una o más operaciones seleccionadas no corresponde al Mercados y su Derivado de Inversión'
                      )
                    }
                    break

                  default:
                }

                /**
                 * End product price update based on market
                 */
                return await MarketMovement.create(
                  {
                    gpInversion: ToFixNumber(calculatedValue + amount),
                    marketOperationId: operationID,
                    gpAmount: ToFixNumber(calculatedValue),
                    marketPrice,
                    status: 1,
                    createdAt: moment(new Date()).tz('America/New_York').format(),
                    updatedAt: moment(new Date()).tz('America/New_York').format(),
                  },
                  { transaction: t }
                )
              })
            )
            break
          case 'create-operation':
            let nextOrderId = 0
            // In this case operationsIds refers to User Accounts Ids
            result = await Promise.all(
              operationsIds.map(async (accountId, index) => {
                const userAccount = await UserAccount.findOne(
                  {
                    where: {
                      id: accountId,
                    },
                  },
                  { transaction: t }
                )

                if (!userAccount) {
                  throw new Error('Ocurrió un error al momento de buscar la cuenta del usuario')
                }

                const snapShotAccount = JSON.stringify(userAccount)

                try {
                  const lastMarketOperationEntry = await MarketOperation.findAll({
                    limit: 1,
                    attributes: ['orderId'],
                    order: [['id', 'DESC']],
                  })

                  if (index === 0) {
                    nextOrderId = Number(lastMarketOperationEntry[0].orderId) + 1
                  } else {
                    nextOrderId = nextOrderId + 1
                  }

                  const marketOperation = await MarketOperation.create(
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
                      holdStatusCommission: updateValue.holdStatusCommission || 0,
                      orderId: nextOrderId || 0,
                      status: _.get(updateValue, 'status', 1),
                      createdAt: moment(updateValue.createdAt || new Date())
                        .tz('America/New_York')
                        .format(),
                      updatedAt: moment(new Date()).tz('America/New_York').format(),
                    },
                    { transaction: t }
                  )

                  await MarketMovement.create(
                    {
                      gpInversion: updateValue.amount,
                      marketOperationId: Number(marketOperation.id),
                      gpAmount: 0,
                      marketPrice: 0,
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
                      marginUsed: ToFixNumber(
                        Number(userAccount.marginUsed || 0) + marginOperation
                      ), // Margen Utilizado 10%
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
              })
            )
            break
          default:
        }
        return res.status(200).send('Completed')
      })
    } catch (error) {
      console.log('[=====  ERROR on BULK  =====>')
      console.log(error)
      console.log('<=====  /ERROR on BULK  =====]')
      return res.status(400).send({
        message: error.message,
      })
    }
  },

  async delete(req, res) {
    const marketOperation = await MarketOperation.findOne({
      where: {
        id: req.params.marketOperationId,
      },
    })

    if (!marketOperation) {
      return res.status(404).send({
        message: 'MarketOperation Not Found',
      })
    }

    //await marketOperation.destroy();
    await marketOperation.update({
      status: 0,
    })

    return res.status(200).send({
      message: 'MarketOperation has been deleted',
    })
  },
}
