import fs from 'fs';
import path from 'path';
import { app, BrowserWindow, protocol, ipcMain } from 'electron';

const ROOT_PATH = path.join(app.getAppPath(), '../..');

// Disable hardware acceleration which easy to lead to host interface jamming under Ubuntu System.
app.disableHardwareAcceleration();

ipcMain.on('get-root-path', (event, arg) => {
  event.reply('reply-root-path', ROOT_PATH);
});

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

let mainWin: BrowserWindow;

app.on('ready', () => {
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
    width: 1200,
    height: 800,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  if (app.isPackaged) {
    mainWin.loadURL('app://./index.html');
  } else {
    mainWin.loadURL(`http://localhost:${process.env.WEB_PORT}`);
  }
});
