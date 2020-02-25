module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert( 'Commodity', [
      {
        name: 'Stocks',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Gold',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {} );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete( 'Commodity', null, {} );
  }
};
