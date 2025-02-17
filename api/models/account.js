module.exports = (Sequelize, DataTypes) => {
  const Account = Sequelize.define('Account', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    percentage: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      unique: false,
    },
    holdStatusCommissionAmount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      unique: false,
    },
    associatedOperation: {
      type: DataTypes.INTEGER,
      allowNull: true,
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

    Account.hasMany(models.UserAccount, {
      foreignKey: 'accountId',
      as: 'account',
    });

  };

  return Account;
};
