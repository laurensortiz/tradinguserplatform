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
db.Category = ORM.import(path.join(__dirname, 'category.js'));
db.StageTask = ORM.import(path.join(__dirname, 'stageTask.js'));
db.Scope = ORM.import(path.join(__dirname, 'scope.js'));
db.Stage = ORM.import(path.join(__dirname, 'stage.js'));
db.Task = ORM.import(path.join(__dirname, 'task.js'));
db.Assignment = ORM.import(path.join(__dirname, 'assignment.js'));
db.Time = ORM.import(path.join(__dirname, 'time.js'));

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.ORM = ORM;
db.sequelize = sequelize;

module.exports = db;
