import bcrypt from 'bcrypt';
import passport from 'passport';
import _ from 'lodash';
import { userQuery } from '../queries';
import { User, Role, Account, UserAccount } from '../models';
import { hashPassword, salt } from '../hashPassword';


const isEmptyOrNull = string => {
  return !string || !string.trim();
};

const getUserProps = user => {
  const isAdmin = user.roleId === 1;
  return {
    isAdmin,
    ...user
  };
};

module.exports = {
  async create(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const username = req.body.username;
    const email = req.body.email;
    const userID = req.body.userID;
    const startDate = req.body.startDate;
    const password = req.body.password;
    const verifyPassword = req.body.verifyPassword;
    const phoneNumber = req.body.phoneNumber;
    const roleId = _.get(req, 'body.role.id', 2);
    const accountId = _.get(req, 'body.account.id', 0);
    const status = req.body.status || 1;

    if (
      isEmptyOrNull( username ) ||
      isEmptyOrNull( email ) ||
      isEmptyOrNull( password ) ||
      isEmptyOrNull( verifyPassword )
    ) {
      return res.status( 500 ).send( {
        message: 'Please fill out all fields.',
      } );
    }

    if (password !== verifyPassword) {
      return res.status( 500 ).send( {
        message: 'Your passwords do not match.',
      } );
    }

    try {
      const user = await User.create( {
        username: username.toLowerCase(),
        email,
        userID,
        firstName,
        lastName,
        salt,
        password: hashPassword(password),
        accountId,
        startDate,
        roleId,
        phoneNumber,
        status,
      } );

      return res.status( 200 ).send( user );
      // return req.login( user, err => {
      //   if (!err) {
      //     return res.status( 200 ).send( getUserProps(user) );
      //   }
      //
      //   return res.status( 500 ).send( {
      //     message: 'Auth error',
      //   } );
      // } );
    } catch (err) {
      return res.status( 500 ).send( err );
      // return res.status( 500 ).send( {
      //   message: 'Authentication failed, try again.'
      // } );
    }
  },

  auth(req, res) {
    return passport.authenticate( 'local', (err, user, info) => {
      if (err) {
        return res.status( 500 ).send( {
          message: '500: Authentication failed, try again.',
        } );
      }

      if (!user) {
        return res.status( 404 ).send( {
          message: '404: Authentication failed, try again.',
        } );
      }

      req.login( user, err => {
        if (!err) {

          res.status( 200 ).send( getUserProps(user) );
        }
      } );
    } )( req, res );
  },

  logout(req, res) {
    req.logout();
    return res.status( 200 ).send( {
      message: 'You are successfully logged out',
    } );
  },

  async list(req, res) {
    const users = await User.findAll(
      userQuery.list( { req, User, Role, Account } )
    );

    return res.status( 200 ).send( users );
  },

  async get(req, res) {
    const user = await User.findByPk(
      req.params.userId,
      userQuery.get( { req, User, Role, Account } )
    );

    if (!user) {
      return res.status( 404 ).send( {
        message: '404 on user get',
      } );
    }

    //return res.status(200).send(getUserProps(user));
    return res.status( 200 ).send( user );
  },

  async update(req, res) {

    const user = await User.findByPk( req.params.userId );
    const userAccount = await UserAccount.update( {
      accountId: _.get(req, 'body.account.id', user.accountId),
    }, {
      where: {
        userId: req.params.userId
      }
    } );

    if (!user) {
      return res.status( 404 ).send( {
        message: '404 no user on update',
      } );
    }

    const updatedUser = await user.update( {
      email: req.body.email || user.email,
      username: req.body.username || user.username,
      firstName: req.body.firstName || user.firstName,
      lastName: req.body.lastName || user.lastName,
      userID: req.body.userID || user.userID,
      startDate: req.body.startDate || user.startDate,
      endDate: req.body.endDate || user.endDate,
      roleId: _.get(req, 'body.role.id', user.roleId),
      accountId: _.get(req, 'body.account.id', user.accountId),
      status: req.body.status || user.status,
      phoneNumber: req.body.phoneNumber || user.phoneNumber,
      password: req.body.password ? hashPassword(req.body.password) : user.password,
      salt: req.body.password ? salt : user.salt
    } );

    return res.status( 200 ).send( updatedUser );
  },

  async delete(req, res) {
    const user = await User.findByPk( req.params.userId );

    if (!user) {
      return res.status( 403 ).send( {
        message: 'Forbidden: User Not Found',
      } );
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
    await user.update( {
      status: 0,
    } );

    return res.status( 200 ).send( {
      message: 'User has been deleted',
    } );
  },
};
