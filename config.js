if (process.env.NODE_ENV !== 'production') {
  require('now-env')
}

const Sequelize = require('sequelize')

module.exports = {
  development: {
    username: 'tfjzhiafbndtul',
    password: '7f04ec2c816094490f6d7b0e7556d250b74bac716265ad1c5058799f2440a9f3',
    database: 'dc935b3fdtmj3p',
    host: 'ec2-34-196-180-38.compute-1.amazonaws.com',
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: true,
    },
    define: {
      //prevent sequelize from pluralizing table names
      freezeTableName: true,
    },
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
