module.exports = (Sequelize, DataTypes) => {
  const UserAccount = Sequelize.define('UserAccount', {
    accountValue: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      unique: true,
    },
    guaranteeOperation: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
    },
    guaranteeCredits: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
    },
    balanceInitial: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
    },
    balanceFinal: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
    },
    maintenanceMargin: {
      type: DataTypes.DECIMAL(10,2),
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
