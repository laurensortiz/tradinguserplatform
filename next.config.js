/* eslint-disable */
const withSass = require('@zeit/next-sass');

// fix: prevents error when .css files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.scss'] = file => {}
}

module.exports = withSass();