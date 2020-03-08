'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('MarketOperation', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      longShort: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      commoditiesTotal: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      buyPrice: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
      },
      initialAmount: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
      },
      takingProfit: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: true,
      },
      stopLost: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      maintenanceMargin: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
      productId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Product',
          key: 'id',
          as: 'product'
        }
      },
      brokerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Broker',
          key: 'id',
          as: 'broker'
        }
      },
      commodityId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Commodity',
          key: 'id',
          as: 'commodity'
        }
      },
      assetClassId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'AssetClass',
          key: 'id',
          as: 'assetClass'
        }
      },
      amount: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: true,
        unique: false,
      },

      status: {
        allowNull: false,
        type: Sequelize.INTEGER,
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
      behavior: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('MarketOperation');
  },
};
