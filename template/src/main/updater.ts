import path from 'path';
import { BrowserWindow, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import isDev from 'electron-is-dev';

autoUpdater.logger = log;

export function appUpdater(win: BrowserWindow) {
  const sendStatusToWin = (text: string, info?: any) => {
    log.info(text);
    win.webContents.send('message', text, info);
  };

  if (isDev) {
    autoUpdater.updateConfigPath = path.join(__dirname, '../../app-update-dev.yml');
  }

  // disabled auto download
  autoUpdater.autoDownload = false;

  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...');
    sendStatusToWin('Checking for update...');
  });

  autoUpdater.on('update-available', (info) => {
    sendStatusToWin('Update available.');

    dialog
      .showMessageBox({
        type: 'info',
        title: '应用更新',
        message: '发现新的版本，是否现在更新？',
        buttons: ['立即更新', '稍后再说'],
      })
      .then((isUpdate) => {
        if (isUpdate) {
          autoUpdater.downloadUpdate();
        }
      });
  });

  autoUpdater.on('update-not-available', (info) => {
    sendStatusToWin('Update not available.', info);
  });

  autoUpdater.on('error', (err) => {
    sendStatusToWin('Error in auto-updater. ' + err);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
    sendStatusToWin(log_message);
  });

  autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWin('Update downloaded');
    dialog
      .showMessageBox({
        title: '安装更新',
        message: '更新下载完成，应用将重启更新',
      })
      .then(() => {
        // autoUpdater.quitAndInstall();
      });
  });

  return autoUpdater;
}
