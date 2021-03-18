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
    commissionByReference: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    marginUsed: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
    },
    snapShotAccount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    brokerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    guaranteeOperationNet: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
    },
    wireTransferAmount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
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

    UserAccount.hasMany(models.MarketOperation, {
      foreignKey: 'userAccountId',
      as: 'marketOperation',
    });

    UserAccount.belongsTo(models.Broker, {
      foreignKey: 'brokerId',
      as: 'broker',
    });

    UserAccount.hasMany(models.UserAccountMovement, {
      foreignKey: 'userAccountId',
      as: 'userAccountMovement',
    });

  };

  return UserAccount;
};
