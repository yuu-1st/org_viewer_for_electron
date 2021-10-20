import { DirectoryData } from '../@types/connectionDataType';
import fs, { Dirent } from 'fs';
import path from 'path';

/**
 * 指定されたディレクトリリストを出力します。
 * @param event
 * @param dirPath 表示するディレクトリ。絶対パスもしくは相対パス
 * @param level 表示する階層数。1以上が必要です
 * @param isAll 全て表示するか。0の場合はorgファイルとディレクトリのみ、1の場合は隠しファイル以外、2は全てのファイルが表示されます。
 * @returns
 */
export const GetDirectoryList = async (
  event: Electron.IpcMainInvokeEvent,
  dirPath: string,
  level: number,
  isAll: number = 0,
): Promise<DirectoryData[] | null> => {
  if (dirPath.length === 0) return null;
  if (!fs.existsSync(dirPath)) return null;
  // 末尾のスラッシュを消す
  dirPath = dirPath.replace(/\/$/, '');
  return await getLists(dirPath, level, isAll);
};

/**
 * ディレクトリリストを生成します。
 * @param dirPath 表示するディレクトリ。絶対パスもしくは相対パス
 * @param level 表示する階層数。1以上が必要です
 * @param isAll 全て表示するか。0の場合はorgファイルとディレクトリのみ、1の場合は隠しファイル以外、2は全てのファイルが表示されます。
 * @returns
 */
async function getLists(dirPath: string, level: number, isAll: number): Promise<DirectoryData[] | null> {
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
    const filesList = files.filter((dir) => {
      let isShow = false;
      if(dir.isDirectory()){
        if(dir.name === ".my_help"){
          // .my_helpは表示する
          isShow = true;
        }else if(!dir.name.startsWith('.')){
          // .から始まらないディレクトリ
          isShow = true;
        }else if(isAll >= 2){
          // 全てのディレクトリを表示することになっている場合
          isShow = true;
        }
      } else if(getFileExtension(dir.name) === 'org'){
        // orgファイルの時
        isShow = true;
      } else if(isAll === 1 && !dir.name.startsWith('.')){
        // orgファイル以外で、.から始まらないファイルで、設定が1の時
        isShow = true;
      } else if(isAll >= 2){
        // 設定が2以上の時は全て通す
        isShow = true;
      }
      return isShow;
    });
    const returnValue = filesList.map(async (dir) => {
      const ret: DirectoryData = {
        name: dir.name,
        isDirectory: dir.isDirectory(),
        extension: dir.isDirectory() ? '/dir' : getFileExtension(dir.name), // 拡張子にスラッシュは入らないと判断
        subDirectory: null,
        rootPath: path.resolve(dirPath + '/' + dir.name),
      };
      if (ret.isDirectory) {
        ret.subDirectory = await getLists(dirPath + '/' + ret.name, level - 1, isAll);
      }
      return ret;
    });
    Promise.all(returnValue).then((value) => {
      resolve(value);
    });
  });

  return returnValue;
};

/**
 * ファイルの拡張子を取得します。
 * @param filename
 * @returns
 */
function getFileExtension(filename : string) : string {
  return filename.split('.').slice(-1)[0];
}