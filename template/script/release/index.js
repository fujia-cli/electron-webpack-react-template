const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');

const mainBaseConfig = require('../common/webpackMainBase.js');
const renderBaseConfig = require('../common/webpackRenderBase.js');
const cwdDir = process.cwd();

const release = {
  injectEnvScript() {
    const env = require('./env.js');
    let script = '';
    for (let v in env) {
      script += `process.env.${v}="${env[v]}";`;
    }
    script += `process.env.RES_DIR = process.resourcesPath;`;
    const outFile = path.join(process.cwd(), 'release/bundled/entry.js');
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
  buildRenderer() {
    const rendererObj = this.getRendererObj();
    const config = merge(renderBaseConfig, {
      entry: rendererObj.entry,
      plugins: rendererObj.plugins,
      output: {
        filename: '[name].bundle.js',
        path: path.join(process.cwd(), 'release/bundled'),
      },
      mode: 'production',
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
        resolve();
      });
    });
  },
  buildInstaller() {
    const options = {
      config: {
        directories: {
          output: path.join(cwdDir, 'release'),
          app: path.join(cwdDir, 'release/bundled'),
        },
        files: ['**'],
        extends: null,
        productName: 'Marathon',
        appId: 'site.fujia.marathon',
        asar: true,
        extraResources: require('../common/extraResources.js'),
        win: require('../common/winConfig.js'),
        mac: require('../common/macConfig.js'),
        nsis: require('../common/nsisConfig.js'),
        publish: [{ provider: 'generic', url: '' }],
      },
      project: cwdDir,
    };
    let builder = require('electron-builder');
    return builder.build(options);
  },
  buildModule() {
    const pkgJsonPath = path.join(cwdDir, 'package.json');
    const localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
    let electronConfig = localPkgJson.devDependencies.electron.replace('^', '');
    delete localPkgJson.scripts;
    delete localPkgJson.devDependencies;

    localPkgJson.main = 'entry.js';
    localPkgJson.devDependencies = {
      electron: electronConfig,
    };

    fs.writeFileSync(path.join(cwdDir, 'release/bundled/package.json'), JSON.stringify(localPkgJson));
    fs.mkdirSync(path.join(cwdDir, 'release/bundled/node_modules'));
  },
  async start() {
    await this.buildMain();
    await this.buildRenderer();
    this.buildModule();
    this.buildInstaller();
  },
};

release.start();
