module.exports = (Sequelize, DataTypes) => {
  const Product = Sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
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
  })

  Product.associate = (models) => {
    Product.hasMany(models.MarketOperation, {
      foreignKey: 'productId',
      as: 'product',
    })
  }

  return Product
}
