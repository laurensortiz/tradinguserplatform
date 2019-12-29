module.exports = (Sequelize, DataTypes) => {
  const Role = Sequelize.define('Role', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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

  Role.associate = models => {

    Role.hasMany(models.User, {
      foreignKey: 'roleId',
      as: 'role',
    });

  };

  return Role;
};
