module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert( 'Product', [
      {
        name: 'American Airlines Group Inc.',
        code: 'AAL',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Aaon Inc.',
        code: 'AAON',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Apple Inc.',
        code: 'AAPL',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {} );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete( 'Product', null, {} );
  }
};
