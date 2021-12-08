import os from 'os';
import path from 'path';
import { app, BrowserWindow, ipcMain, session } from 'electron';
import { GetDirectoryList } from './main/GetDirectoryList';
import { FileOpenToEmacs } from './main/FileOpenToEmacs';
import { FileChangeFromOrgToHTML } from './main/FileChangeFromOrgToHTML';
import { PathChangeFromRelativeToAbsolute } from './main/PathChangeFromRelativeToAbsolute';
import { GetDefaultData } from './main/GetDefaultData';
import { UpdateMenuBar } from './main/MenuBarController';
import { FileOperating_CreateNewFile, FileOperating_DeleteFile } from './main/FileOperating';
import { OpenHTML } from './main/OpenHTML';
import { getSettingsData, setSettingsData } from './main/SettingsOperating';

const extPath =
  os.platform() === 'darwin'
    ? '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.13.5_0'
    : '/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.13.5_0';

/**
 * BrowserWindowインスタンスを作成する関数
 */
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      /**
       * BrowserWindowインスタンス（レンダラープロセス）では
       * Node.jsの機能を無効化する（electron@8以降でデフォルト）
       */
      nodeIntegration: false,
      /**
       * メインプロセスとレンダラープロセスとの間で
       * コンテキストを共有しない (electron@12以降でデフォルト)
       */
      contextIsolation: true,
      /**
       * Preloadスクリプト
       * webpack.config.js で 'node.__dirname: false' を
       * 指定していればパスを取得できる
       */
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // 開発時にはデベロッパーツールを開く
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  // レンダラープロセスをロード
  mainWindow.loadFile('dist/index.html');

  // メニューバーを表示する
  UpdateMenuBar(mainWindow);
};

/**
 * アプリを起動する準備が完了したら BrowserWindow インスタンスを作成し、
 * レンダラープロセス（index.htmlとそこから呼ばれるスクリプト）を
 * ロードする
 */
app.whenReady().then(async () => {
  /**
   * 開発時には React Developer Tools をロードする
   */
  if (process.env.NODE_ENV === 'development') {
    await session.defaultSession
      .loadExtension(path.join(os.homedir(), extPath), {
        allowFileAccess: true,
      })
      .then(() => console.log('React Devtools loaded...'))
      .catch((err) => console.log(err));
  }

  // BrowserWindow インスタンスを作成
  createWindow();
});

// すべてのウィンドウが閉じられたらアプリを終了する
app.once('window-all-closed', () => app.quit());

//******************************************************
// レンダープロセスと通信するイベント群
//******************************************************

/**
 * デフォルト値となるデータを作成する
 */
ipcMain.handle('getDefaultData', GetDefaultData);

/**
 * ディレクトリ表示
 */
ipcMain.handle('getDirectoryList', GetDirectoryList);

/**
 * ファイルをGUI Emacsで表示します。
 */
ipcMain.handle('fileOpenToEmacs', FileOpenToEmacs);

/**
 * ファイルをHTMLに変換し、それを返します。
 */
ipcMain.handle('fileChangeFromOrgToHTML', FileChangeFromOrgToHTML);

/**
 * 相対パスを絶対パスに修正します。
 */
ipcMain.handle('pathChangeFromRelativeToAbsolute', PathChangeFromRelativeToAbsolute);

/**
 * 新規ファイルを作成します。
 */
ipcMain.handle('FileOperating_CreateNewFile', FileOperating_CreateNewFile);

/**
 * 既存ファイルを削除します。
 */
ipcMain.handle('FileOperating_DeleteFile', FileOperating_DeleteFile);

/**
 * Linkを開きます。
 */
ipcMain.handle('OpenHTML', OpenHTML);

/**
 * 設定を取得します。
 */
ipcMain.handle('getSettings', getSettingsData);

/**
 * 設定を保存します。
 */
ipcMain.handle('setSettings', setSettingsData);
