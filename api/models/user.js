module.exports = (Sequelize, DataTypes) => {
  const User = Sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName4: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName4: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName5: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName5: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName6: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName6: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referred: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdByUsername: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdByUserId: {
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
    signDate: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  })

  User.associate = (models) => {
    User.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role',
    })
  }

  return User
}
