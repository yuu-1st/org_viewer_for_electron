import { ReactNotificationOptions, store } from 'react-notifications-component';

/**
 * 右上にポップアップを表示します。
 * @param title タイトル
 * @param message メッセージ
 * @param type 通知タイプ
 * @param autoHide 自動的に非表示にするか。デフォルトはtrueです。
 * @param duration 自動的に非表示になるまでの時間。デフォルトは5000msです。
 * @returns
 */
export function ShowPopup(
  title: string,
  message: string,
  type: ReactNotificationOptions['type'],
  autoHide: boolean = true,
  duration: number = 5000
): string {
  return store.addNotification({
    title: title,
    message: message,
    type: type,
    insert: 'top',
    container: 'top-right',
    animationIn: ['animate__animated', 'animate__fadeIn'],
    animationOut: ['animate__animated', 'animate__zoomOut'],
    dismiss: {
      duration: duration,
      pauseOnHover: true,
      onScreen: !autoHide,
    },
  });
}

/**
 * 実行開始から終了までの短期間に表示されるポップアップを表示します。
 * @param title タイトル
 * @param message メッセージ
 * @param type 通知タイプ
 * @param autoHide 自動的に非表示にするか。デフォルトはfalseです。
 * @param duration 自動的に非表示になるまでの時間。デフォルトは5000msです。
 * @returns
 */
export function ShowTemporaryPopup(
  title: string,
  message: string,
  type: ReactNotificationOptions['type'],
  autoHide: boolean = false,
  duration: number = 5000
): string {
  return store.addNotification({
    title: title,
    message: message,
    type: type,
    insert: 'top',
    container: 'top-right',
    animationIn: ['animate__animated', 'animate__fadeIn'],
    animationOut: ['animate__animated', 'animate__zoomOut', 'animate__faster'],
    dismiss: {
      duration: duration,
      onScreen: !autoHide,
    },
  });
}

/**
 * 表示しているポップアップを強制的に消します。
 * @param id
 */
export function DeletePopup(id: string): void {
  store.removeNotification(id);
}
