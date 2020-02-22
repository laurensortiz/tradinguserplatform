'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('InvestmentMovement', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      investmentOperationId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'InvestmentOperation',
          key: 'id',
          as: 'investmentOperation'
        }
      },
      gpInversion: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: true,
        unique: false,
      },
      gpAmount: {
        type: Sequelize.DECIMAL(10,2),
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
    return queryInterface.dropTable('InvestmentMovement');
  },
};
