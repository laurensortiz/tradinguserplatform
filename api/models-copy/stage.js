module.exports = (Sequelize, DataTypes) => {
  const Stage = Sequelize.define('Stage', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
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

  Stage.associate = models => {

    Stage.hasMany(models.Project, {
      foreignKey: 'stageId',
      as: 'stage',
    });


  };

  return Stage;
};
