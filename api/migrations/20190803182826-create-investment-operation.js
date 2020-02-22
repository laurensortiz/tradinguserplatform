'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('InvestmentOperation', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      operationType: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      userAccountId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'UserAccount',
          key: 'id',
          as: 'userAccount'
        }
      },
      amount: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: true,
        unique: false,
      },
      initialAmount: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: true,
        unique: false,
      },
      status: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      endDate: {
        allowNull: true,
        type: Sequelize.DATE,
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
    return queryInterface.dropTable('InvestmentOperation');
  },
};
