module.exports = (Sequelize, DataTypes) => {
  const InvestmentOperation = Sequelize.define('InvestmentOperation', {
    operationType: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    amount: {
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

  InvestmentOperation.associate = models => {

    InvestmentOperation.belongsTo(models.UserAccount, {
      foreignKey: 'userAccountId',
      as: 'userAccount',
    });

    InvestmentOperation.hasMany(models.InvestmentMovement, {
      foreignKey: 'investmentMovementId',
      as: 'investmentMovement',
    });

  };

  return InvestmentOperation;
};
