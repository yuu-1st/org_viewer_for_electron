import { exec } from 'child_process';
import fs from 'fs';
import { ApiResultData } from '../@types/connectionDataType';

/**
 * orgファイルをGUI版Emacsで開きます。
 * @param event
 * @param dirPath 表示するorgファイルの絶対パス
 * @returns
 */
export const FileOpenToEmacs = async (
  event: Electron.IpcMainInvokeEvent,
  dirPath: string
): Promise<ApiResultData> => {
  let result: ApiResultData;
  result = await new Promise((resolve) => {
    if (fs.existsSync(dirPath)) {
      exec('/Applications/Emacs.app/Contents/MacOS/Emacs ' + dirPath, (err, stdout, stderr) => {
        if (err) {
          resolve({
            result: "error",
            data :stderr,
          });
        } else {
          resolve({
            result: "success",
            data : "",
          });
        }
      });
    } else {
      resolve({
        result: "error",
        data: "ファイルがありません。",
      });
    }
  });
  return result;
};
