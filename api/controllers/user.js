import passport from 'passport'
import _ from 'lodash'
import { userQuery } from '../queries'
import { User, Role, ORM } from '../models'
import { hashPassword, salt } from '../hashPassword'
import NumberFromString from '../../common/utils/number-from-string'

const getFirstWord = (str) => str.trim().toLowerCase().split(' ')[0]

const getFirstLetter = (str) => str.trim().toLowerCase().charAt(0)

const getComposedUsername = (firstName, lastName) => {
  const firstLetterFromName = getFirstLetter(firstName)
  const firstLastName = getFirstWord(lastName)
  return `${firstLetterFromName}${firstLastName}`
}

const getUserProps = (user) => {
  const isAdmin = user.roleId === 1
  return {
    isAdmin,
    ...user,
  }
}

module.exports = {
  async create(req, res) {
    const currentUser = _.get(req, 'user', {})
    try {
      const firstName = req.body.firstName
      const lastName = req.body.lastName
      const firstName2 = _.get(req, 'body.firstName2', '')
      const lastName2 = _.get(req, 'body.lastName2', '')
      const firstName3 = _.get(req, 'body.firstName3', '')
      const lastName3 = _.get(req, 'body.lastName3', '')
      const firstName4 = _.get(req, 'body.firstName4', '')
      const lastName4 = _.get(req, 'body.lastName4', '')
      const firstName5 = _.get(req, 'body.firstName5', '')
      const lastName5 = _.get(req, 'body.lastName5', '')
      const firstName6 = _.get(req, 'body.firstName6', '')
      const lastName6 = _.get(req, 'body.lastName6', '')
      const country = _.get(req, 'body.country', '')
      const referred = _.get(req, 'body.referred', '')
      const email = req.body.email
      const startDate = req.body.startDate
      const signDate = req.body.signDate
      const phoneNumber = req.body.phoneNumber
      const roleId = req.body.roleId
      const status = req.body.status || 1
      const createdByUsername = currentUser.username
      const createdByUserId = currentUser.id

      const isAdmin = roleId === 1

      await ORM.transaction(async (t) => {
        const lastRegisteredUsername = await User.findAll(
          {
            where: {
              roleId: 2,
            },
            limit: 1,
            attributes: ['username', 'userID'],
            order: [['createdAt', 'DESC']],
            silence: true,
          },
          { transaction: t }
        )

        const lastUsernameConsecutive = NumberFromString(lastRegisteredUsername[0].username)
        const lastUserIDConsecutive = NumberFromString(lastRegisteredUsername[0].userID)
        const composedUsername = getComposedUsername(firstName, lastName)
        const username = isAdmin
          ? composedUsername
          : `${composedUsername}${Number(lastUsernameConsecutive) + 1}`
        const userID = isAdmin
          ? ''
          : `${Number(lastUserIDConsecutive) + 1}-${getFirstWord(
              firstName
            ).toUpperCase()}${getFirstWord(lastName).toUpperCase()}`
        const password = isAdmin ? 'w3btr4d3r' : `${composedUsername}@${new Date().getFullYear()}` // eg. jperez@2021

        const user = await User.create(
          {
            username: username.toLowerCase(),
            email,
            userID,
            firstName,
            lastName,
            firstName2,
            lastName2,
            firstName3,
            lastName3,
            firstName4,
            lastName4,
            firstName5,
            lastName5,
            firstName6,
            lastName6,
            country,
            referred,
            salt,
            password: hashPassword(password),
            startDate,
            signDate,
            roleId,
            phoneNumber,
            status,
            createdByUsername,
            createdByUserId,
          },
          { transaction: t }
        )

        return res.status(200).send(user)
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  auth(req, res) {
    return passport.authenticate('local', (err, user, info) => {
      if (err) {
        return res.status(500).send({
          message: '500: Authentication failed, try again.',
        })
      }

      if (!user) {
        return res.status(404).send({
          message: '404: Authentication failed, try again.',
        })
      }

      req.login(user, (err) => {
        if (!err) {
          res.status(200).send(getUserProps(user))
        }
      })
    })(req, res)
  },

  logout(req, res) {
    req.logout()
    return res.status(200).send({
      message: 'Deslogueo exitoso',
    })
  },

  async list(req, res) {
    try {
      const users = await User.findAll(userQuery.list({ req, Role }))

      return res.status(200).send(users)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async get(req, res) {
    try {
      const user = await User.findByPk(userQuery.get({ req, Role }))

      if (!user) {
        return res.status(404).send({
          message: '404 on user get',
        })
      }
      return res.status(200).send(user)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async update(req, res) {
    const user = await User.findByPk(req.params.id)

    if (!user) {
      return res.status(404).send({
        message: '404 no user on update',
      })
    }

    try {
      const updatedUser = await user.update({
        email: req.body.email || user.email,
        firstName: req.body.firstName || user.firstName,
        lastName: req.body.lastName || user.lastName,
        firstName2: req.body.firstName2,
        lastName2: req.body.lastName2,
        firstName3: req.body.firstName3,
        lastName3: req.body.lastName3,
        firstName4: req.body.firstName4,
        lastName4: req.body.lastName4,
        firstName5: req.body.firstName5,
        lastName5: req.body.lastName5,
        firstName6: req.body.firstName6,
        lastName6: req.body.lastName6,
        country: req.body.country || user.country,
        referred: req.body.referred || user.referred,
        userID: req.body.userID || user.userID,
        startDate: req.body.startDate || user.startDate,
        signDate: req.body.signDate || user.signDate,
        endDate: req.body.endDate || user.endDate,
        roleId: req.body.roleId || user.roleId,
        status: req.body.status || user.status,
        createdByUsername: req.body.createdByUsername || user.createdByUsername,
        createdByUserId: req.body.createdByUserId || user.createdByUserId,
        phoneNumber: req.body.phoneNumber || user.phoneNumber,
        password: req.body.password ? hashPassword(req.body.password) : user.password,
        salt: req.body.password ? salt : user.salt,
      })

      return res.status(200).send(updatedUser)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async delete(req, res) {
    try {
      const user = await User.findByPk(req.params.id)

      if (!user) {
        return res.status(403).send({
          message: 'Forbidden: User Not Found',
        })
      }
      /*
       * TODO: Verify if is the current user logged
       * */
      //req.logout();

      //await user.destroy();
      /*
      Handled deletion by status instead of deleting in order
      to keep it on db
       */
      await user.update({
        status: 0,
      })

      return res.status(200).send({
        message: 'Usuario eliminado exitosamente',
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },
}
