declare module 'base45-js/lib/base45-js' {
  export function encode(buffer: ArrayBuffer): string;
  export function decode(str: string): ArrayBuffer;
}
