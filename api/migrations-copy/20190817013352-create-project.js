'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Project', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      startDate: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      endDate: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      totalHoursQuoted: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      observations: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      stageId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Stage',
          key: 'id',
          as: 'stage'
        }
      },
      countryId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Country',
          key: 'id',
          as: 'country'
        }
      },
      scopeId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Scope',
          key: 'id',
          as: 'scope'
        }
      },
      categoryId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Category',
          key: 'id',
          as: 'category'
        }
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
    return queryInterface.dropTable('Project');
  },
};
