const bcrypt = require('bcrypt');

const salt = bcrypt.genSaltSync(10);

const hashPassword = (pass) => {
  /**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */

  return bcrypt.hashSync(pass, salt);
};

module.exports.salt = salt;
module.exports.hashPassword = hashPassword;

