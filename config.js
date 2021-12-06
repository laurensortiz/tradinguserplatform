if (process.env.NODE_ENV !== 'production') {
  require('now-env')
}

const Sequelize = require('sequelize')

module.exports = {
  development: {
    username: 'webtrader_user',
    password: 'w3bTr4d3r!@#',
    database: 'webtrader_db',
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
    define: {
      //prevent sequelize from pluralizing table names
      freezeTableName: true,
    },
    logging: false,
    timezone: '-06:00',
  },
  stage: {
    username: process.env.DB_STAGE_USERNAME,
    password: process.env.DB_STAGE_PASSWORD,
    database: process.env.DB_STAGE_DATABASE,
    host: process.env.DB_STAGE_HOST,
    port: process.env.exit,
    dialect: 'postgres',
    dialectOptions: {
      ssl: true,
    },
    define: {
      //prevent sequelize from pluralizing table names
      freezeTableName: true,
    },
    logging: true,
    timezone: '-06:00',
  },
  production: {
    username: process.env.DB_PRODUCTION_USERNAME,
    password: process.env.DB_PRODUCTION_PASSWORD,
    database: process.env.DB_PRODUCTION_DATABASE,
    host: process.env.DB_PRODUCTION_HOST,
    port: process.env.DB_PRODUCTION_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: true,
    },
    define: {
      //prevent sequelize from pluralizing table names
      freezeTableName: true,
    },
    pool: {
      acquire: process.env.DB_POOL_ACQUIRE || 60000,
    },
    logging: false,
    timezone: '-06:00',
  },
  /**
   * Heroku config
   */
  // production: {
  //   username: process.env.DB_PRODUCTION_USERNAME,
  //   password: process.env.DB_PRODUCTION_PASSWORD,
  //   database: process.env.DB_PRODUCTION_DATABASE,
  //   host: process.env.DB_PRODUCTION_HOST,
  //   port: process.env.DB_PRODUCTION_PORT,
  //   dialect: 'postgres',
  //   dialectOptions: {
  //     ssl: true,
  //   },
  //   define: {
  //     //prevent sequelize from pluralizing table names
  //     freezeTableName: true
  //   },
  // },
  session: {
    secret: process.env.PRODUCTION_SECRET || 'placeholdersecret',
  },
}
