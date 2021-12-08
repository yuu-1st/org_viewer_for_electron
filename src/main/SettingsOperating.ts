import { ApiResultData, SettingsDataList } from '../@types/connectionDataType';
import DataStore from './DataStore';

/**
 * 設定を読み込みます
 * @returns
 */
export const getSettingsData = (): SettingsDataList => {
  const settingsData: SettingsDataList = {
    emacsPath: DataStore.getEmacsPath(),
    pandocPath: DataStore.getPandocPath(),
    author: DataStore.getAuthor(),
  };
  return settingsData;
};

/**
 * 設定を保存します
 * @param settingsData
 * @returns
 */
export const setSettingsData = (
  event: Electron.IpcMainInvokeEvent,
  settingsData: SettingsDataList
): ApiResultData => {
  // emacsPathが/emacsで終了していなければ、設定を更新しない
  if (!/(^emacs|\/emacs)$/i.test(settingsData.emacsPath)) {
    return {
      result: 'error',
      data: 'emacsのパスが正しくありません',
    };
  }
  // pandocPathが/pandocで終了していなければ、設定を更新しない
  if (!/(^pandoc|\/pandoc)$/i.test(settingsData.pandocPath)) {
    return {
      result: 'error',
      data: 'pandocのパスが正しくありません',
    };
  }

  DataStore.setEmacsPath(settingsData.emacsPath);
  DataStore.setPandocPath(settingsData.pandocPath);
  DataStore.setAuthor(settingsData.author);
  return {
    result: 'success',
    data: '',
  };
};
