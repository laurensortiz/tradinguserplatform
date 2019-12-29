'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Stage', [
      {
        code: 'CD',
        name: 'Diseño Conceptual',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'SD 30%',
        name: 'Diseño Esquemático',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'DD 60%',
        name: 'Desarrollo Diseño',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'DD 90%',
        name: 'Desarrollo Diseño',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'CD 100%',
        name: 'Documentos Constructivos',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'BID',
        name: 'BID',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'Inspección',
        name: 'Inspección',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'VE',
        name: 'Reingeniería Valor',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'Oficina',
        name: 'Oficina',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'PT',
        name: 'PT',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'Administrativo',
        name: 'Administrativo',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Stage', null, {});
  }
};
