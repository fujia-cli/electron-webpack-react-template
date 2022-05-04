const test = require('./index');

module.exports = async () => {
  const app = await test.start();

  return {
    rootDir: process.cwd(),
    testMatch: ['/test/**/*.js'],
    globals: {
      app,
    },
  };
};
