import { app, BrowserWindow, Menu } from 'electron';
import { LicenseList } from '../LicenseList';

const isMac = process.platform === 'darwin';

function CreateMenuBar(mainWindow: BrowserWindow) {
  const macMenu: Electron.MenuItemConstructorOptions[] = [
    {
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'quit' },
      ],
    },
  ];

  const template: Electron.MenuItemConstructorOptions[] = [];
  if (isMac) {
    // { role: 'appMenu' }
    template.push(...macMenu);
  }
  // { role: 'fileMenu' }
  template.push({
    label: 'ファイル',
    submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
  });

  // { role: 'editMenu' }
  const editSubMenu: Electron.MenuItemConstructorOptions[] = [
    { role: 'undo' },
    { role: 'redo' },
    { type: 'separator' },
    { role: 'cut' },
    { role: 'copy' },
    { role: 'paste' },
  ];

  if (isMac) {
    editSubMenu.push(
      ...([
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }],
        },
      ] as Electron.MenuItemConstructorOptions[])
    );
  } else {
    editSubMenu.push(
      ...([
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' },
      ] as Electron.MenuItemConstructorOptions[])
    );
  }

  template.push({
    label: 'Edit',
    submenu: editSubMenu,
  });

  // { role: 'viewMenu' }
  template.push({
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  });

  // { role: 'windowMenu' }

  const windowSubMenu: Electron.MenuItemConstructorOptions[] = [
    { role: 'minimize' },
    { role: 'zoom' },
  ];

  if (isMac) {
    windowSubMenu.push(
      ...([
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' },
      ] as Electron.MenuItemConstructorOptions[])
    );
  } else {
    windowSubMenu.push({ role: 'close' });
  }

  template.push({
    label: 'Window',
    submenu: windowSubMenu,
  });

  template.push({
    role: 'help',
    submenu: [
      {
        label: 'License',
        click: async () => {
          // const { shell } = require('electron');
          // await shell.openExternal('https://electronjs.org');
          mainWindow.webContents.send('showLicenseList', LicenseList);
        },
      },
    ],
  });

  return Menu.buildFromTemplate(template);
}
/**
 * メニューバーを更新します。
 * @param mainWindow
 */
export function UpdateMenuBar(mainWindow: BrowserWindow) {
  const menu = CreateMenuBar(mainWindow);
  Menu.setApplicationMenu(menu);
}
