'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('MarketMovement', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      marketOperationId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'MarketOperation',
          key: 'id',
          as: 'marketOperation'
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
    return queryInterface.dropTable('MarketMovement');
  },
};
