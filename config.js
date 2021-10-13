if (process.env.NODE_ENV !== 'production') {
  require('now-env')
}

const Sequelize = require('sequelize')

module.exports = {
  development: {
    username: 'webtraderdb',
    password: 'bpyvc6ci68pa31kt',
    database: 'webtraderdb',
    host: 'app-c13e41e9-67ec-4ae4-bd1e-5af7780f9835-do-user-8208959-0.a.db.ondigitalocean.com',
    port: 25060,
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
