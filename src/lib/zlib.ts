import pako from 'pako';

/**
 * Decompresses an arbitrary payload using the Deflate compression mechanism.
 */
export const inflate = (data: Uint8Array): Uint8Array => {
  // Zlib magic headers:
  // 78 01 - No Compression/low
  // 78 9C - Default Compression
  // 78 DA - Best Compression
  if (data[0] === 0x78) {
    return pako.inflate(data);
  }
  return data;
};