import md5 from 'md5';

export function getQuery(): Record<string, string>;
export function getQuery(name: string): string | undefined;
export function getQuery(name?: string) {
  const query = new URLSearchParams(window.location.search);

  if (name) {
    return query.get(name) || undefined;
  }

  return Array.from(query.entries()).reduce((prev, curr) => {
    const [key, val] = curr;
    return {
      ...prev,
      [key]: val,
    };
  }, {});
}

export function stringifyQs(obj: Record<string, string | number | undefined | null>) {
  const newObj = Object.keys(obj).reduce((prev, curr) => {
    const val = obj[curr];

    if (val !== undefined && val !== null) {
      return {
        ...prev,
        [curr]: val,
      };
    }
    return prev;
  }, {});

  return new URLSearchParams(newObj).toString();
}

const salt = 'IYPb3n16yPOI7xmr';

export function sign(obj: Record<string, any>) {
  const sortedKeys = Object.entries(obj)
    .filter((m) => m[1])
    .map((m) => m[0])
    .sort();
  const plaintext = sortedKeys.map((key) => `${key},${obj[key]}`).join();
  console.log('签名文本：', plaintext);

  return md5(`${plaintext}${salt}`);
}

export function verfiySign(obj: Record<string, any>, signStr?: string) {
  return sign(obj) === signStr;
}
