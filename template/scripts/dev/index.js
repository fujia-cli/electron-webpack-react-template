const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');

const webpackRendererDevConfig = require('../common/webpack.config.renderer.dev');
const mainBaseConfig = require('../common/webpack.config.base');
const { checkPortInUse } = require('../common/utils');
const { releaseBundledPath, srcMainEntryPath, releaseMainEntryPath } = require('../common/webpack.paths')

const cwdDir = process.cwd();

const dev = {
  server: null,
  serverPort: 1600,
  electronProcess: null,

  /**
   * inject environments
   */
  injectEnvScript() {
    const env = require('./env.js');
    env.WEB_PORT = this.serverPort;
    env.RES_DIR = path.join(cwdDir, 'resource/release');
    let script = '';
    for (let v in env) {
      script += `process.env.${v}="${env[v]}";`;
    }
    const outFile = releaseMainEntryPath;
    const js = `${script}${fs.readFileSync(outFile)}`;
    fs.writeFileSync(outFile, js);
  },

  buildMain() {
    const config = merge(mainBaseConfig, {
      mode: 'development',
      target: 'electron-main',
      entry: srcMainEntryPath,
      output: {
        filename: '[name].js',
        path: releaseBundledPath,
      },
      // watch: true,
      plugins: [new CleanWebpackPlugin()],
    });

    return new Promise((resolve, reject) => {
      webpack(config).watch({
          // [watchOptions](/configuration/watch/#watchoptions) 示例
          aggregateTimeout: 300,
          poll: undefined
      }, (err, stats) => {
        if (err) {
          reject(err);
          return;
        }

        if (stats.hasErrors()) {
          reject(stats.toString());
          return;
        }

        this.injectEnvScript();
        resolve();
      });
    });
  },

  /**
   * create electron process
   */
  createElectronProcess() {
    // this.electronProcess = spawn(
    //   require('electron').toString(),
    //   [releaseMainEntryPath],
    //   {
    //     cwd: cwdDir,
    //   }
    // );

    // this.electronProcess.on('close', () => {
    //   this.server.close();
    //   process.exit();
    // });

    // this.electronProcess.stdout.on('data', (data) => {
    //   data = data.toString();
    //   console.log(data);
    // });

    console.log('Starting preload.js builder...');
    const preloadProcess = spawn('npm', ['run', 'start:preload'], {
      shell: true,
      stdio: 'inherit',
    })
      .on('close',  (code) => process.exit(code))
      .on('error', (spawnError) => console.error(spawnError))

    console.log('Starting Main Process...');
    // spawn('npm', ['run', 'start:main'], {
    //   shell: true,
    //   stdio: 'inherit',
    // })
    //   .on('close', (code) => {
    //     preloadProcess.kill();
    //     process.exit(code);
    //   })
    //   .on('error', (spawnError) => console.error(spawnError))

    this.electronProcess = spawn(
      'npx',
      ['electronmon', releaseMainEntryPath],
      {
        cwd: cwdDir,
      }
    );

    this.electronProcess.on('close', () => {
      preloadProcess.kill();
      this.server.close();
      process.exit();
    });

    this.electronProcess.stdout.on('data', (data) => {
      data = data.toString();
      console.log(data);
    });
  },

  /**
   * build renderer process
   */
  startServer() {
    const devServerConfig = {
      static: releaseBundledPath,
      port: this.serverPort,
      compress: true,
      hot: false,
      headers: { 'Access-Control-Allow-Origin': '*' },
      historyApiFallback: {
        verbose: true,
      },
    };

    const compiler = webpack(webpackRendererDevConfig);
    this.server = new WebpackDevServer(devServerConfig, compiler);

    this.server.start().then(() => {
      this.createElectronProcess();
    });
  },

  async start() {
    try {
      // await checkPortInUse(this.serverPort);
      await this.buildMain();
      this.startServer();
    } catch (err) {
      console.error(err);
    }
  },
};

dev.start();
