/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */

declare module 'cbor-web' {
  export function decode(
    input: string | Buffer | ArrayBuffer | Uint8Array | Uint8ClampedArray | DataView | stream.Readable,
    options?: DecoderOptions | string,
  ): any;

  type DecoderOptions = {
    /**
     * - the maximum depth to parse.
     * Use -1 for "until you run out of memory".  Set this to a finite
     * positive number for un-trusted inputs.  Most standard inputs won't nest
     * more than 100 or so levels; I've tested into the millions before
     * running out of memory.
     */
    max_depth?: number;
    /**
     * - mapping from tag number to function(v),
     * where v is the decoded value that comes after the tag, and where the
     * function returns the correctly-created value for that tag.
     */
    tags?: object;
    /**
     * generate JavaScript BigInt's
     * instead of BigNumbers, when possible.
     */
    bigint?: boolean;
    /**
     * if true, prefer Uint8Arrays to
     * be generated instead of node Buffers.  This might turn on some more
     * changes in the future, so forward-compatibility is not guaranteed yet.
     */
    preferWeb?: boolean;
    /**
     * - The encoding of the input.
     * Ignored if input is a Buffer.
     */
    encoding?: string;
    /**
     * - Should an error be thrown when no
     * data is in the input?
     */
    required?: boolean;
    /**
     * - if true, emit extended
     * results, which will be an object with shape {@link ExtendedResults}.
     * The value will already have been null-checked.
     */
    extendedResults?: boolean;
  };
}
