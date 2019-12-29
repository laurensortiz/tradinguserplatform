module.exports = (Sequelize, DataTypes) => {
  const Account = Sequelize.define('Account', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    percentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

  Account.associate = models => {

    Account.hasMany(models.User, {
      foreignKey: 'accountId',
      as: 'account',
    });

  };

  return Account;
};
