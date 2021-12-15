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
    const get = store.get('emacsPath', '');
    if (typeof get === 'string') {
      return get;
    } else {
      return '';
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
    const get = store.get('pandocPath', '');
    if (typeof get === 'string') {
      return get;
    } else {
      return '';
    }
  },

  /**
   * Pandocのパスを設定する
   */
  setPandocPath: (path: string) => {
    store.set('pandocPath', path);
  },

  /**
   * 著者名を取得する
   */
  getAuthor: (): string => {
    const get = store.get('author', '');
    if (typeof get === 'string') {
      return get;
    } else {
      return '';
    }
  },

  /**
   * 著者名を設定する
   * @param {string} author 著者名
   * @returns {void}
   */
  setAuthor: (author: string) => {
    store.set('author', author);
  },
};

export default DataStore;
