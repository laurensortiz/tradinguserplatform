const hashPassword = require( '../hashPassword' ).hashPassword;
const salt = require( '../hashPassword' ).salt;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert( 'User', [
      {
        username: 'admin',
        firstName: 'Admin',
        lastName: 'Admin',
        userID: '122223333',
        email: 'admin@mailinator.com',
        password: hashPassword( 'admin123' ),
        salt: salt,
        status: 1,
        accountId: 1,
        phoneNumber: '22334455',
        roleId: 1,
        startDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'user-001',
        firstName: 'Usuario Nombre',
        lastName: 'Usuario Apellido',
        userID: '233445566',
        email: 'user001@mailinator.com',
        password: hashPassword( 'user123' ),
        salt: salt,
        status: 1,
        accountId: 2,
        phoneNumber: '33445566',
        roleId: 2,
        startDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {} );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete( 'User', null, {} );
  }
};
