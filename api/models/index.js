import path from 'path';
import sequelize from 'sequelize';

const db = {};
const env = process.env.NODE_ENV || 'development';
const sequelizeConfig = require(`${__dirname}/../../config.js`)[env];

const ORM = new sequelize(
  sequelizeConfig.database,
  sequelizeConfig.username,
  sequelizeConfig.password,
  sequelizeConfig,
)


db.User = ORM.import(path.join(__dirname, 'user.js'));
db.Role = ORM.import(path.join(__dirname, 'role.js'));
db.Account = ORM.import(path.join(__dirname, 'account.js'));
db.Product = ORM.import(path.join(__dirname, 'product.js'));
db.Country = ORM.import(path.join(__dirname, 'country.js'));
db.Broker = ORM.import(path.join(__dirname, 'broker.js'));
db.UserAccount = ORM.import(path.join(__dirname, 'user-account.js'));
db.InvestmentOperation = ORM.import(path.join(__dirname, 'investment-operation.js'));
db.InvestmentMovement = ORM.import(path.join(__dirname, 'investment-movement.js'));

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.ORM = ORM;
db.sequelize = sequelize;

module.exports = db;
