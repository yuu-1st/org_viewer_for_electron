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

contextBridge.exposeInMainWorld('api', {
  getDirectoryList: getDirectoryList,
});
