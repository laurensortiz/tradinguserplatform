module.exports = (Sequelize, DataTypes) => {
  const UserAccount = Sequelize.define('UserAccount', {
    accountValue: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      unique: true,
      defaultValue: 0
    },
    guaranteeOperation: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0
    },
    guaranteeCredits: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0
    },
    balanceInitial: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0
    },
    balanceFinal: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0
    },
    maintenanceMargin: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0
    },
    createdAt: {
      allowNull: true,
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
