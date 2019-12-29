module.exports = (Sequelize, DataTypes) => {
  const Time = Sequelize.define('Time', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    assignmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    time: {
      type: 'TIMESTAMP',
      allowNull: true,
      defaultValue: '00:00',
    },
    isOverTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  });

  Time.associate = models => {

    Time.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Time.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project',
    });
    Time.belongsTo(models.Stage, {
      foreignKey: 'stageId',
      as: 'stage',
    });
    Time.belongsTo(models.Task, {
      foreignKey: 'taskId',
      as: 'task',
    });
    Time.belongsTo(models.Assignment, {
      foreignKey: 'assignmentId',
      as: 'assignment',
    });

  };

  return Time;
};
