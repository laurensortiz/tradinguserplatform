import moment from 'moment-timezone';
module.exports = (Sequelize, DataTypes) => {
  const InvestmentMovement = Sequelize.define( 'InvestmentMovement', {
      gpInversion: {
        type: DataTypes.DECIMAL( 10, 2 ),
        allowNull: false,
        unique: false,
      },
      gpAmount: {
        type: DataTypes.DECIMAL( 10, 2 ),
        allowNull: false,
        unique: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        get() {
          return moment.tz(this.getDataValue('createdAt'), 'America/New_York').format();
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
    },
    {
      timestamps: false,
    } );

  InvestmentMovement.associate = models => {

    InvestmentMovement.belongsTo( models.InvestmentOperation, {
      foreignKey: 'investmentOperationId',
      as: 'investmentOperation',
    } );

  };

  return InvestmentMovement;
};
