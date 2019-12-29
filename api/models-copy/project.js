module.exports = (Sequelize, DataTypes) => {
  const Project = Sequelize.define('Project', {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    countryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    stageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    scopeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    totalHoursQuoted: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    observations: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  });

  Project.associate = models => {

    Project.belongsTo(models.Stage, {
      foreignKey: 'stageId',
      as: 'stage',
    });

    Project.belongsTo(models.Scope, {
      foreignKey: 'scopeId',
      as: 'scope',
    });

    Project.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category',
    });

    Project.belongsTo(models.Country, {
      foreignKey: 'countryId',
      as: 'country',
    });
  };

  return Project;
};
