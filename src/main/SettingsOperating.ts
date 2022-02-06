import { ApiResultData, SettingsDataList } from '../@types/connectionDataType';
import DataStore from './DataStore';

/**
 * Emacsのパスの条件の正規表現
 */
// const EmacsPathRegExp = /(^emacs|\/emacs)$/i;
const EmacsPathRegExp = /.*/; // emacsに限定しなくても良いのでは？

/**
 * Pandocのパスの条件の正規表現
 */
const PandocPathRegExp = /(^pandoc|\/pandoc)$/i;

/**
 * 保存されたEmacsのパスを取得する。適切な値が読み込めなかった場合はデフォルトを返す。
 * @returns string
 */
export const getSettingsEmacsPath = (): string => {
  const defaultPath = '/Applications/Emacs.app/Contents/MacOS/Emacs';
  let settings = DataStore.getEmacsPath();
  if (!EmacsPathRegExp.test(settings)) {
    settings = defaultPath;
  }
  return settings;
};

/**
 * 保存されたPandocのパスを取得する。適切な値が読み込めなかった場合はデフォルトを返す。
 * @returns string
 */
export const getSettingsPandocPath = (): string => {
  const defaultPath = '/usr/local/bin/pandoc';
  let settings = DataStore.getPandocPath();
  if (!PandocPathRegExp.test(settings)) {
    settings = defaultPath;
  }
  return settings;
};

/**
 * 保存されたauthorを取得する。適切な値が読み込めなかった場合はデフォルトを返す。
 * @returns string
 */
export const getSettingsAuthor = (): string => {
  const defaultAuthor = 'Your Name';
  let settings = DataStore.getAuthor();
  if (settings.length === 0) {
    settings = defaultAuthor;
  }
  return settings;
};

/**
 * 設定を読み込みます
 * @returns
 */
export const getSettingsData = (): SettingsDataList => {
  const settingsData: SettingsDataList = {
    emacsPath: getSettingsEmacsPath(),
    pandocPath: getSettingsPandocPath(),
    author: getSettingsAuthor(),
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
  if (!EmacsPathRegExp.test(settingsData.emacsPath)) {
    return {
      result: 'error',
      data: 'emacsのパスが正しくありません',
    };
  }
  // pandocPathが/pandocで終了していなければ、設定を更新しない
  if (!PandocPathRegExp.test(settingsData.pandocPath)) {
    return {
      result: 'error',
      data: 'pandocのパスが正しくありません',
    };
  }
  // authorが空でなければ、設定を更新しない
  if (settingsData.author.length === 0) {
    return {
      result: 'error',
      data: 'authorは文字列で入力してください',
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
