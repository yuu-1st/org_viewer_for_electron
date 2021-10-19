import { exec, spawn } from 'child_process';
import { shell } from 'electron';
import fs from 'fs';
// import { stderr } from 'process';
import { ApiResultData } from '../@types/connectionDataType';
import { ExecPathEscape } from './ExecPathEscape';

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
      // exec('arch -arch x86_64 /bin/bash -c "/Applications/Emacs.app/Contents/MacOS/Emacs ' + ExecPathEscape(`"${ExecPathEscape(dirPath)}"`) + '"', (err, stdout, stderr) => {
      exec(
        `/Applications/Emacs.app/Contents/MacOS/Emacs "${ExecPathEscape(dirPath)}"`,
        (err, stdout, stderr) => {
          if (err) {
            console.log(err.message);
            resolve({
              result: 'error',
              data: stderr,
            });
          } else {
            resolve({
              result: 'success',
              data: '',
            });
          }
        }
      );

      // const exe = spawn('/Applications/Emacs.app/Contents/MacOS/Emacs', [`${dirPath}`], {
      //   shell: true,
      // });
      // exe.stdout.on('data', (stdout) => {
      //   resolve({
      //     result: 'success',
      //     data: '',
      //   });
      // });
      // exe.stderr.on('data', (stderr) => {
      //   resolve({
      //     result: 'error',
      //     data: stderr,
      //   });
      // });
      // exe.on('close', (code) => {
      //   resolve({
      //     result: 'error',
      //     data: `${code}`,
      //   });
      // });
    } else {
      resolve({
        result: 'error',
        data: 'ファイルがありません。',
      });
    }
  });
  return result;
};
