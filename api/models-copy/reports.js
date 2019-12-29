module.exports = (Sequelize, DataTypes) => {
  const Reports = Sequelize.define('Reports', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      // validate: {
      //   is: /^[a-z0-9\_\-]+$/i,
      // },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: true,
      type: Sequelize.DATE,
    },
    deletedAt: {
      allowNull: true,
      type: Sequelize.DATE,
    },
  });

  // Reports.associate = models => {
  //   Reports.hasMany(models.Post, {
  //     foreignKey: 'userId',
  //     as: 'posts',
  //     onDelete: 'CASCADE',
  //   });
  //
  //   Reports.hasMany(models.Comment, {
  //     foreignKey: 'userId',
  //     as: 'comments',
  //     onDelete: 'CASCADE',
  //   });
  // };

  return Reports;
};
