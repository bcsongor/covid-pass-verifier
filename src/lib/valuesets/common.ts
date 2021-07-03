function isKeyOf<T extends string >(
  obj: { [key in T]: any },
  key: any
): key is T {
  return Object.keys(obj).includes(key);
}

export function getFromValueSetValues<T extends string>(
  obj: { [key in T]: any },
  key: string
) {
  if (isKeyOf(obj, key)) {
    return obj[key].display;
  }

  return 'Unknown';
}
