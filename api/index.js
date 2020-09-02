import {
  user,
  account,
  country,
  product,
  role,
  broker,
  userAccount,
  investmentOperation,
  investmentMovement,
  marketOperation,
  marketMovement,
  commodity,
  assetClass,
  page,
  setting,
  referral,
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
  //app.post( '/api/logout', authMiddleware, user.logout );
  app.post( '/api/logout', user.logout );

  app.post( '/api/users/new', user.create );
  app.post( '/api/users', user.list );
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

  // Page
  app.get( '/api/pages', page.list );
  app.get( '/api/pages/:pageId', page.get );
  app.post( '/api/pages', page.create );
  app.put( '/api/pages/:pageId', page.update );
  app.delete( '/api/pages/:pageId', page.delete );

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
  app.post( '/api/user-accounts', userAccount.list );
  app.get( '/api/user-accounts/:userAccountId', userAccount.get );
  app.post( '/api/user-accounts/report', userAccount.getReport );
  app.get( '/api/user-accounts/user/:userId', userAccount.getByUser );
  app.post( '/api/user-accounts/new', userAccount.create );
  app.put( '/api/user-accounts/:userAccountId', userAccount.update );
  app.delete( '/api/user-accounts/:userAccountId', userAccount.delete );

  // Investment Operation
  app.get( '/api/investment-operation', investmentOperation.list );
  app.get( '/api/investment-operation/:investmentOperationId', investmentOperation.get );
  app.post( '/api/investment-operation', investmentOperation.create );
  app.put( '/api/investment-operation/:investmentOperationId', investmentOperation.update );
  app.delete( '/api/investment-operation/:investmentOperationId', investmentOperation.delete );

  // Investment Movement
  app.get( '/api/investment-movement/list/:investmentOperationId', investmentMovement.list );

  app.get( '/api/investment-movement/:investmentMovementId', investmentMovement.get );
  app.post( '/api/investment-movement', investmentMovement.create );
  app.put( '/api/investment-movement/:investmentMovementId', investmentMovement.update );
  app.delete( '/api/investment-movement/:investmentMovementId', investmentMovement.delete );

  // Market Operation
  app.get( '/api/market-operation/:status', marketOperation.list );
  app.post( '/api/market-operation/accountReport', marketOperation.accountReport );
  app.get( '/api/market-operation/:marketOperationId', marketOperation.get );
  app.post( '/api/market-operation', marketOperation.create );
  app.put( '/api/market-operation/:marketOperationId', marketOperation.update );
  app.delete( '/api/market-operation/:marketOperationId', marketOperation.delete );
  app.post( '/api/market-operation/bulk-update', marketOperation.bulkUpdate );

  // Market Movement
  app.get( '/api/market-movement/list/:marketOperationId', marketMovement.list );

  app.get( '/api/market-movement/:marketMovementId', marketMovement.get );
  app.post( '/api/market-movement', marketMovement.create );
  app.put( '/api/market-movement/:marketMovementId', marketMovement.update );
  app.delete( '/api/market-movement/:marketMovementId', marketMovement.delete );

  // Commodities
  app.get( '/api/commodities', commodity.list );
  app.get( '/api/commodities/:commodityId', commodity.get );
  app.post( '/api/commodities', commodity.create );
  app.put( '/api/commodities/:commodityId', commodity.update );
  app.delete( '/api/commodities/:commodityId', commodity.delete );

  // AssetClasses
  app.get( '/api/asset-classes', assetClass.list );
  app.get( '/api/asset-classes/:assetClassId', assetClass.get );
  app.post( '/api/asset-classes', assetClass.create );
  app.put( '/api/asset-classes/:assetClassId', assetClass.update );
  app.delete( '/api/asset-classes/:assetClassId', assetClass.delete );

  // Setting
  app.get( '/api/setting', setting.list );
  app.get( '/api/setting/:settingId', setting.get );
  app.post( '/api/setting', setting.create );
  app.put( '/api/setting/:settingId', setting.update );
  app.delete( '/api/setting/:settingId', setting.delete );

  // Referral
  app.get( '/api/referral', referral.list );
  app.get( '/api/referral/:referralId', referral.get );
  app.get( '/api/referral/user-account/:userAccountId', referral.getByUserAccountId );
  app.post( '/api/referral', referral.create );
  app.put( '/api/referral/:referralId', referral.update );
  app.delete( '/api/referral/:referralId', referral.delete );

};
