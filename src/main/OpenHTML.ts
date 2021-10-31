import { shell }  from 'electron';

/**
 * linkをブラウザで開きます。
 * @param event
 * @param link
 */
export const OpenHTML = async (
  event: Electron.IpcMainInvokeEvent,
  link: string,
) => {
  await shell.openExternal(link);
}
