#!/usr/bin/env node

const fs = require('fs');
const certs = require('../src/data/certificates.json');

const header = ['KID', 'Country', 'Issuer', 'Subject'];
const body = certs.sort((a, b) => a.iss.C.localeCompare(b.iss.C)).map(crt => {
    const kid = Buffer.from(crt.kid).toString('base64');
    return ['`' + kid + '`', crt.sub.C, crt.iss.O, crt.sub.O];
});

function toMarkdown(arr) {
    return '|' + arr.join('|') + '|';
}

const md = [
    '# Supported certificates',
    '',
    '**Last updated:** ' + new Date().toISOString().slice(0, 10),
    '',
    '**Number of supported certificates:** ' + certs.length,
    '',
    toMarkdown(header),
    toMarkdown(header.map(_ => '-')),
    ...(body.map(el => toMarkdown(el)))
].join('\n');

fs.writeFileSync('./docs/Certificates.md', md, 'utf-8');
