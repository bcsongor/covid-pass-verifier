#!/usr/bin/env node

const fs = require('fs');
const fetch = require('node-fetch');
const cbor = require('cbor-web');
const child_process = require('child_process');

const fetchPublicKey = (buff) => {
  const b64 = buff.toString('base64');
  const cmd = `echo "${b64}" | base64 --decode | openssl x509 -pubkey -noout -inform der -in /dev/stdin | openssl ec -pubin -in /dev/stdin -outform der | xxd -p`;
  const asn1pubhex = child_process.spawnSync('bash', ['-c', `'${cmd}'`], { shell: '/bin/bash', encoding : 'utf8' }).stdout.replace(/\n/g, '');

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

const fetchX509Tag = (buff, tag) => {
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

(async function main(params) {
  // Test certificates from AT government.
  /*const res = await fetch('https://dgc.a-sit.at/ehn/cert/listv2');
  const listv2cbor = await res.buffer();
  const listv2 = cbor.decode(listv2cbor);

  const certs = listv2.c.map(c => {
    return {
      kid: c.i.toJSON().data,
      crt: c.c.toJSON().data,
      iss: fetchX509Tag(c.c, 'Issuer'),
      sub: fetchX509Tag(c.c, 'Subject'),
      pub: fetchPublicKey(c.c)
    }
  });*/

  // Production trust list from AT government.
  // See discussion: https://github.com/eu-digital-green-certificates/dgc-participating-countries/issues/10
  const res = await fetch('https://greencheck.gv.at/api/masterdata');
  const json = await res.json();
  const trustListCbor = Buffer.from(json.trustList.trustListContent, 'base64');
  const trustList = cbor.decode(trustListCbor);

  const certs = trustList.c.map(c => {
    return {
      kid: c.i.toJSON().data,
      crt: c.c.toJSON().data,
      iss: fetchX509Tag(c.c, 'Issuer'),
      sub: fetchX509Tag(c.c, 'Subject'),
      pub: fetchPublicKey(c.c)
    }
  });

  fs.writeFileSync('./src/data/certificates.json', JSON.stringify(certs), 'utf8');
})();
