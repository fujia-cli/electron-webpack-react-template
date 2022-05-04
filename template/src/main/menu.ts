/* eslint-disable indent */
import { app, Menu, shell, BrowserWindow, MenuItemConstructorOptions } from 'electron';
import isDev from 'electron-is-dev';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export class MenuBuilder {
  mainWin: BrowserWindow;

  constructor(mainWin: BrowserWindow) {
    this.mainWin = mainWin;
  }

  buildMenu(): Menu {
    if (isDev) {
      this.setupDevelopmentEnvironment();
    }

    const template = process.platform === 'darwin' ? this.buildDarwinTemplate() : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);

    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment() {
    this.mainWin.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: '检查',
          click: () => {
            this.mainWin.webContents.inspectElement(x, y);
          },
        },
      ]).popup({
        window: this.mainWin,
      });
    });
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: '<%= packageName %>',
      submenu: [
        {
          label: '关于 <%= packageName %>',
          selector: 'orderFrontStandardAboutPanel:',
        },
        {
          type: 'separator',
        },
        {
          label: '服务',
          submenu: [],
        },
        {
          type: 'separator',
        },
        {
          label: '隐藏 <%= packageName %>',
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          label: '隐藏其它',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:',
        },
        {
          label: '全部显示',
          selector: 'unhideAllApplications:',
        },
        {
          type: 'separator',
        },
        {
          label: '退出 <%= packageName %>',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: '编辑',
      submenu: [
        { label: '撤销', accelerator: 'Command+Z', selector: 'undo:' },
        { label: '恢复', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: '剪切', accelerator: 'Command+X', selector: 'cut:' },
        { label: '复制', accelerator: 'Command+C', selector: 'copy:' },
        { label: '粘贴', accelerator: 'Command+V', selector: 'paste:' },
        {
          label: '全选',
          accelerator: 'Command+A',
          selector: 'selectAll:',
        },
      ],
    };
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: '查看',
      submenu: [
        {
          label: '重载',
          accelerator: 'Command+R',
          click: () => {
            this.mainWin.webContents.reload();
          },
        },
        {
          label: '全屏',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWin.setFullScreen(!this.mainWin.isFullScreen());
          },
        },
        {
          label: '开发者工具',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWin.webContents.toggleDevTools();
          },
        },
      ],
    };
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: '查看',
      submenu: [
        {
          label: ' 全屏',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWin.setFullScreen(!this.mainWin.isFullScreen());
          },
        },
        {
          label: '开发者工具',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWin.webContents.toggleDevTools();
          },
        },
      ],
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: '窗口',
      submenu: [
        {
          label: '最小化',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        { label: '关闭', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: '全部置于顶层', selector: 'arrangeInFront:' },
      ],
    };
    const subMenuHelp: MenuItemConstructorOptions = {
      label: '帮助',
      submenu: [
        {
          label: '了解 Electron',
          click() {
            shell.openExternal('https://electronjs.org');
          },
        },
        {
          label: 'Electron 文档',
          click() {
            shell.openExternal('https://github.com/electron/electron/tree/main/docs#readme');
          },
        },
        {
          label: '参与讨论',
          click() {
            shell.openExternal('https://www.electronjs.org/community');
          },
        },
        {
          label: '搜索问题',
          click() {
            shell.openExternal('https://github.com/electron/electron/issues');
          },
        },
      ],
    };

    const subMenuView = isDev ? subMenuViewDev : subMenuViewProd;

    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '文件',
        submenu: [
          {
            label: '打开',
            accelerator: 'Ctrl+O',
          },
          {
            label: '关闭',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWin.close();
            },
          },
        ],
      },
      {
        label: '查看',
        submenu: isDev
          ? [
              {
                label: '重载',
                accelerator: 'Ctrl+R',
                click: () => {
                  this.mainWin.webContents.reload();
                },
              },
              {
                label: '全屏',
                accelerator: 'F11',
                click: () => {
                  this.mainWin.setFullScreen(!this.mainWin.isFullScreen());
                },
              },
              {
                label: '开发者工具',
                accelerator: 'Alt+Ctrl+I',
                click: () => {
                  this.mainWin.webContents.toggleDevTools();
                },
              },
            ]
          : [
              {
                label: '全屏',
                accelerator: 'F11',
                click: () => {
                  this.mainWin.setFullScreen(!this.mainWin.isFullScreen());
                },
              },
            ],
      },
      {
        label: '帮助',
        submenu: [
          {
            label: '了解 Electron',
            click() {
              shell.openExternal('https://electronjs.org');
            },
          },
          {
            label: 'Electron 文档',
            click() {
              shell.openExternal('https://github.com/electron/electron/tree/main/docs#readme');
            },
          },
          {
            label: '参与讨论',
            click() {
              shell.openExternal('https://www.electronjs.org/community');
            },
          },
          {
            label: '搜索问题',
            click() {
              shell.openExternal('https://github.com/electron/electron/issues');
            },
          },
        ],
      },
    ];

    return templateDefault;
  }
}
