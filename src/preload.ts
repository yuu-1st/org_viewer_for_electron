import { contextBridge, ipcRenderer } from 'electron';
import { DirectoryData } from './@types/connectionDataType';

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

export async function fileOpenToEmacs(dirName: string): Promise<string | null> {
  const Message: string | null = await ipcRenderer.invoke('fileOpenToEmacs', dirName);
  return Message;
}

export async function getDefaultData(): Promise<{ HomeDir: string }> {
  const Message: { HomeDir: string } = await ipcRenderer.invoke('getDefaultData');
  return Message;
}

contextBridge.exposeInMainWorld('api', {
  getDirectoryList: getDirectoryList,
  fileOpenToEmacs: fileOpenToEmacs,
  getDefaultData: getDefaultData,
});
