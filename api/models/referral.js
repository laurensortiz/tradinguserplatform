module.exports = (Sequelize, DataTypes) => {
  const Referral = Sequelize.define('Referral', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    jobTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    initialAmount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0
    },
    hasBrokerGuarantee: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    brokerGuaranteeCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    personalIdDocument: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    collaboratorIB: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userAccountId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    createdAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  });
  Referral.associate = models => {

    Referral.belongsTo(models.UserAccount, {
      foreignKey: 'userAccountId',
      as: 'userAccount',
    });

  };

  return Referral;
};
