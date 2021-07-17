// https://zenn.dev/sprout2000/articles/7d2644bb4e198e
// https://dev.classmethod.jp/articles/typings-of-window-object/
import { getDirectoryList } from '../preload';

export default interface Api{
  getDirectoryList : typeof getDirectoryList;
}

// global の名前空間にある定義を上書き
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    api: Api;
  }
}
