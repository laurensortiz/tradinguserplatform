import path from 'path'
import Sequelize from 'sequelize'

const db = {}
const env = process.env.NODE_ENV || 'development'
const sequelizeConfig = require(`${__dirname}/../../config.js`)[env]

const ORM = new Sequelize(
  sequelizeConfig.database,
  sequelizeConfig.username,
  sequelizeConfig.password,
  sequelizeConfig,
  {
    dialect: 'postgres',
  }
)

db.User = ORM.import(path.join(__dirname, 'user.js'))
db.Role = ORM.import(path.join(__dirname, 'role.js'))
db.Account = ORM.import(path.join(__dirname, 'account.js'))
db.Product = ORM.import(path.join(__dirname, 'product.js'))
db.Country = ORM.import(path.join(__dirname, 'country.js'))
db.Broker = ORM.import(path.join(__dirname, 'broker.js'))
db.UserAccount = ORM.import(path.join(__dirname, 'user-account.js'))
db.UserAccountMovement = ORM.import(path.join(__dirname, 'user-account-movement.js'))
db.InvestmentOperation = ORM.import(path.join(__dirname, 'investment-operation.js'))
db.InvestmentMovement = ORM.import(path.join(__dirname, 'investment-movement.js'))
db.MarketOperation = ORM.import(path.join(__dirname, 'market-operation.js'))
db.MarketMovement = ORM.import(path.join(__dirname, 'market-movement.js'))
db.Commodity = ORM.import(path.join(__dirname, 'commodity.js'))
db.AssetClass = ORM.import(path.join(__dirname, 'asset-class.js'))
db.Page = ORM.import(path.join(__dirname, 'page.js'))
db.Setting = ORM.import(path.join(__dirname, 'setting.js'))
db.Referral = ORM.import(path.join(__dirname, 'referral.js'))
db.WireTransferRequest = ORM.import(path.join(__dirname, 'wire-transfer-request.js'))
db.Log = ORM.import(path.join(__dirname, 'log.js'))
db.Lead = ORM.import(path.join(__dirname, 'lead.js'))
db.FundOperation = ORM.import(path.join(__dirname, 'fund-operation.js'))
db.FundMovement = ORM.import(path.join(__dirname, 'fund-movement.js'))
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.ORM = ORM
db.sequelize = Sequelize
db.Transaction = ORM.transaction

module.exports = db
