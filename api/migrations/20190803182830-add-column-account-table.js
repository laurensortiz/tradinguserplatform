'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('Account', 'associatedOperation', {
      allowNull: true,
      type: Sequelize.INTEGER,
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('Account', 'associatedOperation' );
  },
};
