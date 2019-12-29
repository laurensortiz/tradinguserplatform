'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Category', [
      {
        code: 'RS1',
        name: 'Residencias – 600m2',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'RS2',
        name: 'Residencias + 600m2',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'CO',
        name: 'Comercio',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'HO',
        name: 'Hospitalidad',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'SL',
        name: 'Salud',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'IN',
        name: 'Industria',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'OF',
        name: 'Oficinas',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'UM',
        name: 'Uso Mixto',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'IS',
        name: 'Institucional',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Category', null, {});
  }
};
