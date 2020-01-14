module.exports = (Sequelize, DataTypes) => {
  const OperationInvestment = Sequelize.define('OperationInvestment', {
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

  OperationInvestment.associate = models => {

    OperationInvestment.belongsTo(models.Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    OperationInvestment.hasMany(models.InvestmentMovement, {
      foreignKey: 'investmentMovementId',
      as: 'investmentMovement',
    });

  };

  return OperationInvestment;
};
