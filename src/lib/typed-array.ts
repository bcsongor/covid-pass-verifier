export const equal8 = (a: Uint8Array, b: Uint8Array): boolean => compare(a, b);

const compare = (a: Uint8Array, b: Uint8Array): boolean => {
  for (let i = a.length; -1 < i; i -= 1) {
    if ((a[i] !== b[i])) return false;
  }
  return true;
}