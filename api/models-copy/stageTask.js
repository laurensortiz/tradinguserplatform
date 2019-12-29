'use strict';
module.exports = (sequelize, DataTypes) => {
  const StageTask = sequelize.define('StageTasks', {
    stageId: DataTypes.INTEGER,
    taskId: DataTypes.INTEGER,
    scopeId: DataTypes.INTEGER
  }, {});

  StageTask.associate = models => {
    StageTask.belongsTo(models.Stage, {
      foreignKey: 'stageId',
      as: 'stage',
    });

    StageTask.belongsTo(models.Task, {
      foreignKey: 'taskId',
      as: 'task',
    });

    StageTask.belongsTo(models.Scope, {
      foreignKey: 'scopeId',
      as: 'scope',
    });
  };

  StageTask.removeAttribute('id');

  return StageTask;
};