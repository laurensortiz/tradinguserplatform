module.exports = (Sequelize, DataTypes) => {
  const Account = Sequelize.define('OperationMarket', {
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

  OperationMarket.associate = models => {

    // OperationMarket.hasMany(models.User, {
    //   foreignKey: 'accountId',
    //   as: 'account',
    // });

    OperationMarket.belongsToMany(models.Operation, {
      foreignKey: 'operationId',
      as: 'operation',
    });

  };

  return OperationMarket;
};
