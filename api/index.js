import {
  user,
  account,
  country,
  product,
  role,
  broker,
  userAccount,
  userAccountMovement,
  investmentOperation,
  investmentMovement,
  marketOperation,
  marketMovement,
  commodity,
  assetClass,
  page,
  setting,
  referral,
  wireTransferRequest,
  lead,
  fundOperation,
  fundMovement,
} from './controllers'

const authMiddleware = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  } else {
    return res.status(403).send({
      message: 'not authenticated',
    })
  }
}

module.exports = (app) => {
  app.get('/api', (req, res) => {
    return res.status(200).send({
      message: 'Welcome',
    })
  })

  app.get('/api/authenticated', (req, res) => {
    if (req.isAuthenticated()) {
      return res.status(200).send({
        isAuthenticated: true,
      })
    }

    return res.status(403).send({
      isAuthenticated: false,
    })
  })

  app.post('/api/signup', user.create)
  app.post('/api/login', user.auth)
  //app.post( '/api/logout', authMiddleware, user.logout );
  app.post('/api/logout', user.logout)

  app.post('/api/users', user.create)
  app.get('/api/users/list/:role/:status', user.list)
  app.get('/api/users/:id', user.get)
  app.put('/api/users/:id', user.update)
  app.delete('/api/users/:id', user.delete)

  // Country
  app.get('/api/countries', country.list)
  app.get('/api/countries/:id', country.get)
  app.post('/api/countries', country.create)
  app.put('/api/countries/:id', country.update)
  app.delete('/api/countries/:id', country.delete)

  // Role
  app.get('/api/roles', role.list)
  app.get('/api/roles/:id', role.get)
  app.post('/api/roles', role.create)
  app.put('/api/roles/:id', role.update)
  app.delete('/api/roles/:id', role.delete)

  // Page
  app.get('/api/pages', page.list)
  app.get('/api/pages/:id', page.get)
  app.post('/api/pages', page.create)
  app.put('/api/pages/:id', page.update)
  app.delete('/api/pages/:id', page.delete)

  // Broker
  app.get('/api/brokers', broker.list)
  app.get('/api/brokers/:id', broker.get)
  app.post('/api/brokers', broker.create)
  app.put('/api/brokers/:id', broker.update)
  app.delete('/api/brokers/:id', broker.delete)

  // Product
  app.get('/api/products', product.list)
  app.get('/api/products/:id', product.get)
  app.post('/api/products', product.create)
  app.put('/api/products/:id', product.update)
  app.delete('/api/products/:id', product.delete)

  // Account
  app.get('/api/accounts', account.list)
  app.get('/api/accounts/:id', account.get)
  app.post('/api/accounts', account.create)
  app.put('/api/accounts/:id', account.update)
  app.delete('/api/accounts/:id', account.delete)

  // User Account
  app.post('/api/user-accounts', userAccount.list)
  app.get('/api/user-accounts/:id', userAccount.get)
  app.post('/api/user-accounts/report', userAccount.getReport)
  app.post('/api/user-accounts/list-report', userAccount.getListReport)
  app.get('/api/user-accounts/user/:userId', userAccount.getByUser)
  app.post('/api/user-accounts/new', userAccount.create)
  app.put('/api/user-accounts/:id', userAccount.update)
  app.delete('/api/user-accounts/:id', userAccount.delete)

  app.post('/api/user-accounts/fix', userAccount.fix)

  // User Account Movement
  app.get('/api/user-account-movement/list/:id', userAccountMovement.list)
  app.get('/api/user-account-movement/:id', userAccountMovement.get)
  app.post('/api/user-account-movement', userAccountMovement.create)
  app.put('/api/user-account-movement/:id', userAccountMovement.update)
  app.delete('/api/user-account-movement/:id', userAccountMovement.delete)

  // Investment Operation
  app.get('/api/investment-operation', investmentOperation.list)
  app.get('/api/investment-operation/:id', investmentOperation.get)
  app.post('/api/investment-operation', investmentOperation.create)
  app.put('/api/investment-operation/:id', investmentOperation.update)
  app.delete('/api/investment-operation/:id', investmentOperation.delete)

  // Investment Movement
  app.get('/api/investment-movement/investment-operation/:id', investmentMovement.list)

  app.get('/api/investment-movement/:id', investmentMovement.get)
  app.post('/api/investment-movement', investmentMovement.create)
  app.put('/api/investment-movement/:id', investmentMovement.update)
  app.delete('/api/investment-movement/:id', investmentMovement.delete)

  // Fund Operation
  app.get('/api/fund-operation', fundOperation.list)
  app.get('/api/fund-operation/:id', fundOperation.get)
  app.post('/api/fund-operation', fundOperation.create)
  app.put('/api/fund-operation/:id', fundOperation.update)
  app.delete('/api/fund-operation/:id', fundOperation.delete)

  // Fund Movement
  app.get('/api/fund-movement/fund-operation/:id', fundMovement.list)

  app.get('/api/fund-movement/:id', fundMovement.get)
  app.post('/api/fund-movement', fundMovement.create)
  app.put('/api/fund-movement/:id', fundMovement.update)
  app.delete('/api/fund-movement/:id', fundMovement.delete)

  // Market Operation
  app.get('/api/market-operation', marketOperation.list)
  app.get('/api/market-operation/:id', marketOperation.get)
  app.post('/api/market-operation/accountReport', marketOperation.accountReport)
  app.post('/api/market-operation', marketOperation.create)
  app.put('/api/market-operation/:id', marketOperation.update)
  app.delete('/api/market-operation/:id', marketOperation.delete)
  app.post('/api/market-operation/bulk-update', marketOperation.bulkUpdate)

  // Market Movement
  app.get('/api/market-movement/market-operation/:id', marketMovement.list)
  app.get('/api/market-movement/:id', marketMovement.get)
  app.post('/api/market-movement', marketMovement.create)
  app.post('/api/market-movement/count', marketMovement.count)
  app.post('/api/market-movement/bulk-delete', marketMovement.bulkDelete)
  app.put('/api/market-movement/:id', marketMovement.update)
  app.delete('/api/market-movement/:id', marketMovement.delete)

  // Commodities
  app.get('/api/commodities', commodity.list)
  app.get('/api/commodities/:id', commodity.get)
  app.post('/api/commodities', commodity.create)
  app.put('/api/commodities/:id', commodity.update)
  app.delete('/api/commodities/:id', commodity.delete)

  // AssetClasses
  app.get('/api/asset-classes', assetClass.list)
  app.get('/api/asset-classes/:id', assetClass.get)
  app.post('/api/asset-classes', assetClass.create)
  app.put('/api/asset-classes/:id', assetClass.update)
  app.delete('/api/asset-classes/:id', assetClass.delete)

  // Setting
  app.get('/api/setting', setting.list)
  app.get('/api/setting/:id', setting.get)
  app.post('/api/setting', setting.create)
  app.put('/api/setting/:id', setting.update)
  app.delete('/api/setting/:id', setting.delete)

  // Referral
  app.post('/api/referral', referral.list)
  app.get('/api/referral/:id', referral.get)
  app.get('/api/referral/user-account/:userAccountId', referral.getByUserAccountId)
  app.post('/api/referral/create', referral.create)
  app.put('/api/referral/:id', referral.update)
  app.delete('/api/referral/:id', referral.delete)

  // WireTransferRequest
  app.post('/api/wire-transfer-request', wireTransferRequest.list)
  app.get('/api/wire-transfer-request/:id', wireTransferRequest.get)
  app.get(
    '/api/wire-transfer-request/user-account/:username/:associatedOperation',
    wireTransferRequest.getByUsername
  )
  app.post('/api/wire-transfer-request/create', wireTransferRequest.create)
  app.put('/api/wire-transfer-request/:id', wireTransferRequest.update)
  app.delete('/api/wire-transfer-request/:id', wireTransferRequest.delete)
  app.get('/api/wire-transfer-request/check/migration', wireTransferRequest.check)

  // Lead
  app.get('/api/leads/list/:status', lead.list)
  app.get('/api/leads/:id', lead.get)
  app.post('/api/leads', lead.create)
  app.put('/api/leads/:id', lead.update)
  app.delete('/api/leads/:id', lead.delete)
}
