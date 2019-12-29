module.exports = (Sequelize, DataTypes) => {
  const Operation = Sequelize.define('Operation', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
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

  Operation.associate = models => {

    // Operation.hasMany(models.User, {
    //   foreignKey: 'roleId',
    //   as: 'role',
    // });

  };

  return Operation;
};
