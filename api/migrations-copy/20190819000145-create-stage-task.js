'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('StageTasks', {
      stageId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Stage',
          key: 'id',
          as: 'stage'
        }
      },
      taskId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Task',
          key: 'id',
          as: 'task'
        }
      },
      scopeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Scope',
          key: 'id',
          as: 'scope'
        }
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('StageTasks');
  }
};