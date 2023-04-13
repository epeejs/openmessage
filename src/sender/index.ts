/* eslint-disable no-underscore-dangle */
import { getQuery, verfiySign } from '../utils';
import Sender from './Sender';

export function createSender() {
  const opnerOrigin = getQuery('_o');
  const opener = window.opener || (window as any).rawWindow?.opener;

  if (!opener) {
    console.warn('非子页面环境打开或未使用 sdk 打开');
    return;
  }

  const query = getQuery();
  const sign = query._s;

  delete query._s;
  if (!verfiySign(query, sign)) {
    throw new Error('签名验证失败');
  }

  return new Sender(opener, opnerOrigin ?? opener.origin);
}
