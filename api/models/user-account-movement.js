import moment from "moment-timezone";

module.exports = (Sequelize, DataTypes) => {
  const UserAccountMovement = Sequelize.define( 'UserAccountMovement', {
      debit: {
        type: DataTypes.DECIMAL( 10, 2 ),
        allowNull: true,
        unique: false,
      },
      credit: {
        type: DataTypes.DECIMAL( 10, 2 ),
        allowNull: true,
        unique: false,
      },
      accountValue: {
        type: DataTypes.DECIMAL( 10, 2 ),
        allowNull: true,
        unique: false,
      },
      previousAccountValue: {
        type: DataTypes.DECIMAL( 10, 2 ),
        allowNull: true,
        unique: false,
      },
      reference: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
      },
      createdAt: {
        allowNull: true,
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

  UserAccountMovement.associate = models => {

    UserAccountMovement.belongsTo( models.UserAccount, {
      foreignKey: 'userAccountId',
      as: 'userAccount',
    } );

  };

  return UserAccountMovement;
};
