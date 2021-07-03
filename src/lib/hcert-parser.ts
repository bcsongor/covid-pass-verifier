import base45 from 'base45-js/lib/base45-js';
import * as cbor from 'cbor-web';

import { inflate } from '@cpv/lib/zlib';
import { HCERT } from '@cpv/lib/hcert';
// const cbor = require('cbor-web');

/** CBOR tags used for COSE message identification. */
enum CBORTags {
  COSESign = 98,
  COSESign1 = 18,
}

/** Claims in the CBOR Web Token. */
enum CWTClaims {
  Issuer = 1, // iss
  IssuedAt = 6, // iat
  ExpirationTime = 4, // exp
  HealthCertificate = -260 // hcert
}

/**
 * Claims in a Health Certificate.
 * Note: Currently all government-issued certificates share the same claim key.
 */
enum HCERTClaims {
  DigitalHealthCertificate = 1 // eu_dgc_v1, this claim is the same for NHS Covid Passes too.
}

/**
 * Parses the given 2D barcode payload.
 * @return Compressed CBOR Web Token payload contained within the 2D barcode.
 */
const parseBarcode = (payload: string): Uint8Array => {
  const supportedVersions = ['1'];

  if (!/^HC[1-9A-Z]:/.test(payload)) {
    throw new Error('missing HCERT context indetifier in barcode payload');
  }

  const version = payload[2];
  if (!supportedVersions.includes(version)) {
    throw new Error(`unsupportted HCERT version: ${version}`);
  }

  // Strip off HCERT context identifier.
  const stripped = payload.substring(4);
  return new Uint8Array(base45.decode(stripped));
};

/**
 * Parses a HCERT payload as specified in
 * https://github.com/ehn-dcc-development/hcert-spec/releases/download/1.0.5/dgc_spec-1.0.5-final.pdf
 */
export const parseHCERT = (barcodePayload: string): HCERT => {
  // The HCERT barcode payload is a compressed CBOR Web Token.
  const cwt = inflate(parseBarcode(barcodePayload));

  // CBOR Web Token is technically a signed COSE message (https://datatracker.ietf.org/doc/html/rfc8392#page-8).
  const coseSignedMsg = cbor.decode(cwt);

  // Validate the structure of the decoded CBOR structure.
  if ((coseSignedMsg.tag !== CBORTags.COSESign && coseSignedMsg.tag !== CBORTags.COSESign1) || coseSignedMsg.value.length !== 4) {
    throw new Error(`invalid COSE sign structure`)
  }

  // Deconstruct the COSE sign structure (https://datatracker.ietf.org/doc/html/rfc8152#page-17)
  const [prot, unprot, payload, signers] = coseSignedMsg.value;

  // https://raw.githubusercontent.com/ehn-dcc-development/ehn-dcc-schema/release/1.3.0/DCC.combined-schema.json

  // Ignore the COSE verification stuff for now.
  const claims = cbor.decode(payload);

  const iss = claims.get(CWTClaims.Issuer);
  const iat = claims.get(CWTClaims.IssuedAt);
  const exp = claims.get(CWTClaims.ExpirationTime);
  const hcert = claims.get(CWTClaims.HealthCertificate).get(HCERTClaims.DigitalHealthCertificate);

  return {
    iss,
    iat,
    exp,
    hcert
  };
};
