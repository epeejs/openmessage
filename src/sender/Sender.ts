import type { MessageAction } from '../typings';
import { TinyEmitter } from 'tiny-emitter';

export default class Sender extends TinyEmitter {
  /** 是否需要发送 cancel 消息，阻止确定时触发 */
  private preventCloseEvent = false;

  constructor(private readonly receiver: Window, private readonly receiverOrigin: string) {
    super();
    this.init();
    this.postMessage({
      type: 'ready',
    });
  }

  private onmessage(e: MessageEvent) {
    if (e.source === this.receiver) {
      this.emit('message', e.data);
    }
  }

  private init() {
    window.addEventListener('message', this.onmessage);
    window.addEventListener('unload', () => {
      if (!this.preventCloseEvent) {
        this.cancel();
      }
    });
  }

  postMessage(message: MessageAction) {
    this.receiver.postMessage(message, this.receiverOrigin);
  }

  ok(message: any) {
    this.postMessage({
      type: 'ok',
      payload: message,
    });
    this.preventCloseEvent = true;
    window.close();
  }

  cancel() {
    this.postMessage({
      type: 'cancel',
    });
  }
}
