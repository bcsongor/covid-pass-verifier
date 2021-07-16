#!/usr/bin/env node

const fs = require('fs');
const fetch = require('node-fetch');
const cbor = require('cbor-web');
const child_process = require('child_process');

const parseDerPublicKey = (buff) => {
  const b64 = buff.toString('base64');
  const cmd = `echo "${b64}" | base64 --decode | openssl x509 -pubkey -noout -inform der -in /dev/stdin | openssl ec -pubin -in /dev/stdin -outform der | xxd -p`;
  return child_process.spawnSync('bash', ['-c', `'${cmd}'`], { shell: '/bin/bash', encoding : 'utf8' }).stdout.replace(/\n/g, '');
};

const getEcPoints = (asn1pubhex) => {
  if (!asn1pubhex) return null;

  // asn1 lead-in sequence of p256-ecdsa public key.
  const asn1Header = '3059301306072a8648ce3d020106082a8648ce3d030107034200';
  if (!asn1pubhex.startsWith(asn1Header)) {
    throw new Error(`invalid public key: failed to find asn1 lead-in sequence in ${asn1pubhex}`);
  }

  const pubhex = asn1pubhex.substring(asn1Header.length);
  const pub = Buffer.from(pubhex, 'hex').toJSON().data;

  if (pub[0] !== 4) {
    throw new Error(`compressed elliptic points are not supported: ${pub}`)
  }

  return {
    x: pub.slice(1, 33),
    y: pub.slice(33, 65)
  };
};

const getX509Tag = (buff, tag) => {
  const b64 = buff.toString('base64');
  const cmd = `echo "${b64}" | base64 --decode | openssl x509 -text -noout -inform der -in /dev/stdin | grep ${tag}: | xargs | cut -c ${tag.length + 3}-`;
  const raw = child_process.spawnSync('bash', ['-c', `'${cmd}'`], { shell: '/bin/bash', encoding : 'utf8' }).stdout;
  return raw.split(',').reduce((acc, curr) => {
    const kv = curr.split('=').map(e => e.trim());
    if (kv[1]) {
      acc[kv[0].trim()] = kv[1].trim();
    }
    return acc;
  }, {});
};

async function fetchEUCertificates(isProduction) {
  if (isProduction) {
    // Production trust list from AT government.
    // See discussion: https://github.com/eu-digital-green-certificates/dgc-participating-countries/issues/10
    const res = await fetch('https://greencheck.gv.at/api/masterdata');
    const json = await res.json();
    const trustListCbor = Buffer.from(json.trustList.trustListContent, 'base64');
    const trustList = cbor.decode(trustListCbor);

    return trustList.c.map(c => {
      return {
        kid: c.i.toJSON().data,
        crt: c.c.toJSON().data,
        iss: getX509Tag(c.c, 'Issuer'),
        sub: getX509Tag(c.c, 'Subject'),
        pub: getEcPoints(parseDerPublicKey(c.c))
      };
    });
  } else {
    // Test certificates from AT government.
    const res = await fetch('https://dgc.a-sit.at/ehn/cert/listv2');
    const listv2cbor = await res.buffer();
    const listv2 = cbor.decode(listv2cbor);

    listv2.c.map(c => {
      return {
        kid: c.i.toJSON().data,
        crt: c.c.toJSON().data,
        iss: getX509Tag(c.c, 'Issuer'),
        sub: getX509Tag(c.c, 'Subject'),
        pub: getEcPoints(parseDerPublicKey(c.c))
      };
    });
  }
}

async function fetchUKCertificates() {
  // kudos to @mauimauer for finding these public keys.
  const res = await fetch('https://raw.githubusercontent.com/andypandy47/Answer-Digital-Verifier-App/master/VerifierApp.Api/VerifierApp.Api/Repositories/Data/PublicKeys.json');
  // remove BOM from response.
  const json = JSON.parse((await res.buffer()).slice(3).toString('utf-8'));

  return json.map(p => {
    const pubhex = Buffer.from(p.publicKey, 'base64').toString('hex');
    try {
      return {
        kid: Buffer.from(p.kid, 'base64').toJSON().data,
        crt: null,
        iss: { C: 'GB' },
        sub: { C: 'GB' },
        pub: getEcPoints(pubhex),
      };
    } catch (e) {
      console.error(`failed to get EC points for pub key ${pubhex}: ${e}`);
      return null;
    }
  }).filter(p => p !== null);
}

(async function main(params) {
  const outName = 'certificates.json';
  const outPath = `./src/data/${outName}`;

  const certs = [...(await fetchEUCertificates(true)), ...(await fetchUKCertificates())];
  fs.writeFileSync(outPath, JSON.stringify(certs), 'utf8');
  fs.copyFileSync(outPath, `./public/assets/${outName}`);
})();
