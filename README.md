# postmessage

提供浏览器任意两个页面双向通信能力（支持跨域）

## 安装

```sh
yarn add @epeejs/postmessage
```

## 用法

```ts
import { open } from '@epeejs/postmessage';

open({
  url: 'https://www.abc.com/home',
  params: {
    a: 1,
  },
  onOk(data) {
    console.log(data);
  },
});
```

## API

### open

```ts
function open(options: ReceiverOptions): Promise<ReceiverActions>;
```

```ts
export interface ReceiverOptions {
  /** 打开页面的地址 */
  url?: string;
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
```
