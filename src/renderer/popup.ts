import { ReactNotificationOptions, store } from 'react-notifications-component';

/**
 * 右上にポップアップを表示します。
 * @param title タイトル
 * @param message メッセージ
 * @param type 通知タイプ
 * @param isCountdown カウントダウンするか。デフォルトはfalseです。
 * @param duration 自動的に非表示になるまでの時間。デフォルトは5000msです。
 * @returns
 */
export function ShowPopup(
  title: string,
  message: string,
  type: ReactNotificationOptions['type'],
  isCountdown: boolean = false,
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
      onScreen: isCountdown,
    },
  });
}

/**
 * 実行開始から終了までの短期間に表示されるポップアップを表示します。
 * @param title タイトル
 * @param message メッセージ
 * @param type 通知タイプ
 * @param isCountdown カウントダウンするか。デフォルトはfalseです。
 * @param duration 自動的に非表示になるまでの時間。デフォルトは0(無制限)です。
 * @returns
 */
export function ShowTemporaryPopup(
  title: string,
  message: string,
  type: ReactNotificationOptions['type'],
  isCountdown: boolean = false,
  duration: number = 0
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
      onScreen: isCountdown,

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
