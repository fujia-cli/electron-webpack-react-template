const path = require('path');

const resolve = (filePath, dir = __dirname) =>
  path.resolve(dir, `../../${filePath}`);

module.exports = {
  resolve,
};
