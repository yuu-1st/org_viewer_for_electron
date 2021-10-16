import fs from 'fs';
import { ApiResultData, DefaultData } from '../@types/connectionDataType';
import axios from 'axios';

/**
 * 起動時にレンダープロセス側に送信するデフォルトデータを作成します。
 * @param event
 * @returns
 */
export const GetDefaultData = async (event: Electron.IpcMainInvokeEvent): Promise<DefaultData> => {
  // homedir
  let HomeDir = process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'] ?? '';
  if (fs.existsSync(HomeDir + '/.my_help')) {
    HomeDir += '/.my_help';
  }

  // isUpdate
  let isUpdate: ApiResultData | null = null;

  try {
    const result = await axios.get<any>(
      'https://api.github.com/repos/yuu-1st/org_viewer_for_electron/releases'
    );
    const data = result.data;
    if ('message' in data) {
      isUpdate = {
        result: 'error',
        data: data.message,
      };
    } else {
      if (Array.isArray(data)) {
        const receiveVersion = data[0].tag_name.slice(1);
        if (sortVersions([receiveVersion, process.env.VERSION_ENV])[1] !== receiveVersion) {
          isUpdate = {
            result: 'success',
            data: `バージョン v${receiveVersion} が利用可能です。詳細はhelp→Websiteから。`,
          };
        }
      }
    }
  } catch (e) {
    isUpdate = {
      result: 'error',
      data: String(e),
    };
  }

  return {
    HomeDir,
    isUpdate,
  };
};

/**
 * バージョン番号を最新順に並び替えます
 * original by : https://zenn.dev/nekoniki/articles/c9c4584bc463e593cb94
 * @param unsortedVersions バージョンリスト
 * @returns
 */
const sortVersions = (unsortedVersions: string[]) => {
  return unsortedVersions.slice().sort((q, w) => w.localeCompare(q, [], { numeric: true }));
};
