'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Scope', [
      {
        code: 'ACO',
        name: 'Arquitectura Completa',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'AI',
        name: 'Arquitectura Interna',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'EP',
        name: 'Especificación Acabados (tablas)',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'FF & E',
        name: 'Muebles, Accesorios y Equipos',
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
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Scope', null, {});
  }
};
