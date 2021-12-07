import Store from 'electron-store';

const store = new Store();

/**
 * データの保存や読み込みを行うクラス
 */
const DataStore = {
  /**
   * Emacsのパスを取得する
   * @returns {string} Emacsのパス
   */
  getEmacsPath: (): string => {
    const defaultPath = '/Applications/Emacs.app/Contents/MacOS/Emacs';
    const get = store.get('emacsPath', defaultPath);
    if (typeof get === 'string') {
      return get;
    } else {
      return defaultPath;
    }
  },

  /**
   * Emacsのパスを設定する
   */
  setEmacsPath: (path: string) => {
    store.set('emacsPath', path);
  },

  /**
   * Pandocのパスを取得する
   */
  getPandocPath: (): string => {
    const defaultPath = '/usr/local/bin/pandoc';
    const get = store.get('pandocPath', defaultPath);
    if (typeof get === 'string') {
      return get;
    } else {
      return defaultPath;
    }
  },

  /**
   * Pandocのパスを設定する
   */
  setPandocPath: (path: string) => {
    store.set('pandocPath', path);
  },
};

export default DataStore;
