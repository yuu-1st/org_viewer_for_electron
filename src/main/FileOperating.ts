import fs from 'fs';
import path from 'path';
import { ApiResultData } from '../@types/connectionDataType';

export const FileOperating_CreateNewFile = (
  event: Electron.IpcMainInvokeEvent,
  filename: string,
  directory: string
): ApiResultData => {
  if (!/^[^\\/:\*\?\"<>\|]+$/.test(filename)) {
    return {
      result: 'error',
      data: 'Contains characters that cannot be used.',
    };
  }
  const fullPath = path.join(directory, `${filename}.org`); // ファイル名の記号類を除去するコードを書く！
  if (!fs.existsSync(fullPath)) {
    fs.closeSync(fs.openSync(fullPath, 'w'));
    return {
      result: 'success',
      data: '',
    };
  }
  return {
    result: 'error',
    data: 'already exist.',
  };
};
