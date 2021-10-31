import { shell }  from 'electron';

export const OpenHTML = async (
  event: Electron.IpcMainInvokeEvent,
  link: string,
) => {
  await shell.openExternal(link);
}
