'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Time', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      projectId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Project',
          key: 'id',
          as: 'project'
        }
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
      taskId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Task',
          key: 'id',
          as: 'task'
        }
      },
      assignmentId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Assignment',
          key: 'id',
          as: 'assignment'
        }
      },
      time: {
        type: 'TIMESTAMP',
        allowNull: false,
      },
      isOverTime: {
        type: Sequelize.BOOLEAN,
      },
      notes: {
        type: Sequelize.STRING,
        allowNull: true,
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
    return queryInterface.dropTable('Time');
  },
};
