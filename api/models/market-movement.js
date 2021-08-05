import moment from 'moment-timezone'

module.exports = (Sequelize, DataTypes) => {
  const MarketMovement = Sequelize.define(
    'MarketMovement',
    {
      gpInversion: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: true,
        unique: false,
      },
      gpAmount: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        unique: false,
      },
      marketPrice: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: true,
        unique: false,
      },
      createdAt: {
        allowNull: true,
        type: DataTypes.DATE,
        get() {
          return moment
            .tz(this.getDataValue('createdAt'), 'America/New_York')
            .format('YYYY-MM-DD HH:mm:ss')
        },
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
    },
    {
      timestamps: false,
    }
  )

  MarketMovement.associate = (models) => {
    MarketMovement.belongsTo(models.MarketOperation, {
      foreignKey: 'marketOperationId',
      as: 'marketOperation',
    })
  }

  return MarketMovement
}
