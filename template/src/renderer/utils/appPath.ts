import { ipcRenderer } from 'electron';

export const getAppPath = () => {
  return new Promise((resolve: (value: string) => void, reject: (value: Error) => void) => {
    ipcRenderer.send('get-root-path', '');
    ipcRenderer.on('reply-root-path', (_, arg: string) => {
      if (arg) {
        resolve(arg);
      } else {
        reject(new Error('the project path is not exists!'));
      }
    });
  });
};
