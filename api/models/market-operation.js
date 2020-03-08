module.exports = (Sequelize, DataTypes) => {
  const MarketOperation = Sequelize.define('MarketOperation', {
    longShort: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    commoditiesTotal: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    buyPrice: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    initialAmount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    takingProfit: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
    },
    stopLost: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    maintenanceMargin: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
    },
    orderId: {
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
    behavior: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  });

  MarketOperation.associate = models => {

    MarketOperation.belongsTo(models.UserAccount, {
      foreignKey: 'userAccountId',
      as: 'userAccount',
    });

    MarketOperation.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    });

    MarketOperation.belongsTo(models.Broker, {
      foreignKey: 'brokerId',
      as: 'broker',
    });

    MarketOperation.belongsTo(models.Commodity, {
      foreignKey: 'commodityId',
      as: 'commodity',
    });

    MarketOperation.belongsTo(models.AssetClass, {
      foreignKey: 'assetClassId',
      as: 'assetClass',
    });

    MarketOperation.hasMany(models.MarketMovement, {
      foreignKey: 'marketOperationId',
      as: 'marketOperation',
    });

  };

  return MarketOperation;

};
