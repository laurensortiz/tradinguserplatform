module.exports = (Sequelize, DataTypes) => {
  const Commodity = Sequelize.define('Commodity', {
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

  Commodity.associate = models => {

    Commodity.hasMany(models.MarketOperation, {
      foreignKey: 'commodityId',
      as: 'commodity',
    });

  };

  return Commodity;
};
