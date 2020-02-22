module.exports = (Sequelize, DataTypes) => {
  const Broker = Sequelize.define('Broker', {
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

  Broker.associate = models => {

    Broker.hasMany(models.MarketOperation, {
      foreignKey: 'brokerId',
      as: 'broker',
    });

  };

  return Broker;
};
