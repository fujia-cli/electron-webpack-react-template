const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
// require('dotenv').config();
const webpackRendererProdConfig = require('../common/webpack.config.renderer.prod');
const mainProdConfig = require('../common/webpack.config.main.prod');
const { MAIN_PROCESS_ENTRY } = require('../common/utils');
const {
  appPackageJsonPath,
  releasePackageJsonPath,
  releaseMainEntryPath,
  releaseBundledNodeModulesPath,
} = require('../common/webpack.paths')

const cwdDir = process.cwd();

const args = process.argv.slice(2);
const isPack = args.includes('--dir');

const release = {
  injectEnvScript() {
    const env = require('./env.js');
    let script = '';

    for (let v in env) {
      script += `process.env.${v}="${env[v]}";`;
    }

    script += `process.env.RES_DIR = process.resourcesPath;`;

    const js = `${script}${fs.readFileSync(releaseMainEntryPath)}`;

    fs.writeFileSync(releaseMainEntryPath, js);
  },

  buildMain() {
    return new Promise((resolve, reject) => {
      webpack(mainProdConfig).run((err, stats) => {
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

  buildRenderer() {
    return new Promise((resolve, reject) => {
      webpack(webpackRendererProdConfig).run((err, stats) => {
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
    const builder = require('electron-builder');

    const options = {
      config: {
        directories: {
          output: path.join(cwdDir, 'release'),
          app: path.join(cwdDir, 'release/bundled'),
        },
        files: ['**'],
        extends: null,
        productName: '<%= packageName %>',
        appId: 'site.fujia.app', // the property is important, replace with you own appId
        copyright: 'Copyright © 2022 ${author}',
        asar: true,
        extraResources: require('../common/extraResources'),
        win: require('../common/winConfig'),
        nsis: require('../common/nsisConfig'),
        mac: require('../common/macConfig'),
        dmg: require('../common/dmgConfig'),
        linux: require('../common/linuxConfig'),
      },
      project: cwdDir,
      publish: {
        provider: 'github',
        repo: '',
        releaseType: 'release',
        // token: process.env.GH_TOKEN,
      },
      publish: 'always',
    };

    if (isPack) {
      options.dir = true;
    }

    builder.build(options);
  },

  buildModule() {
    const localPkgJson = JSON.parse(fs.readFileSync(appPackageJsonPath, 'utf-8'));
    let electronConfig = localPkgJson.devDependencies.electron.replace('^', '');

    delete localPkgJson.scripts;
    delete localPkgJson.devDependencies;
    delete localPkgJson.keywords;
    delete localPkgJson.commitlint;
    delete localPkgJson['lint-staged'];

    localPkgJson.main = MAIN_PROCESS_ENTRY;
    localPkgJson.devDependencies = {
      electron: electronConfig,
    };

    fs.writeFileSync(releasePackageJsonPath, JSON.stringify(localPkgJson));
    fs.mkdirSync(releaseBundledNodeModulesPath);
  },

  async start() {
    await this.buildMain();
    await this.buildRenderer();
    this.buildModule();
    this.buildInstaller();
  },
};

release.start();
