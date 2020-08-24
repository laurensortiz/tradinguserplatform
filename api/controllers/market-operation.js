import _ from 'lodash';
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
  sequelize
} from '../models';

import { marketOperationQuery, userQuery } from '../queries';
import moment from "moment-timezone";

module.exports = {
  async create(req, res) {
    try {

      const marketOperation = await MarketOperation.create( {
        longShort: req.body.longShort,
        userAccountId: _.get( req, 'body.userAccount.id', 0 ),
        brokerId: _.get( req, 'body.broker.id', 0 ),
        productId: _.get( req, 'body.product.id', 0 ),
        commoditiesTotal: req.body.commoditiesTotal,
        commodityId: _.get( req, 'body.commodity.id', 1 ),
        assetClassId: _.get( req, 'body.assetClass.id', 1 ),
        buyPrice: req.body.buyPrice,
        takingProfit: req.body.takingProfit,
        stopLost: req.body.stopLost,
        maintenanceMargin: req.body.maintenanceMargin,
        amount: req.body.amount,
        initialAmount: req.body.amount,
        orderId: req.body.orderId || 0,
        status: _.get( req, 'body.status', 1 ),
        createdAt: moment( req.body.createdAt ).tz( 'America/New_York' ).format() || moment( new Date() ).tz( 'America/New_York' ).format(),
        updatedAt: moment( new Date() ).tz( 'America/New_York' ).format(),
      } );


      await MarketMovement.create( {
        gpInversion: req.body.amount,
        marketOperationId: Number( marketOperation.id ),
        gpAmount: 0,
        marketPrice: 0,
        status: _.get( req, 'body.status', 1 ),
        createdAt: moment( req.body.createdAt ).tz( 'America/New_York' ).format() || moment( new Date() ).tz( 'America/New_York' ).format(),
        updatedAt: moment( new Date() ).tz( 'America/New_York' ).format()
      } );

      return res.status( 200 ).send( marketOperation );
    } catch (err) {
      return res.status( 500 ).send( err );
    }
  },

  async list(req, res) {

    const marketOperation = await MarketOperation.findAll(
      marketOperationQuery.list( {
        req,
        sequelize,
        UserAccount,
        User,
        Account,
        Product,
        Broker,
        Commodity,
        AssetClass
      } )
    );

    if (!marketOperation) {
      return res.status( 404 ).send( {
        message: '404 on MarketOperation get List',
      } );
    }
    return res.status( 200 ).send( marketOperation );
  },

  async get(req, res) {
    const marketOperation = await MarketOperation.findByPk(
      req.params.marketOperationId,
      marketOperationQuery.get( { req, UserAccount, Product, Broker } )
    );

    if (!marketOperation) {
      return res.status( 404 ).send( {
        message: '404 on MarketOperation get',
      } );
    }

    return res.status( 200 ).send( marketOperation );
  },

  async update(req, res) {
    await ORM.transaction( async (t) => {

      const marketOperation = await MarketOperation.findOne( {
        where: {
          id: req.params.marketOperationId,
        },
        include: [
          {
            model: UserAccount,
            as: 'userAccount',
            include: [
              {
                model: Account,
                as: 'account',
                attributes: [ 'name', 'percentage', 'associatedOperation' ]
              },

            ],
          }
        ],
        silence: true
      } );

      if (!marketOperation) {
        return res.status( 404 ).send( {
          message: '404 on MarketOperation update',
        } );
      }

      if (marketOperation.status === 4 && _.isNil(req.body.endDate)) {
        return res.status( 401 ).send( {
          message: 'Esta operación ya se encuentra cerrada. Sólo es permitido cambiar la fecha de cierre',
        } );
      }

      if (marketOperation.status === 4 && !_.isNil(req.body.endDate)) {
        await marketOperation.update( {
          updatedAt: moment( new Date() ).tz( 'America/New_York' ).format(),
          endDate: moment( req.body.endDate ).tz( 'America/New_York' ).format() || marketOperation.endDate,
        }, { transaction: t } );
        return res.status( 200 ).send( marketOperation );
      }

      try {
        await marketOperation.update( {
          longShort: req.body.longShort || marketOperation.longShort,
          userAccountId: _.get( req, 'body.userAccount.id', 0 ) || marketOperation.userAccountId,
          brokerId: _.get( req, 'body.broker.id', 0 ) || marketOperation.brokerId,
          productId: _.get( req, 'body.product.id', 0 ) || marketOperation.productId,
          commoditiesTotal: req.body.commoditiesTotal || marketOperation.commoditiesTotal,
          commodityId: _.get( req, 'body.commodity.id', 1 ) || marketOperation.commodityId,
          assetClassId: _.get( req, 'body.assetClass.id', 1 ) || marketOperation.assetClassId,
          buyPrice: req.body.buyPrice || marketOperation.buyPrice,
          takingProfit: req.body.takingProfit || marketOperation.takingProfit,
          stopLost: req.body.stopLost || marketOperation.stopLost,
          maintenanceMargin: req.body.maintenanceMargin || marketOperation.maintenanceMargin,
          amount: req.body.amount || marketOperation.amount,
          initialAmount: req.body.initialAmount || marketOperation.initialAmount,
          orderId: req.body.orderId || marketOperation.orderId,
          status: _.get( req, 'body.status', 1 ) || marketOperation.status,
          createdAt: moment( req.body.createdAt ).tz( 'America/New_York' ).format() || marketOperation.createdAt,
          updatedAt: moment( new Date() ).tz( 'America/New_York' ).format(),
          endDate: moment( req.body.endDate ).tz( 'America/New_York' ).format() || marketOperation.endDate,
        }, { transaction: t } );

        if (marketOperation.status === 4) {
          const userAccount = await UserAccount.findOne( {
            where: {
              id: marketOperation.userAccountId,
            },
          } );

          if (!userAccount) {
            throw new Error( 'Ocurrió un error al momento de buscar la cuenta del usuario' )
          }

          const { initialAmount, amount, holdStatusCommission, maintenanceMargin, assetClassId } = marketOperation;
          const { percentage } = marketOperation.userAccount.account;

          const maintenanceMarginAmount = (
            assetClassId === 8 ||
            assetClassId === 7 ||
            assetClassId === 5 ||
            assetClassId === 4 ||
            assetClassId === 3 ||
            assetClassId === 1
          ) ? 0 : Number( maintenanceMargin );
          const profit = Number( amount ) - Number( initialAmount );
          const isProfitPositive = Math.sign( profit ) >= 0;
          const commission = isProfitPositive ? Number( ( ( profit * Number( percentage ) ) / 100 ).toFixed( 2 ) ) : 0
          const hold = isProfitPositive ? Number( holdStatusCommission ) : 0;
          const endProfit = profit - commission - hold;

          // Close Calculations
          const marginUsed = ( ( Number( initialAmount ) + Number( maintenanceMarginAmount ) ) * 10 ) / 100;
          const guaranteeOperationProduct = Number( userAccount.guaranteeOperation ) + Number( initialAmount ) + Number( maintenanceMarginAmount ) + Number( marginUsed ) + endProfit;
          const accountValueEndOperation = Number( userAccount.accountValue ) + Number( endProfit );
          const accountGuaranteeEndOperation = Number( userAccount.guaranteeOperation ) + Number( guaranteeOperationProduct );
          const accountMarginUsedEndOperation = Number( userAccount.marginUsed ) - Number( marginUsed );

          await userAccount.update( {
            accountValue: accountValueEndOperation, // Valor de la Cuenta
            guaranteeOperation: guaranteeOperationProduct, // Garantías diponibles
            marginUsed: accountMarginUsedEndOperation, // Margen Utilizado 10%
            snapShotAccount: JSON.stringify( userAccount ),
            updatedAt: new Date(),

          }, { transaction: t } );

          await marketOperation.update( {
            profitBrut: profit,
            profitNet: endProfit,
            accountValueEndOperation: accountValueEndOperation,
            guaranteeValueEndOperation: accountGuaranteeEndOperation,
            commissionValueEndOperation: commission,
            guaranteeOperationValueEndOperation: guaranteeOperationProduct,
            holdStatusCommissionEndOperation: hold
          }, { transaction: t } )


        }

        return res.status( 200 ).send( marketOperation );
      } catch (e) {
        return res.status( 401 ).send( {
          message: e.message,
        } );
      }

    } )


  },

  async bulkUpdate(req, res) {
    let valueFT = 0;
    try {
      const { operationsIds, updateType, updateValue, updateScope } = req.body;
      let result;
      await ORM.transaction( async (t) => {

        switch (updateScope) {
          case 'status':

            if (updateValue === 4) {
              /**
               * Close Operation
               */
              result = await Promise.all( operationsIds.map( async (operationID) => {
                  const marketOperation = await MarketOperation.findOne( {
                    where: {
                      id: operationID,
                    },
                    include: [
                      {
                        model: UserAccount,
                        as: 'userAccount',
                        include: [
                          {
                            model: Account,
                            as: 'account',
                            attributes: [ 'name', 'percentage', 'associatedOperation' ]
                          },

                        ],
                      }
                    ],
                    silence: true
                  }, { transaction: t } );

                  if (!marketOperation) {
                    throw new Error( 'Ocurrió un error al momento de buscar la operación' )
                  }

                  if (marketOperation.status === 4) {
                    throw new Error( 'Una o más operaciones seleccionas ya se encuentran cerradas' )
                  }

                  const userAccount = await UserAccount.findOne( {
                    where: {
                      id: marketOperation.userAccountId,
                    },
                  } );

                  if (!userAccount) {
                    throw new Error( 'Ocurrió un error al momento de buscar la cuenta del usuario' )
                  }

                  const { initialAmount, amount, holdStatusCommission, maintenanceMargin, assetClassId } = marketOperation;
                  const { percentage } = marketOperation.userAccount.account;

                  const maintenanceMarginAmount = (
                    assetClassId === 8 ||
                    assetClassId === 7 ||
                    assetClassId === 5 ||
                    assetClassId === 4 ||
                    assetClassId === 3 ||
                    assetClassId === 1
                  ) ? 0 : Number( maintenanceMargin );
                  const profit = Number( amount ) - Number( initialAmount );
                  const isProfitPositive = Math.sign( profit ) >= 0;
                  const commission = isProfitPositive ? Number( ( ( profit * Number( percentage ) ) / 100 ).toFixed( 2 ) ) : 0
                  const hold = isProfitPositive ? Number( holdStatusCommission ) : 0;
                  const endProfit = profit - commission - hold;

                  // Close Calculations
                  const marginUsed = ( ( Number( initialAmount ) + Number( maintenanceMarginAmount ) ) * 10 ) / 100;
                  const guaranteeOperationProduct = Number( userAccount.guaranteeOperation ) + Number( initialAmount ) + Number( maintenanceMarginAmount ) + Number( marginUsed ) + endProfit;
                  const accountValueEndOperation = Number( userAccount.accountValue ) + Number( endProfit );
                  const accountGuaranteeEndOperation = Number( userAccount.guaranteeOperation ) + Number( guaranteeOperationProduct );
                  const accountMarginUsedEndOperation = Number( userAccount.marginUsed ) - Number( marginUsed );

                  try {
                    await userAccount.update( {
                      accountValue: accountValueEndOperation, // Valor de la Cuenta
                      guaranteeOperation: guaranteeOperationProduct, // Garantías diponibles
                      marginUsed: accountMarginUsedEndOperation, // Margen Utilizado 10%
                      snapShotAccount: JSON.stringify( userAccount ),
                      updatedAt: new Date(),

                    }, { transaction: t } );

                    await marketOperation.update( {
                      profitBrut: profit,
                      profitNet: endProfit,
                      accountValueEndOperation: accountValueEndOperation,
                      guaranteeValueEndOperation: accountGuaranteeEndOperation,
                      commissionValueEndOperation: commission,
                      guaranteeOperationValueEndOperation: guaranteeOperationProduct,
                      holdStatusCommissionEndOperation: hold,
                      endDate: moment( new Date() ).tz( 'America/New_York' ).format(),
                      status: 4

                    }, { transaction: t } )

                  } catch (e) {
                    throw new Error( `Ocurrió un error al momento de actualizar la cuenta del usuario. Error: ${ e }` )
                  }
                } )
              )


            } else {
              /**
               *
               */
              result = await MarketOperation.update( {
                  [ updateType ]: updateValue,
                }, { where: { id: operationsIds } },
                { transaction: t }
              );
            }

            return res.status( 200 ).send( result );

          case 'price':
            result = await Promise.all( operationsIds.map( async (operationID) => {
              // Find Operation
              const marketOperation = await MarketOperation.findOne( {
                where: {
                  id: operationID,
                },
                silence: true
              }, { transaction: t } );

              /**
               * Run some basic validations
               */
              if (!marketOperation) {
                throw new Error( 'Ocurrió un error al momento de buscar la operación' )
              }

              if (marketOperation.status !== 1) {
                throw new Error( 'Una o más operaciones seleccionadas no se encuentran Activas' )
              }

              /**
               * Define base information
               */
              const gpAmount = Number( ( _.get( updateValue, 'gpAmount', 0 ) ).replace( /\,/g, '' ) );
              const marketPrice = Number( _.get( updateValue, 'marketPrice', 0 ) );
              const commoditiesTotal = Number( marketOperation.commoditiesTotal );
              const amount = Number( marketOperation.amount );
              let calculatedValue = 0;
              /**
               * Start product price update based on market
               */

              switch (updateType) {
                /**
                 * STOCKS
                 */
                case 'stocks':
                  if (marketOperation.commodityId === 1) {
                    calculatedValue = gpAmount * commoditiesTotal;

                  } else {
                    throw new Error( 'Una o más operaciones seleccionadas no corresponde al mercados de Stocks' )

                  }
                  break;

                /**
                 * GOLD FU | OP
                 */
                case 'gold-FU-OP':
                  if (marketOperation.assetClassId === 2 || marketOperation.assetClassId === 1) {
                    calculatedValue = ( 50 * gpAmount ) * commoditiesTotal; // 1 FT = $50
                  } else {
                    throw new Error( 'Una o más operaciones seleccionadas no corresponde al Mercados y su Derivado de Inversión' )
                  }
                  break;

                /**
                 * GOLD FU | OP
                 */
                case 'gold-CFD-Ounces':
                case 'platinum-CFD-Ounces':
                case 'silver-CFD-Ounces':
                  if (marketOperation.assetClassId === 11) {
                    calculatedValue = gpAmount * commoditiesTotal; // 1 FT = $1
                  } else {
                    throw new Error( 'Una o más operaciones seleccionadas no corresponde al Mercados y su Derivado de Inversión' )

                  }
                  break;

                /**
                 * GOLD Spot XAU/USD
                 */
                case 'gold-Spot-XAU':
                  if (marketOperation.assetClassId === 14) {
                    calculatedValue = gpAmount * commoditiesTotal; // 1 FT = $1
                  } else {
                    throw new Error( 'Una o más operaciones seleccionadas no corresponde al Mercados y su Derivado de Inversión' )

                  }
                  break;

                /**
                 * SILVER FT | OP
                 */
                case 'silver-FT-OP':
                  if (marketOperation.assetClassId === 1 || marketOperation.assetClassId === 2) {
                    calculatedValue = ( 5000 * gpAmount ) * commoditiesTotal; // 1 FT = $5000
                  } else {
                    throw new Error( 'Una o más operaciones seleccionadas no corresponde al Mercados y su Derivado de Inversión' )
                  }

                  break;

                /**
                 * PLATINUM FT | OP
                 */
                case 'platinum-FT-OP':
                  if (marketOperation.assetClassId === 1 || marketOperation.assetClassId === 2) {
                    calculatedValue = ( 50 * gpAmount ) * commoditiesTotal; // 1 FT = $50
                  } else {
                    throw new Error( 'Una o más operaciones seleccionadas no corresponde al Mercados y su Derivado de Inversión' )
                  }
                  break;

                /**
                 * CRUDE OIL FT | OP
                 */
                case 'crudeOil-FT-OP':
                  if (marketOperation.assetClassId === 1 || marketOperation.assetClassId === 2) {
                    calculatedValue = ( 500 * gpAmount ) * commoditiesTotal; // 1 FT = $500
                  } else {
                    throw new Error( 'Una o más operaciones seleccionadas no corresponde al Mercados y su Derivado de Inversión' )
                  }
                  break;

                /**
                 * CRUDE CFDs Barrels
                 */
                case 'crude-CFDs-Barrels':
                  if (marketOperation.assetClassId === 12) {
                    calculatedValue = ( commoditiesTotal * gpAmount ); // 1 Barrel = $1
                  } else {
                    throw new Error( 'Una o más operaciones seleccionadas no corresponde al Mercados y su Derivado de Inversión' )

                  }
                  break;

                default:

              }
              /**
               * End product price update based on market
               */


              return await MarketMovement.create( {
                gpInversion: calculatedValue + amount,
                marketOperationId: operationID,
                gpAmount: calculatedValue,
                marketPrice,
                status: 1,
                createdAt: moment( new Date() ).tz( 'America/New_York' ).format(),
                updatedAt: moment( new Date() ).tz( 'America/New_York' ).format()
              }, { transaction: t } );

            } ) )
        }
        return res.status( 200 ).send( result );
      } );
    } catch (error) {
      return res.status( 400 ).send( {
        message: error.message,
      } );

    }

  },

  async delete(req, res) {
    const marketOperation = await MarketOperation.findOne( {
      where: {
        id: req.params.marketOperationId,
      },
    } );

    if (!marketOperation) {
      return res.status( 404 ).send( {
        message: 'MarketOperation Not Found',
      } );
    }

    //await marketOperation.destroy();
    await marketOperation.update( {
      status: 0,
    } );

    return res.status( 200 ).send( {
      message: 'MarketOperation has been deleted',
    } );
  },
};
