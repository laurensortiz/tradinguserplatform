module.exports = (Sequelize, DataTypes) => {
  const MarketMovement = Sequelize.define('MarketMovement', {
    gpInversion: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      unique: false,
    },
    gpAmount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      unique: false,
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

  MarketMovement.associate = models => {

    MarketMovement.belongsTo(models.MarketOperation, {
      foreignKey: 'marketOperationId',
      as: 'marketOperation',
    });

  };

  return MarketMovement;
};
