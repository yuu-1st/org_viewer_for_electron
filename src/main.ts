import os from 'os';
import path from 'path';
import { app, BrowserWindow, ipcMain, session } from 'electron';
import fs, { Dirent } from 'fs';
import { DirectoryData } from './@types/connectionDataType';

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

// eslint-disable-next-line no-undef
ipcMain.handle('getDirectoryList', async (event: Electron.IpcMainInvokeEvent, dirPath: string) => {
  // eslint-disable-next-line no-undef
  const returnValue = new Promise<DirectoryData[] | null>((resolve, reject) => {
    fs.readdir(dirPath, {withFileTypes: true}, (err: NodeJS.ErrnoException | null, files: Dirent[]) : void => {
      if (err) {
        console.log(err);
        reject(null);
        return;
      }
      resolve(files.map((dir) => {
        const ret : DirectoryData = {
          name: dir.name,
          isDirectory: dir.isDirectory(),
          extension: dir.isDirectory() ? null : dir.name.split('.').slice(-1)[0],
        }
        return ret;
      }));
    });
  });
  return returnValue;
});
