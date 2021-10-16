import { contextBridge, ipcRenderer } from 'electron';
import { ApiResultData, DefaultData, DirectoryData } from './@types/connectionDataType';

export async function getDirectoryList(
  dirName: string,
  dirLevel: number
): Promise<DirectoryData[] | null> {
  const DirList: DirectoryData[] | null = await ipcRenderer.invoke(
    'getDirectoryList',
    dirName,
    dirLevel
  );
  return DirList;
}

export async function fileOpenToEmacs(dirName: string): Promise<ApiResultData> {
  const Message: ApiResultData = await ipcRenderer.invoke('fileOpenToEmacs', dirName);
  return Message;
}

export async function getDefaultData(): Promise<DefaultData> {
  const Message: DefaultData = await ipcRenderer.invoke('getDefaultData');
  return Message;
}

export async function fileChangeFromOrgToHTML(dirName: string): Promise<ApiResultData> {
  const Message: ApiResultData = await ipcRenderer.invoke('fileChangeFromOrgToHTML', dirName);
  return Message;
}

export async function pathChangeFromRelativeToAbsolute(
  changePath: string,
  originalPath: string
): Promise<string> {
  const Message: string = await ipcRenderer.invoke(
    'pathChangeFromRelativeToAbsolute',
    changePath,
    originalPath
  );
  return Message;
}

/**
 * メインプロセスから呼び出した時に呼び出す関数を登録する関数
 * @param callback
 */
export function ipcRendererOnShowLicenseList(callback: (text: string) => void): void {
  ipcRenderer.on('showLicenseList', (event, text) => {
    callback(text);
  });
}

contextBridge.exposeInMainWorld('api', {
  getDirectoryList: getDirectoryList,
  fileOpenToEmacs: fileOpenToEmacs,
  getDefaultData: getDefaultData,
  fileChangeFromOrgToHTML: fileChangeFromOrgToHTML,
  pathChangeFromRelativeToAbsolute: pathChangeFromRelativeToAbsolute,
  ipcRendererOnShowLicenseList: ipcRendererOnShowLicenseList,
});
