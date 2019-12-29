module.exports = (Sequelize, DataTypes) => {
  const Scope = Sequelize.define('Scope', {
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

  Scope.associate = models => {

    Scope.hasMany(models.Project, {
      foreignKey: 'scopeId',
      as: 'scope',
    });


  };

  return Scope;
};
