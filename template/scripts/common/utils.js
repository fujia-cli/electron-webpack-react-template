const path = require('path');
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const chalk = require('chalk')
const detectPort = require('detect-port')

const MAIN_PROCESS_ENTRY = 'main.js';

const resolve = (filePath, dir = __dirname) => path.resolve(dir, `../../${filePath}`);

function getRendererObj() {
  const result = {
    entry: {},
    plugins: [],
  };
  const cwdDir = process.cwd();

  const rendererPath = path.join(cwdDir, 'src/renderer/pages');
  const rendererFiles = fs.readdirSync(rendererPath);

  for (const fileName of rendererFiles) {
    if (!fileName.endsWith('.html')) continue;

    const plainName = path.basename(fileName, '.html');
    if (plainName === 'index') {
      result.entry[plainName] = `/src/renderer/pages/index.tsx`;
    } else {
      result.entry[plainName] = `/src/renderer/pages/${plainName}/index.tsx`;
    }

    result.plugins.push(
      new HtmlWebpackPlugin({
        chunks: [plainName],
        template: path.join(cwdDir, `/src/renderer/pages/${plainName}.html`),
        filename: path.join(cwdDir, `/release/bundled/${plainName}.html`),
        minify: true,
        // isBrowser: false,
        // isDevelopment: process.env.NODE_ENV !== 'production',
      })
    );
  }

  return result;
}

async function checkPortInUse(port) {
  console.log(chalk.gray(`Checking the ${port} available...`));
  console.log();

  await detectPort(port, (err, availablePort) => {
    if (port !== String(availablePort)) {
      throw new Error(
        chalk.whiteBright.bgRed.bold(
          `Port "${port}" on "localhost" is already in use. Please use another port.`
        )
      );
    } else {
      process.exit(0);
    }
  })
}

module.exports = {
  resolve,
  getRendererObj,
  checkPortInUse,
  MAIN_PROCESS_ENTRY,
};
