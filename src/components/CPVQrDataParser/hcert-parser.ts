import base45 from 'base45-js/lib/base45-js';
import pako from 'pako';
const cbor = require('cbor-web');

// CBOR tags used in COSE payload.
const SIGN_TAG = 98;
const SIGN1_TAG = 18;

export interface HcertData {
};

export const parseQrData = (qrData: string): Uint8Array => {
  let data = qrData;

  // Strip off the HC1 prefix if present.
  if (data.startsWith('HC1')) {
    data = data.substring(3);
    if (data.startsWith(':')) {
      data = data.substring(1);
    } else {
      console.log("Warning: unsafe HC1: header - update to v0.0.4");
    }
  } else {
    console.log("Warning: no HC1: header - update to v0.0.4");
  };

  return new Uint8Array(base45.decode(data));
};

export const inflate = (data: Uint8Array): Uint8Array => {
  // Zlib magic headers:
  // 78 01 - No Compression/low
  // 78 9C - Default Compression
  // 78 DA - Best Compression
  if (data[0] === 0x78) {
    return pako.inflate(data);
  }
  return data;
}

export const _debug = (qrData: string): string => {
  const cosePayload = inflate(parseQrData(qrData));
  const coseObj = cbor.decode(cosePayload);
 
  if (coseObj.tag !== SIGN_TAG && coseObj.tag !== SIGN1_TAG) {
    // Complain.
  }
  if (coseObj.value.length !== 4) {
    // Complain.
  }
  //return JSON.stringify(obj); 
  const [p, u, plaintext, signers] = coseObj.value; // .decode(inflated);

  // https://raw.githubusercontent.com/ehn-dcc-development/ehn-dcc-schema/release/1.3.0/DCC.combined-schema.json
  // https://ec.europa.eu/health/sites/default/files/ehealth/docs/covid-certificate_json_specification_en.pdf

  //return plaintext;
  // Ignore the COSE verification stuff for now.
  const data = cbor.decode(plaintext);
  //return JSON.stringify([Array.from(m.keys()), Array.from(m.values())])
  //return JSON.stringify(cbor.decode(plaintext), null, 5);
  //return payload.toString();
  const issuerCountry = data.get(1);
  const expiryTs = data.get(4);
  const creationTs = data.get(6);
  const s = data.get(-260).get(1);
  return JSON.stringify(s, null, 2); // s.get(1) //JSON.stringify(Array.from(s.get(1).entries()));

  //return issuerCountry;
  // Issuer country: data[1]


  //return JSON.stringify(Array.from(m.entries()));
  //return new TextDecoder().decode(plaintext);
}