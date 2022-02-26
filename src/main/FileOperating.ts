import fs from 'fs';
import path from 'path';
import { ApiResultData } from '../@types/connectionDataType';
import { getSettingsAuthor } from './SettingsOperating';

/**
 * orgファイルを新規作成します。
 * @param event
 * @param filename ファイル名
 * @param directory ディレクトリ名
 * @param ModalExplainText ファイル説明
 * @returns
 */
export const FileOperating_CreateNewFile = (
  event: Electron.IpcMainInvokeEvent,
  filename: string,
  directory: string,
  ModalExplainText: string
): ApiResultData => {
  if (!/^[^\\/:\*\?\"<>\|]+$/.test(filename)) {
    return {
      result: 'error',
      data: 'Contains characters that cannot be used.',
    };
  }
  const fullPath = path.join(directory, `${filename}.org`);
  if (!fs.existsSync(fullPath)) {
    const text = `#+STARTUP: indent nolineimages
#+OPTIONS: ^:{}

* head
- ${ModalExplainText}
* license
-      cc by ${getSettingsAuthor()}, ${new Date().getFullYear()}
* item_example
- itemの例
`;
    fs.writeFileSync(fullPath, text);
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

/**
 * 指定されたファイル名に変更する
 * @param event
 * @param directoryPath 変更するファイルが存在しているディレクトリのフルパス
 * @param changeFileFullPath 変更するファイルのフルパス
 * @param newFilename あたらしいファイル名
 * @returns void
 */
export const FileOperating_RenameFile = (
  event: Electron.IpcMainInvokeEvent,
  directoryPath: string,
  changeFileFullPath: string,
  newFilename: string
): ApiResultData => {
  if (!/^[^\\/:\*\?\"<>\|]+$/.test(newFilename)) {
    return {
      result: 'error',
      data: 'Contains characters that cannot be used.',
    };
  }
  const newFileFullPath = path.join(directoryPath, `${newFilename}.org`);
  if (fs.existsSync(changeFileFullPath)) {
    try {
      fs.renameSync(changeFileFullPath, newFileFullPath);
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
