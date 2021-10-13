import moment from 'moment-timezone'
module.exports = (Sequelize, DataTypes) => {
  const FundMovement = Sequelize.define(
    'FundMovement',
    {
      gpInversion: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        unique: false,
      },
      gpAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        unique: false,
      },
      percentage: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        unique: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        get() {
          return moment.tz(this.getDataValue('createdAt'), 'America/New_York').format()
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

  FundMovement.associate = (models) => {
    FundMovement.belongsTo(models.FundOperation, {
      foreignKey: 'fundOperationId',
      as: 'fundOperation',
    })
  }

  return FundMovement
}
