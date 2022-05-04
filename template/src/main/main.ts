/* eslint-disable @typescript-eslint/no-require-imports */
import fs from 'fs';
import path from 'path';
import { app, BrowserWindow, protocol, ipcMain, shell } from 'electron';
import EStore from 'electron-store';

import { appUpdater } from './updater';
import { MenuBuilder } from './menu';

export const eStore = new EStore();

// const ROOT_PATH = path.join(app.getAppPath(), '../..');

// Disable hardware acceleration which easy to lead to host interface jamming under Ubuntu System.
app.disableHardwareAcceleration();

// ipcMain.on('get-root-path', (event, arg) => {
//   event.reply('reply-root-path', ROOT_PATH);
// });

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      standard: true,
      supportFetchAPI: true,
      secure: true,
      corsEnabled: true,
    },
  },
]);

let mainWin: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('store-get', async (event, val) => {
  event.returnValue = eStore.get(val);
});

ipcMain.on('store-set', async (_event, key, val) => {
  eStore.set(key, val);
});

ipcMain.on('store-delete', async (_event, key) => {
  eStore.delete(key);
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development';
// console.log('isDebug', isDebug);
console.log('app.getPath', app.getPath('userData'));

if (isDebug) {
  require('electron-debug')();
}

// const installExtensions = async () => {
//   const installer = require('electron-devtools-installer');
//   const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
//   const extensions = ['REACT_DEVELOPER_TOOLS'];

//   return installer
//     .default(
//       extensions.map((name) => installer[name]),
//       forceDownload
//     )
//     .catch(console.log);
// };

const createWindow = async () => {
  // if (isDebug) {
  //   await installExtensions();
  // }
  protocol.registerBufferProtocol('app', (request, response) => {
    let pathName = new URL(request.url).pathname;
    let extension = path.extname(pathName).toLowerCase();
    if (!extension) return;

    pathName = decodeURI(pathName);

    const filePath = path.join(process.resourcesPath, 'app.asar', pathName);

    fs.readFile(filePath, (error, data) => {
      if (error) {
        console.error(error);
        return;
      }

      let mimeType = '';
      switch (extension) {
        case '.js':
          mimeType = 'text/javascript';
          break;
        case '.html':
          mimeType = 'text/html';
          break;
        case '.css':
          mimeType = 'text/css';
          break;
        case '.svg':
          mimeType = 'image/svg+xml';
          break;
        case '.json':
          mimeType = 'application/json';
          break;
        default:
          break;
      }

      response({
        mimeType,
        data,
      });
    });
  });

  mainWin = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: '../../resource/unrelease/icon.png',
    webPreferences: {
      // webSecurity: false,
      // nodeIntegration: true,
      // contextIsolation: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../release/bundled/preload.js'),
    },
  });

  if (app.isPackaged) {
    mainWin.loadURL('app://./index.html');
  } else {
    mainWin.loadURL(`http://localhost:${process.env.WEB_PORT}`);
  }

  mainWin.on('ready-to-show', () => {
    if (!mainWin) {
      throw new Error('"mainWin" is not defined');
    }

    if (process.env.START_MINIMIZED) {
      mainWin.minimize();
    } else {
      mainWin.show();
    }
  });

  mainWin.on('closed', () => {
    mainWin = null;
  });

  const menuBuilder = new MenuBuilder(mainWin);

  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWin.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  appUpdater(mainWin).checkForUpdates();
};

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWin === null) createWindow();
    });
  })
  .catch(console.log);
