import { equal8 } from '@cpv/lib/typed-array';
import rawCertificates from '@cpv/data/certificates.json';

export interface Certificate {
  kid: Uint8Array,
  crt: Uint8Array,
  iss: { [tag: string]: string | undefined };
  sub: { [tag: string]: string | undefined };
  pub: { x: number[]; y: number[]; } | null;
};

export const certificates: Certificate[] = rawCertificates.map(cert => ({
  ...cert,
  kid: new Uint8Array(cert.kid),
  crt: new Uint8Array(cert.crt)
}));

export const findCertificate = (kid: Uint8Array): Certificate | undefined => certificates.find(cert => equal8(cert.kid, kid));

export const supportedIssuers = (): string[] => {
  return Array.from(new Set(certificates.map(c => `${c.iss.O}, ${c.iss.C}`))) as string[];
};

