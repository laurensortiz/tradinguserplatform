import moment from 'moment-timezone'

module.exports = (Sequelize, DataTypes) => {
  const FundOperation = Sequelize.define(
    'FundOperation',
    {
      operationType: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
        get() {
          return moment.tz(this.getDataValue('startDate'), 'America/New_York').format()
        },
      },
      endDate: {
        allowNull: true,
        type: DataTypes.DATE,
        get() {
          return moment.tz(this.getDataValue('endDate'), 'America/New_York').format()
        },
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      initialAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        get() {
          return moment.tz(this.getDataValue('createdAt'), 'America/New_York').format('DD-MM-YYYY')
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
      expirationDate: {
        allowNull: true,
        type: DataTypes.DATE,
        get() {
          return moment.tz(this.getDataValue('expirationDate'), 'America/New_York').format()
        },
      },
    },
    {
      timestamps: false,
    }
  )

  FundOperation.associate = (models) => {
    FundOperation.belongsTo(models.UserAccount, {
      foreignKey: 'userAccountId',
      as: 'userAccount',
    })

    FundOperation.hasMany(models.FundMovement, {
      foreignKey: 'fundOperationId',
      as: 'fundOperation',
    })
  }

  return FundOperation
}
