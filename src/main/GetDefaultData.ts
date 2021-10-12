import fs from 'fs';

/**
 * 起動時にレンダープロセス側に送信するデフォルトデータを作成します。
 * @param event 
 * @returns
 */
export const GetDefaultData = async (event: Electron.IpcMainInvokeEvent) => {
  let HomeDir = process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];
  if (fs.existsSync(HomeDir + '/.my_help')) {
    HomeDir += '/.my_help';
  }
  return {
    HomeDir,
  };
}