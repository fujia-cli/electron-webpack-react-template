const path = require('path');

if (process.platform !== 'win32') module.exports = {};
else
  module.exports = {
    perMachine: false,
    oneClick: false, // disable one-click installation
    allowElevation: true,
    allowToChangeInstallationDirectory: true,
    include: path.join(process.cwd(), 'script/common/installer.nsh'),
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: '<%= packageName %>',
    installerIcon: '../resource/unrelease/win/icon.ico',
    uninstallerIcon: '../resource/unrelease/win/icon.ico',
    installerHeader: '../resource/unrelease/win/icon.ico',
    installerHeaderIcon: '../resource/unrelease/win/icon.ico',
  };
