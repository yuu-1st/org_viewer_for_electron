import os from 'os';
import path, { resolve } from 'path';
import { app, BrowserWindow, ipcMain, session } from 'electron';
import fs, { Dirent } from 'fs';
import { DirectoryData } from './@types/connectionDataType';
import { exec } from 'child_process';

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

/**
 * デフォルト値となるデータを作成する
 */
ipcMain.handle(
  'getDefaultData',
  async (event: Electron.IpcMainInvokeEvent) => {
    let HomeDir = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
    if(fs.existsSync(HomeDir + "/.my_help")){
      HomeDir += "/.my_help";
    }
    return {
      HomeDir,
    };
  }
);

/**
 * ディレクトリ表示
 */
ipcMain.handle(
  'getDirectoryList',
  async (event: Electron.IpcMainInvokeEvent, dirPath: string, level: number) => {
    if (dirPath.length === 0) return null;
    const getLists = async (dirPath: string, level: number): Promise<DirectoryData[] | null> => {
      if (level <= 0) return null;
      const returnValue = new Promise<DirectoryData[] | null>((resolve, reject) => {
        fs.readdir(
          dirPath,
          { withFileTypes: true },
          async (err: NodeJS.ErrnoException | null, files: Dirent[]) => {
            if (err) {
              console.log(err);
              reject(null);
              return;
            }
            const filesList = files.filter(element => !element.name.startsWith('.'));
            const returnValue = filesList.map(async (dir) => {
              const ret: DirectoryData = {
                name: dir.name,
                isDirectory: dir.isDirectory(),
                extension: dir.isDirectory() ? "/dir" : dir.name.split('.').slice(-1)[0], // 拡張子にスラッシュは入らないと判断
                subDirectory: null,
                rootPath: path.resolve(dirPath + '/' + dir.name),
              };
              if (ret.isDirectory) {
                ret.subDirectory = await getLists(dirPath + '/' + ret.name, level - 1);
              }
              return ret;
            });
            Promise.all(returnValue).then((value) => {
              resolve(value);
            });
          }
        );
      });
      return returnValue;
    };

    // 末尾のスラッシュを消す
    dirPath = dirPath.replace(/\/$/, '');
    return await getLists(dirPath, level);
  }
);

/**
 * ファイルをGUI Emacsで表示します。
 */
ipcMain.handle(
  'fileOpenToEmacs',
  async (event: Electron.IpcMainInvokeEvent, dirPath: string) => {
    let result : string = "";
    result = await new Promise((resolve, reject) => {
      if(fs.existsSync(dirPath)){
        exec('/Applications/Emacs.app/Contents/MacOS/Emacs ' + dirPath, (err, stdout, stderr) => {
          if (err) {
            reject(`エラー: ${stderr}`);
          }else{
            resolve("ok");
          }
        });
      }else{
        reject("エラー：ファイルがありません。");
      }
    });
    return result;
  }
);