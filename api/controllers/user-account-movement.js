import _ from 'lodash';
import { UserAccount, UserAccountMovement, ORM } from '../models';
import { userAccountMovementQuery, userQuery } from '../queries';
import moment from "moment-timezone";
import ToFixNumber from '../../common/to-fix-number';
import Log from "../../common/log";


module.exports = {
  async create(req, res) {
    try {
      const userId = _.get(req, 'user.id', 0)
      await ORM.transaction( async (t) => {

        const userAccount = await UserAccount.findOne({
          where: {
            id: Number(req.body.userAccountId),
          },
          attributes: {
            exclude: [ 'snapShotAccount' ],
          },
        });

        if (!userAccount) {
          return res.status(404).send({
            message: '404 on UserAccount update',
          });
        }

        const snapShotAccount = JSON.stringify( userAccount );

        let accountValue = Number(userAccount.accountValue || 0.00) ;
        let marginUsed = Number(userAccount.marginUsed || 0.00);
        let guaranteeOperation = Number(userAccount.guaranteeOperation);
        const debit =  Number(req.body.debit || 0.00) ;
        const credit = Number(req.body.credit || 0.00) ;

        if (credit > 0) {
          accountValue = ToFixNumber(accountValue + credit);
          guaranteeOperation = ToFixNumber(guaranteeOperation + credit)
        } else if (debit > 0 ) {
          accountValue = ToFixNumber(accountValue - debit);
          guaranteeOperation = ToFixNumber(guaranteeOperation - debit)
        } else {
          return res.status(404).send({
            message: 'Movimiento inválido',
          });
        }

        marginUsed = ToFixNumber((accountValue * marginUsed) / userAccount.accountValue || 0);

        const userAccountMovement = await UserAccountMovement.create({
          userAccountId: Number(req.body.userAccountId),
          debit,
          credit,
          accountValue,
          previousAccountValue: userAccount.accountValue,
          reference: req.body.reference || '',
          status: _.get(req, 'body.status', 1),
          createdAt: moment(req.body.createdAt || new Date()).tz('America/New_York').format(),
          updatedAt: moment(new Date()).tz('America/New_York').format()
        }, { transaction: t } );

        const updatedUserAccount = await userAccount.update({
          accountValue,
          guaranteeOperation,
          updatedAt: moment(new Date()).tz('America/New_York').format(),
          marginUsed,
        }, { transaction: t });

        Log({userId, userAccountId: req.body.userAccountId, tableUpdated: 'userAccount', action: 'update', type:'update', snapShotBeforeAction:  snapShotAccount, snapShotAfterAction:  JSON.stringify(updatedUserAccount)})


        return res.status(200).send(userAccountMovement);
      })

    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async list(req, res) {
    const userAccountMovement = await UserAccountMovement.findAll(
      userAccountMovementQuery.list({ req })
    );

    if (!userAccountMovement) {
      return res.status(404).send({
        message: '404 on UserAccountMovement get List',
      });
    }
    return res.status(200).send(userAccountMovement);
  },

  async get(req, res) {
    const userAccountMovement = await UserAccountMovement.findByPk(
      req.params.userAccountMovementId,
      userQuery.get( { req, UserAccount } )
    );

    if (!userAccountMovement) {
      return res.status(404).send({
        message: '404 on UserAccountMovement get',
      });
    }

    return res.status(200).send(userAccountMovement);
  },

  async getLastMovement(userAccountId) {
    return UserAccountMovement.findAll({
      where: {
        userAccountId,
      },
      limit: 1,
      order: [ [ 'createdAt', 'DESC' ]],
      silence: true
    });

  },

  async update(req, res) {
    const userId = _.get(req, 'user.id', 0)
    try {
      await ORM.transaction( async (t) => {

        const userAccountMovement = await UserAccountMovement.findOne({
          where: {
            id: req.params.userAccountMovementId,
          },
          silence: true
        });

        if (!userAccountMovement) {
          return res.status(404).send({
            message: '404 on UserAccountMovement update',
          });
        }

        const userAccount = await UserAccount.findOne({
          where: {
            id: Number(userAccountMovement.userAccountId),
          },
          attributes: {
            exclude: [ 'snapShotAccount' ],
          },
        });

        if (!userAccount) {
          return res.status(404).send({
            message: '404 on UserAccount update',
          });
        }

        const snapShotAccount = JSON.stringify( userAccount );

        let accountValue = Number(req.body.accountValue || userAccountMovement.accountValue);
        let marginUsed = Number(userAccount.marginUsed || 0);
        let guaranteeOperation = Number(userAccount.guaranteeOperation || 0);
        const debit =  Number(req.body.debit) || userAccountMovement.debit;
        const credit = Number(req.body.credit) || userAccountMovement.credit;

        if (credit > 0) {
          accountValue = ToFixNumber((accountValue - Number(userAccountMovement.credit)) + credit);
          guaranteeOperation = ToFixNumber((guaranteeOperation - Number(userAccountMovement.credit)) + credit)
        } else if (debit > 0 ) {
          
          accountValue = ToFixNumber((accountValue + Number(userAccountMovement.debit)) - debit);
          guaranteeOperation = ToFixNumber((guaranteeOperation + Number(userAccountMovement.debit)) - debit);

        } else {
          return res.status(404).send({
            message: 'Movimiento inválido',
          });
        }

        marginUsed = ToFixNumber((accountValue * marginUsed) / userAccountMovement.accountValue || 0);

        const updatedUserAccountMovement = await userAccountMovement.update({
          debit,
          credit,
          accountValue: accountValue,
          reference: req.body.reference || userAccountMovement.reference,
          previousAccountValue: req.body.previousAccountValue || userAccountMovement.previousAccountValue,
          status: _.get(req, 'body.status', 1),
          createdAt: req.body.createdAt || userAccountMovement.createdAt,
          updatedAt: new Date(),
        }, { transaction: t } );

        const updatedUserAccount = await userAccount.update({
          accountValue,
          guaranteeOperation,
          updatedAt: moment(new Date()).tz('America/New_York').format(),
          marginUsed,
        }, { transaction: t });

        Log({userId, userAccountId: userAccountMovement.userAccountId, tableUpdated: 'userAccount', action: 'update', type:'update', snapShotBeforeAction:  snapShotAccount, snapShotAfterAction:  JSON.stringify(updatedUserAccount)})


        return res.status(200).send(updatedUserAccountMovement);
      })
    } catch (e) {
      return res.status(500).send(e);
    }

  },

  async delete(req, res) {
    const userId = _.get(req, 'user.id', 0)

    try {
      await ORM.transaction( async (t) => {
        const userAccountMovement = await UserAccountMovement.findOne({
          where: {
            id: req.params.userAccountMovementId,
          },
        });

        if (!userAccountMovement) {
          return res.status(404).send({
            message: 'UserAccountMovement Not Found',
          });
        }

        const userAccount = await UserAccount.findOne({
          where: {
            id: Number(userAccountMovement.userAccountId),
          },
          attributes: {
            exclude: [ 'snapShotAccount' ],
          },
        });

        if (!userAccount) {
          return res.status(404).send({
            message: '404 on UserAccount update',
          });
        }

        const snapShotAccount = JSON.stringify( userAccount );

        let accountValue = Number(userAccount.accountValue);
        let marginUsed = Number(userAccount.marginUsed);
        let guaranteeOperation = Number(userAccount.guaranteeOperation);

        accountValue = ToFixNumber((accountValue - Number(userAccountMovement.credit)) + Number(userAccountMovement.debit));
        guaranteeOperation = ToFixNumber((guaranteeOperation - Number(userAccountMovement.credit)) + Number(userAccountMovement.debit))

        marginUsed = ToFixNumber((accountValue * marginUsed) / userAccount.accountValue);


        const updatedUserAccount = await userAccount.update({
          accountValue,
          guaranteeOperation,
          updatedAt: moment(new Date()).tz('America/New_York').format(),
          marginUsed,
        }, { transaction: t });

        await userAccountMovement.destroy();

        Log({userId, userAccountId: userAccountMovement.userAccountId, tableUpdated: 'userAccount', action: 'update', type:'update', snapShotBeforeAction:  snapShotAccount, snapShotAfterAction:  JSON.stringify(updatedUserAccount)})

        return res.status(200).send({
          message: 'Movimiento de la cuenta eliminado exitosamente',
        });
      });
    } catch (e) {
      return res.status(500).send(e);
    }

  },
};
