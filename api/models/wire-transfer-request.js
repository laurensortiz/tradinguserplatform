import moment from 'moment-timezone'

module.exports = (Sequelize, DataTypes) => {
  const WireTransferRequest = Sequelize.define(
    'WireTransferRequest',
    {
      currencyType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      accountRCM: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
      },
      commissionsCharge: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
      },
      commissionsReferenceDetail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      beneficiaryPersonAccountNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      beneficiaryPersonFirstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      beneficiaryPersonLastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      beneficiaryPersonAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      beneficiaryBankName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      beneficiaryBankSwift: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      beneficiaryBankABA: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      beneficiaryBankAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      intermediaryBankName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      intermediaryBankSwift: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      intermediaryBankABA: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      intermediaryBankAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      intermediaryBankAccountInterBank: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      transferMethod: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      accountWithdrawalRequest: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      beneficiaryPersonID: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      associatedOperation: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: true,
        type: DataTypes.DATE,
        get() {
          return moment.tz(this.getDataValue('createdAt'), 'America/New_York').format()
        },
      },
      updatedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      closedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
    },
    {
      timestamps: false,
    }
  )
  WireTransferRequest.associate = (models) => {
    WireTransferRequest.belongsTo(models.UserAccount, {
      foreignKey: 'userAccountId',
      as: 'userAccount',
    })
  }

  return WireTransferRequest
}
