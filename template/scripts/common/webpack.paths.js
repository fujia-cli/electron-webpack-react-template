const path = require('path')

const rootPath = path.join(__dirname, '../..');

const srcPath = path.join(rootPath, 'src');
const srcMainPath = path.join(srcPath, 'main');
const srcMainEntryPath = path.join(srcMainPath, 'main.ts');
const srcMainPreloadPath = path.join(srcMainPath, 'preload.ts');
const srcRendererPath = path.join(srcPath, 'renderer');
const srcRendererPagesPath = path.join(srcRendererPath, 'pages');
const assetsIconsPath = path.join(srcRendererPath, 'assets/icons');

const releasePath = path.join(rootPath, 'release');
const releaseBundledPath = path.join(releasePath, 'bundled');
const releaseMainEntryPath = path.join(releaseBundledPath, 'main.js');
const releasePackageJsonPath = path.join(releaseBundledPath, 'package.json');
const releaseBundledNodeModulesPath = path.join(releaseBundledPath, 'node_modules');
const appPackageJsonPath = path.join(rootPath, 'package.json');

const nodeModulesPath = path.join(rootPath, 'node_modules');

module.exports = {
  rootPath,
  srcPath,
  srcMainPath,
  srcMainEntryPath,
  srcMainPreloadPath,
  srcRendererPath,
  srcRendererPagesPath,
  assetsIconsPath,
  releasePath,
  releaseBundledPath,
  releaseMainEntryPath,
  releasePackageJsonPath,
  releaseBundledNodeModulesPath,
  appPackageJsonPath,
  nodeModulesPath,
}
