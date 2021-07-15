import { contextBridge, ipcRenderer } from 'electron';
import { DirectoryData } from './@types/connectionDataType';

export async function getDirectoryList(
  dirName: string,
  callback: (dirList: DirectoryData[] | null) => void
): Promise<void> {
  const DirList: DirectoryData[] | null = await ipcRenderer.invoke('getDirectoryList', dirName);
  callback(DirList);
}


contextBridge.exposeInMainWorld('api', {
  getDirectoryList: getDirectoryList,
});
