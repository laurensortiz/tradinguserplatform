import moment from "moment-timezone";

module.exports = (Sequelize, DataTypes) => {
  const InvestmentOperation = Sequelize.define('InvestmentOperation', {
    operationType: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
      get() {
        return moment.tz(this.getDataValue('startDate'), 'America/New_York').format();
      }
    },
    endDate: {
      allowNull: true,
      type: DataTypes.DATE,
      get() {
        return moment.tz(this.getDataValue('endDate'), 'America/New_York').format();
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    initialAmount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      get() {
        return moment.tz(this.getDataValue('createdAt'), 'America/New_York').format('DD-MM-YYYY');
      }
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
  },{
    timestamps: false,
  } );

  InvestmentOperation.associate = models => {

    InvestmentOperation.belongsTo(models.UserAccount, {
      foreignKey: 'userAccountId',
      as: 'userAccount',
    });

    InvestmentOperation.hasMany(models.InvestmentMovement, {
      foreignKey: 'investmentOperationId',
      as: 'investmentOperation',
    });

  };

  return InvestmentOperation;
};
