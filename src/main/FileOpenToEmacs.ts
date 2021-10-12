import { exec } from 'child_process';
import fs from 'fs';

/**
 * orgファイルをGUI版Emacsで開きます。
 * @param event
 * @param dirPath 表示するorgファイルの絶対パス
 * @returns
 */
export const FileOpenToEmacs = async (
  event: Electron.IpcMainInvokeEvent,
  dirPath: string
): Promise<string> => {
  let result: string = '';
  result = await new Promise((resolve, reject) => {
    if (fs.existsSync(dirPath)) {
      exec('/Applications/Emacs.app/Contents/MacOS/Emacs ' + dirPath, (err, stdout, stderr) => {
        if (err) {
          reject(`エラー: ${stderr}`);
        } else {
          resolve('ok');
        }
      });
    } else {
      reject('エラー：ファイルがありません。');
    }
  });
  return result;
};
