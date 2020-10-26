module.exports = (Sequelize, DataTypes) => {
  const Log = Sequelize.define('Log', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tableUpdated: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userAccountId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    snapShotBeforeAction: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: false,
    },
    snapShotAfterAction: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });

  Log.associate = models => {};

  return Log;
};
