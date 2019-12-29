module.exports = (Sequelize, DataTypes) => {
  const JobTitle = Sequelize.define('JobTitle', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  });

  JobTitle.associate = models => {
    JobTitle.hasMany(models.User, {
      foreignKey: 'jobTitleId',
      as: 'jobTitle',
    });
  };

  return JobTitle;
};
