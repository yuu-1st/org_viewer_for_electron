import fs from 'fs';
import path from 'path';
import { ApiResultData } from '../@types/connectionDataType';

/**
 * orgファイルを新規作成します。
 * @param event
 * @param filename ファイル名
 * @param directory ディレクトリ名
 * @returns
 */
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
  const fullPath = path.join(directory, `${filename}.org`);
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

/**
 * orgファイルを削除します。
 * @param event
 * @param fullPath 削除するファイルのフルパス
 * @returns
 */
export const FileOperating_DeleteFile = (
  event: Electron.IpcMainInvokeEvent,
  fullPath: string
): ApiResultData => {
  if (!/\.org$/.test(fullPath)) {
    return {
      result: 'error',
      data: 'only can delete org.',
    };
  }
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
    } catch (e) {
      return {
        result: 'error',
        data: 'exception',
      };
    }
    return {
      result: 'success',
      data: '',
    };
  }
  return {
    result: 'error',
    data: 'already deleted.',
  };
};
