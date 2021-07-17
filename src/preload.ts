import { contextBridge, ipcRenderer } from 'electron';
import { DirectoryData } from './@types/connectionDataType';

export async function getDirectoryList(
  dirName: string,
//  callback: (dirList: DirectoryData[] | null) => void
): Promise<DirectoryData[] | null> {
  const DirList: DirectoryData[] | null = await ipcRenderer.invoke('getDirectoryList', dirName);
  return DirList;
}


contextBridge.exposeInMainWorld('api', {
  getDirectoryList: getDirectoryList,
});
