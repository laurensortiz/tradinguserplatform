'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('UserAccount', 'marginUsed', {
      allowNull: true,
      type: Sequelize.DECIMAL(10,2),
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('UserAccount', 'marginUsed' );
  },
};
