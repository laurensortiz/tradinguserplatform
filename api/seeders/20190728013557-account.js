'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Account', [
      {
        name: 'Micro',
        percentage: 20,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Classic',
        percentage: 15,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Gold',
        percentage: 10,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'PM',
        percentage: 5,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },

    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Account', null, {});
  }
};
