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
        {
          label: 'Preferences',
          click: async () => {
            mainWindow.webContents.send('showSettings', LicenseList);
          },
        },
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
  const viewSubMenu:  Electron.MenuItemConstructorOptions[] = [
    { role: 'resetZoom' },
    { role: 'zoomIn' },
    { role: 'zoomOut' },
    { type: 'separator' },
    { role: 'togglefullscreen' },
  ];

  if(process.env.NODE_ENV === 'development'){
    viewSubMenu.push({ role: 'reload' });
  }

  template.push({
    label: 'View',
    submenu: viewSubMenu
    // submenu: [
    //   // { role: 'reload' },
    //   // { role: 'forceReload' },
    //   // { role: 'toggleDevTools' },
    //   // { type: 'separator' },
    //   { role: 'resetZoom' },
    //   { role: 'zoomIn' },
    //   { role: 'zoomOut' },
    //   { type: 'separator' },
    //   { role: 'togglefullscreen' },
    // ],
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
          mainWindow.webContents.send('showLicenseList', LicenseList);
        },
      },
      {
        label: 'Website',
        click: async () => {
          const { shell } = require('electron');
          await shell.openExternal('https://github.com/yuu-1st/org_viewer_for_electron/releases');
        }
      }
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
