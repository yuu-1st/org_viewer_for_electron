import { ApiResultData } from '../@types/connectionDataType';
import fs from 'fs';
import { exec } from 'child_process';

/**
 * orgファイルをpandocを経由してHTML形式に変更します。
 * @param event
 * @param dirPath 変更するorgファイルの絶対パス
 * @returns dataはstring型
 */
export const FileChangeFromOrgToHTML = async (
  event: Electron.IpcMainInvokeEvent,
  dirPath: string
): Promise<ApiResultData> => {
  let result: ApiResultData;
  result = await new Promise((resolve, reject) => {
    if (fs.existsSync(dirPath) && dirPath.split('.').slice(-1)[0] === 'org') {
      exec('/usr/local/bin/pandoc -f org -t html ' + dirPath, (err, stdout, stderr) => {
        if (err) {
          resolve({ result: 'error', data: stderr });
        } else {
          resolve({ result: 'success', data: stdout });
        }
      });
    } else {
      reject('エラー：ファイルがありません。');
    }
  });
  return result;
};
