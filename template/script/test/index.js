const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const spectron = require('spectron');

const mainBaseConfig = require('../common/webpackMainBase.js');
const renderBaseConfig = require('../common/webpackRenderBase.js');
const cwdDir = process.cwd();

const test = {
  server: null,
  serverPort: 1600,
  electronProcess: null,
  injectEnvScript() {
    const env = require('./env.js');
    env.WEB_PORT = this.serverPort;
    env.RES_DIR = path.join(cwdDir, 'resource/release');
    let script = '';
    for (let v in env) {
      script += `process.env.${v}="${env[v]}";`;
    }
    const outFile = path.join(cwdDir, 'release/bundled/entry.js');
    const js = `${script}${fs.readFileSync(outFile)}`;
    fs.writeFileSync(outFile, js);
  },
  buildMain() {
    const config = merge(mainBaseConfig, {
      mode: 'production',
      entry: path.join(cwdDir, './src/main/app.ts'),
      output: {
        filename: 'entry.js',
        path: path.join(cwdDir, 'release/bundled'),
      },
      plugins: [new CleanWebpackPlugin()],
    });

    return new Promise((resolve, reject) => {
      webpack(config).run((err, stats) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }

        if (stats.hasErrors()) {
          reject(stats);
          return;
        }

        this.injectEnvScript();
        resolve();
      });
    });
  },
  getRendererObj() {
    const result = {
      entry: {},
      plugins: [],
    };

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
        })
      );
    }

    return result;
  },
  async createElectronProcess() {
    const app = new spectron.Application({
      path: require('electron').toString(),
      args: [path.join(cwdDir, 'release/bundled/entry.js')],
      workingDirectory: cwdDir,
    });

    await app.start();
    return app;
  },
  startServer() {
    const rendererObj = this.getRendererObj();
    const config = merge(renderBaseConfig, {
      entry: rendererObj.entry,
      output: {
        filename: '[name].[chunkhash:8].js',
        path: path.join(cwdDir, 'release/bundled'),
      },
      mode: 'development',
      plugins: rendererObj.plugins,
    });

    const devServerConfig = {
      logLevel: 'silent',
      clientLogLevel: 'silent',
      contentBase: path.join(cwdDir, 'release/bundled'),
      port: this.serverPort,
      // after: async (app, server, compiler) => {
      //   await this.createElectronProcess();
      // },
    };
    const compiler = webpack(config);
    this.server = new WebpackDevServer(compiler, devServerConfig);
    this.server.listen(this.serverPort);
  },
  async start() {
    await this.buildMain();
    this.startServer();
    const app = await this.createElectronProcess();

    return app;
  },
};

module.exports = test;
