'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('UserAccount', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'User',
          key: 'id',
          as: 'user'
        }
      },
      accountId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Account',
          key: 'id',
          as: 'account'
        }
      },
      accountValue: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false,
      },
      guaranteeOperation: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false,
      },
      guaranteeCredits: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false,
      },
      balanceInitial: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false,
      },
      balanceFinal: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false,
      },
      maintenanceMargin: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false,
      },
      status: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('UserAccount');
  },
};
