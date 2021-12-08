import { contextBridge, ipcRenderer } from 'electron';
import { ApiResultData, DefaultData, DirectoryData, SettingsDataList } from './@types/connectionDataType';

export const preloadObject = {
  /**
   * orgファイルをpandocを経由してHTML形式に変更します。
   * @param dirPath 変更するorgファイルの絶対パス
   * @returns dataはstring型
   */
  fileChangeFromOrgToHTML: async (dirName: string): Promise<ApiResultData> => {
    const Message: ApiResultData = await ipcRenderer.invoke('fileChangeFromOrgToHTML', dirName);
    return Message;
  },

  /**
   * orgファイルをGUI版Emacsで開きます。
   * @param dirPath 表示するorgファイルの絶対パス
   * @returns
   */
  fileOpenToEmacs: async (dirName: string): Promise<ApiResultData> => {
    const Message: ApiResultData = await ipcRenderer.invoke('fileOpenToEmacs', dirName);
    return Message;
  },

  /**
   * orgファイルを新規作成します。
   * @param filename ファイル名
   * @param directory ディレクトリ名
   * @returns
   */
  FileOperating_CreateNewFile: async (
    filename: string,
    directory: string,
    ModalExplainText: string,
  ): Promise<ApiResultData> => {
    const Message: ApiResultData = await ipcRenderer.invoke(
      'FileOperating_CreateNewFile',
      filename,
      directory,
      ModalExplainText,
    );
    return Message;
  },

  /**
   * orgファイルを削除します。
   * @param fullPath 削除するファイルのフルパス
   * @returns
   */
  FileOperating_DeleteFile: async (fullPath: string): Promise<ApiResultData> => {
    const Message: ApiResultData = await ipcRenderer.invoke('FileOperating_DeleteFile', fullPath);
    return Message;
  },

  /**
   * 起動時にレンダープロセス側に送信するデフォルトデータを作成します。
   * @returns
   */
  getDefaultData: async (): Promise<DefaultData> => {
    const Message: DefaultData = await ipcRenderer.invoke('getDefaultData');
    return Message;
  },

  /**
   * 指定されたディレクトリリストを出力します。
   * @param dirPath 表示するディレクトリ。絶対パスもしくは相対パス
   * @param level 表示する階層数。1以上が必要です
   * @param isAll 全て表示するか。1の場合はorgファイルとディレクトリのみ、2の場合は隠しファイル以外、3は全てのファイルが表示されます。
   * @returns
   */
  getDirectoryList: async (
    dirName: string,
    dirLevel: number,
    isAll: number
  ): Promise<DirectoryData[] | null> => {
    const DirList: DirectoryData[] | null = await ipcRenderer.invoke(
      'getDirectoryList',
      dirName,
      dirLevel,
      isAll
    );
    return DirList;
  },

  /**
   * 与えられたパスが相対パスだった場合、絶対パスに書き換えます。
   * 外部のurlを指定する場合、http、https、fileから始まる場合のみ除外されます。それ以外は予期せぬ動作をする可能性があります。
   * @param changePath 変更対象となるパス
   * @param originalPath changePathが記述されているファイルの絶対パス
   * @returns
   */

  pathChangeFromRelativeToAbsolute: async (
    changePath: string,
    originalPath: string
  ): Promise<string> => {
    const Message: string = await ipcRenderer.invoke(
      'pathChangeFromRelativeToAbsolute',
      changePath,
      originalPath
    );
    return Message;
  },

  /**
   * linkをブラウザで開きます。
   * @param link
   */
  OpenHTML: async (link: string): Promise<void> => {
    await ipcRenderer.invoke('OpenHTML', link);
  },

  /**
   * 設定を読み込みます
   * @returns
   */
  getSettings: async (): Promise<SettingsDataList> => {
    const Message: SettingsDataList = await ipcRenderer.invoke('getSettings');
    return Message;
  },

  /**
   * 設定を保存します
   * @param settings
   * @returns
   */
  setSettings: async (settings: SettingsDataList): Promise<ApiResultData> => {
    const Message: ApiResultData = await ipcRenderer.invoke('setSettings', settings);
    return Message;
  },

  /**
   * メインプロセスから呼び出した時に呼び出す関数を登録する関数 - LicenseList
   * @param callback
   */
  ipcRendererOnShowLicenseList: (callback: (text: string) => void): void => {
    ipcRenderer.on('showLicenseList', (event, text) => {
      callback(text);
    });
  },

  /**
   * メインプロセスから呼び出した時に呼び出す関数を登録する関数 - Settings
   * @param callback
   */
  ipcRendererOnShowSettings: (callback: (text: string) => void): void => {
    ipcRenderer.on('showSettings', (event, text) => {
      callback(text);
    });
  },
};

contextBridge.exposeInMainWorld('api', preloadObject);
