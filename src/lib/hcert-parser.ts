import base45 from 'base45-js/lib/base45-js';
import * as cbor from 'cbor-web';
import * as cose from 'cose-js';

import { equal8 } from '@cpv/lib/typed-array';
import { inflate } from '@cpv/lib/zlib';
import { HCERT } from '@cpv/lib/hcert';
import { findCertificate } from '@cpv/lib/certificates';

/** CBOR tags used for COSE message identification. */
enum CBORTags {
  COSESign = 98,
  COSESign1 = 18,
}

/** Common COSE header parameters. */
enum COSEHeaderParameters {
  Algorithm = 1, // alg
  CriticalHeaders = 2, // crit
  ContentType = 3, // content type
  KeyIdentifier = 4, // kid
  InitialisationVector = 5, // IV
  PartialInitialisationVector = 6, // Partial IV
  CounterSignature = 7, // counter signature
}

/** COSE signature algorithms used to verify the signature. */
enum COSESignatureAlgoritms {
  ES256_SHA256 = -7,
}

/** Claims in the CBOR Web Token. */
enum CWTClaims {
  Issuer = 1, // iss
  IssuedAt = 6, // iat
  ExpirationTime = 4, // exp
  HealthCertificate = -260, // hcert
}

/**
 * Claims in a Health Certificate.
 * Note: Currently all government-issued certificates share the same claim key.
 */
enum HCERTClaims {
  DigitalHealthCertificate = 1, // eu_dgc_v1, this claim is the same for NHS Covid Passes too.
}

/** List of kids exludes from the COSE signature verification. */
const EXCLUDED_KIDS: Uint8Array[] = [];

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
export const parseHCERT = async (barcodePayload: string): Promise<HCERT> => {
  // The HCERT barcode payload is a compressed CBOR Web Token.
  const cwt = inflate(parseBarcode(barcodePayload));

  // CBOR Web Token is technically a signed COSE message (https://datatracker.ietf.org/doc/html/rfc8392#page-8).
  const coseSignedMsg = cbor.decode(cwt);

  // Validate the structure of the decoded CBOR structure.
  if (
    (coseSignedMsg.tag !== CBORTags.COSESign && coseSignedMsg.tag !== CBORTags.COSESign1) ||
    coseSignedMsg.value.length !== 4
  ) {
    throw new Error('invalid COSE sign structure');
  }

  // Deconstruct the COSE sign structure (https://datatracker.ietf.org/doc/html/rfc8152#page-17)
  const [prot, , payload] = coseSignedMsg.value; // Array content: [protected, unprotected, payload, signers]. We only use the protected header for now.

  // Verify COSE signature.
  const p = cbor.decode(prot);
  const alg = p.get(COSEHeaderParameters.Algorithm);
  if (alg !== COSESignatureAlgoritms.ES256_SHA256) {
    throw new Error(`unsupported signature algorithm: ${alg}`);
  }

  const kid = p.get(COSEHeaderParameters.KeyIdentifier);

  // TODO: Temporary exclusion for certificates we still need to acquire (e.g. UK's NHS).
  const isExcluded = EXCLUDED_KIDS.some((ekid) => equal8(kid, ekid));

  let sig = isExcluded;

  if (!isExcluded) {
    const crt = findCertificate(kid);
    if (crt === undefined) {
      throw new Error(`could not find certificate for kid: ${kid.toString('hex')}`);
    }

    if (crt.pub === null) {
      throw new Error(`could not find public key in certificate for kid: ${kid.toString('hex')}`);
    }

    try {
      await cose.sign.verify(cwt, { key: crt.pub });
      sig = true;
    } finally {
      // Do nothing here, sig is either fals or true depending whether cose.sign.verify threw or not.
    }
  }

  // Decode the claims in the payload.
  const claims = cbor.decode(payload);

  const iss = claims.get(CWTClaims.Issuer);
  const iat = claims.get(CWTClaims.IssuedAt);
  const exp = claims.get(CWTClaims.ExpirationTime);
  const hcert = claims.get(CWTClaims.HealthCertificate).get(HCERTClaims.DigitalHealthCertificate);

  return { iss, iat, exp, hcert, sig };
};
