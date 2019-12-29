module.exports = (Sequelize, DataTypes) => {
  const Country = Sequelize.define('Country', {
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
  });

  Country.associate = models => {

    // Country.hasMany(models.Project, {
    //   foreignKey: 'countryId',
    //   as: 'country',
    // });

  };

  return Country;
};
