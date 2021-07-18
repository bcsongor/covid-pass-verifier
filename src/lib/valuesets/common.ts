function isKeyOf<T extends string>(obj: { [key in T]: unknown }, key: unknown): key is T {
  if (key === null || typeof key !== 'string') return false;
  return Object.keys(obj).includes(key);
}

export function getFromValueSetValues<T extends string>(obj: { [key in T]: { display: string } }, key: string): string {
  if (isKeyOf(obj, key)) {
    return obj[key].display;
  }

  return `Unknown (${key})`;
}
