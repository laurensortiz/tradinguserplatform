module.exports = (Sequelize, DataTypes) => {
  const AssetClass = Sequelize.define('AssetClass', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  });

  AssetClass.associate = models => {

    AssetClass.hasMany(models.MarketOperation, {
      foreignKey: 'assetClassId',
      as: 'assetClass',
    });

  };

  return AssetClass;
};
