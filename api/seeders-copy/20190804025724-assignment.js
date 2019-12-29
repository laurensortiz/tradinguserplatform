'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Assignment', [
      {
        name: 'Diseño',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dibujo',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Inspección',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Administrativo',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Assignment', null, {});
  }
};
