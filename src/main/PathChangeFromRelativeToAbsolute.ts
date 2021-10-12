import path from 'path';

/**
 * 与えられたパスが相対パスだった場合、絶対パスに書き換えます。
 * 外部のurlを指定する場合、http、https、fileから始まる場合のみ除外されます。それ以外は予期せぬ動作をする可能性があります。
 * @param event
 * @param changePath 変更対象となるパス
 * @param originalPath changePathが記述されているファイルの絶対パス
 * @returns
 */
export const PathChangeFromRelativeToAbsolute = (
  event: Electron.IpcMainInvokeEvent,
  changePath: string,
  originalPath: string
): string => {
  let result = changePath;
  if (/^(https?:\/\/|file:)/.test(changePath)) {
    // 要素がhttpもしくはhttpsから始まるとき
  } else if (path.isAbsolute(changePath)) {
    // 要素が絶対パスで書かれている時
  } else {
    // 要素が相対パスで書かれている時
    result = path.resolve(path.dirname(originalPath), changePath);
  }
  return result;
};
