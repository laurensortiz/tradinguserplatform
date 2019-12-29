module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert( 'Broker', [
      {
        name: 'Roberto M.',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {} );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete( 'Broker', null, {} );
  }
};
