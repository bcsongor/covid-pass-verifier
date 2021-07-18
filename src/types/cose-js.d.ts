declare module 'cose-js' {
  type BufferLike = number[] | Buffer | ArrayBuffer | Uint8Array | Uint8ClampedArray;

  export namespace sign {
    type Verifier = {
      key: {
        x: BufferLike;
        y: BufferLike;
      };
    };

    export function verify(message: BufferLike, verifier: Verifier): Promise<BufferLike>;
  }
}
