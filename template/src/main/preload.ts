import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type CallbackFunc = (...args: unknown[]) => void;

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    on(channel: string, func: CallbackFunc) {
      const validChannels = ['ipc-example'];

      if (validChannels.includes(channel)) {
        const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args);

        // Deliberately strip event as it includes `sender`(译：刻意去除event，由于它包含"sender")
        ipcRenderer.on(channel, subscription);

        return () => ipcRenderer.removeListener(channel, subscription);
      }

      return;
    },
    once(channel: string, func: CallbackFunc) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (_event, ...args) => func(...args));
      }
    },
  },
  store: {
    get(val: any) {
      return ipcRenderer.sendSync('store-get', val);
    },
    set(property: string, val: any) {
      ipcRenderer.send('store-set', property, val);
    },
    delete(property: string) {
      ipcRenderer.send('store-delete', property);
    },
  },
});
