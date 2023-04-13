import type { MessageAction } from '../typings';
import { sign, stringifyQs } from '../utils';

export interface ReceiverOptions {
  /** 打开页面的地址 */
  url: string;
  /** 入参 */
  params?: Record<string, string | number>;
  /**
   * window.open 方法第三个参数，用于定义打开窗口样式，默认弹窗样式
   * @link https://developer.mozilla.org/zh-CN/docs/Web/API/Window/open
   */
  windowFeatures?: string;
  /** 取消回调 */
  onCanel?: () => void;
  /** 完成流程回调 */
  onOk?: (message: any) => void;
  /** 消息回调 */
  onMessage?: (message: any) => void;
}
export interface ReceiverActions {
  /** 获取打开窗口句柄 */
  getOpenWindow: () => Window;
  /** 给打开页面发送消息 */
  postMessage: (message: any) => void;
}

export async function open({
  params = {},
  url: _url,
  onCanel,
  onOk,
  onMessage,
  windowFeatures = 'status=0',
}: ReceiverOptions): Promise<ReceiverActions> {
  const array = /(https?:\/\/)([^/]*)\//.exec(_url)!;
  const targetOrigin = array[1] + array[2];
  const obj = {
    ...params,
    _o: window.origin,
  };
  const qs = stringifyQs({
    ...obj,
    _s: sign(obj),
  });
  const url = `${_url}?${qs}`;
  const targetWindow = await Promise.resolve(window.open(url, undefined, windowFeatures));
  let ready = false;

  if (!targetWindow) {
    throw new Error(`打开页面失败，URL：${url}`);
  }

  return new Promise((resolve, reject) => {
    const onmessage = (e: MessageEvent) => {
      if (e.source === targetWindow) {
        const { type, payload } = e.data as MessageAction;
        const clear = () => {
          window.removeEventListener('message', onmessage);
        };

        if (type === 'ready') {
          ready = true;
          resolve({
            getOpenWindow() {
              return targetWindow;
            },
            postMessage(message: any) {
              targetWindow.postMessage(message, targetOrigin);
            },
          });
          return;
        }

        if (type === 'loadfail') {
          reject(payload);
          return clear();
        }

        if (!ready) {
          return;
        }

        if (type === 'cancel') {
          onCanel?.();
          return clear();
        }

        if (type === 'ok') {
          onOk?.(payload);
          return clear();
        }

        if (type === 'message') {
          onMessage?.(payload);
        }
      }
    };
    window.addEventListener('message', onmessage);
  });
}
