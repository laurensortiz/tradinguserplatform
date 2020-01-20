import {
  user,
  account,
  country,
  product,
  role,
  broker,
  userAccount,
  investmentOperation,
} from './controllers';

const authMiddleware = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status( 403 ).send( {
      message: 'not authenticated',
    } );
  }
};

module.exports = app => {
  app.get( '/api', (req, res) => {
    return res.status( 200 ).send( {
      message: 'Welcome',
    } );
  } );

  app.get( '/api/authenticated', (req, res) => {
    if (req.isAuthenticated()) {
      return res.status( 200 ).send( {
        isAuthenticated: true,
      } );
    }

    return res.status( 403 ).send( {
      isAuthenticated: false,
    } );
  } );

  app.post( '/api/signup', user.create );
  app.post( '/api/login', user.auth );
  app.post( '/api/logout', authMiddleware, user.logout );

  app.post( '/api/users', user.create );
  app.get( '/api/users', user.list );
  app.get( '/api/users/:userId', user.get );
  app.put( '/api/users/:userId', user.update );
  app.delete( '/api/users/:userId', user.delete );

  // Country
  app.get( '/api/countries', country.list );
  app.get( '/api/countries/:countryId', country.get );
  app.post( '/api/countries', country.create );
  app.put( '/api/countries/:countryId', country.update );
  app.delete( '/api/countries/:countryId', country.delete );

  // Role
  app.get( '/api/roles', role.list );
  app.get( '/api/roles/:roleId', role.get );
  app.post( '/api/roles', role.create );
  app.put( '/api/roles/:roleId', role.update );
  app.delete( '/api/roles/:roleId', role.delete );

  // Broker
  app.get( '/api/brokers', broker.list );
  app.get( '/api/brokers/:brokerId', broker.get );
  app.post( '/api/brokers', broker.create );
  app.put( '/api/brokers/:brokerId', broker.update );
  app.delete( '/api/brokers/:brokerId', broker.delete );

  // Product
  app.get( '/api/products', product.list );
  app.get( '/api/products/:productId', product.get );
  app.post( '/api/products', product.create );
  app.put( '/api/products/:productId', product.update );
  app.delete( '/api/products/:productId', product.delete );

  // Account
  app.get( '/api/accounts', account.list );
  app.get( '/api/accounts/:accountId', account.get );
  app.post( '/api/accounts', account.create );
  app.put( '/api/accounts/:accountId', account.update );
  app.delete( '/api/accounts/:accountId', account.delete );

  // User Account
  app.get( '/api/user-accounts', userAccount.list );
  app.get( '/api/user-accounts/:userAccountId', userAccount.get );
  app.post( '/api/user-accounts', userAccount.create );
  app.put( '/api/user-accounts/:userAccountId', userAccount.update );
  app.delete( '/api/user-accounts/:userAccountId', userAccount.delete );

  // User Account
  app.get( '/api/investment-operation', investmentOperation.list );
  app.get( '/api/investment-operation/:investmentOperationId', investmentOperation.get );
  app.post( '/api/investment-operation', investmentOperation.create );
  app.put( '/api/investment-operation/:investmentOperationId', investmentOperation.update );
  app.delete( '/api/investment-operation/:investmentOperationId', investmentOperation.delete );

};
