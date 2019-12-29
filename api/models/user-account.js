module.exports = (Sequelize, DataTypes) => {
  const UserAccount = Sequelize.define('UserAccount', {
    accountValue: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    guaranteeOperation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    guaranteeCredits: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balanceInitial: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balanceFinal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maintenanceMargin: {
      type: DataTypes.STRING,
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

  UserAccount.associate = models => {

    UserAccount.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    UserAccount.belongsTo(models.Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

  };

  return UserAccount;
};
