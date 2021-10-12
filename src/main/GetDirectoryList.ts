import { DirectoryData } from '../@types/connectionDataType';
import fs, { Dirent } from 'fs';
import path from 'path';

/**
 * 指定されたディレクトリリストを出力します。
 * @param event
 * @param dirPath 表示するディレクトリ。絶対パスもしくは相対パス
 * @param level 表示する階層数。1以上が必要です
 * @returns
 */
export const GetDirectoryList = async (
  event: Electron.IpcMainInvokeEvent,
  dirPath: string,
  level: number
): Promise<DirectoryData[] | null> => {
  if (dirPath.length === 0) return null;
  if (!fs.existsSync(dirPath)) return null;
  // 末尾のスラッシュを消す
  dirPath = dirPath.replace(/\/$/, '');
  return await getLists(dirPath, level);
};

/**
 * ディレクトリリストを生成します。
 * @param dirPath 表示するディレクトリ。絶対パスもしくは相対パス
 * @param level 表示する階層数。1以上が必要です
 * @returns
 */
async function getLists(dirPath: string, level: number): Promise<DirectoryData[] | null> {
  if (level <= 0) return null;

  const returnValue = new Promise<DirectoryData[] | null>(async (resolve, reject) => {
    let files : Dirent[];
    try{
      files = await fs.promises.readdir(dirPath, {withFileTypes: true});
    }catch(e){
      console.log(e);
      reject(null);
      return;
    }
    const filesList = files.filter((element) => !element.name.startsWith('.'));
    const returnValue = filesList.map(async (dir) => {
      const ret: DirectoryData = {
        name: dir.name,
        isDirectory: dir.isDirectory(),
        extension: dir.isDirectory() ? '/dir' : dir.name.split('.').slice(-1)[0], // 拡張子にスラッシュは入らないと判断
        subDirectory: null,
        rootPath: path.resolve(dirPath + '/' + dir.name),
      };
      if (ret.isDirectory) {
        ret.subDirectory = await getLists(dirPath + '/' + ret.name, level - 1);
      }
      return ret;
    });
    Promise.all(returnValue).then((value) => {
      resolve(value);
    });
  });

  return returnValue;
};