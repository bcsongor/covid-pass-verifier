import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  CodeSnippet,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from 'carbon-components-react';

import { HCERT, TestEntry, VaccinationEntry } from '@cpv/lib/hcert';
import { parseHCERT } from '@cpv/lib/hcert-parser';
import { validateHCERT, HCERTStatus } from '@cpv/lib/hcert-verification';
import { formatISO8601Timestamp, formatTimestamp } from '@cpv/lib/time';
// import { getCountry } from '@cpv/lib/valuesets/country-2-codes';
import { getTargetDisease } from '@cpv/lib/valuesets/disease-agent-targeted';
import { getVaccineProphylaxis } from '@cpv/lib/valuesets/vaccine-prophylaxis';
import { getVaccineMedicinalProduct } from '@cpv/lib/valuesets/vaccine-medicinal-product';
import { getVaccineManufacturer } from '@cpv/lib/valuesets/vaccine-manufacturer';
import { getTestResult } from '@cpv/lib/valuesets/test-result';
import { getTestManufacturer } from '@cpv/lib/valuesets/test-manufacturer';
import { getTestType } from '@cpv/lib/valuesets/test-type';

type Props = {
  qrData: string;
  onHCERTStatus: (status: HCERTStatus) => void;
};

type HCERTMappings<T> = {
  [title: string]: {
    [label: string]: (obj: T) => string | undefined;
  };
};

const hcertMetadataMappings: HCERTMappings<HCERT> = {
  General: {
    'Issuer Country': (h) => h.iss,
    'Issued At': (h) => formatTimestamp(h.iat),
    'Expires At': (h) => formatTimestamp(h.exp),
  },
  Personal: {
    'Full Name': ({ hcert: { nam } }) => `${nam.fn} ${nam.gn}`,
    'Date of Birth': ({ hcert }) => hcert.dob,
  },
};

const hcertVaccineMappings: HCERTMappings<VaccinationEntry> = {
  Vaccine: {
    'Target Disease': (v) => getTargetDisease(v.tg),
    Vaccine: (v) => getVaccineProphylaxis(v.vp),
    'Vaccine Product': (v) => getVaccineMedicinalProduct(v.mp),
    'Vaccine Manufacturer': (v) => getVaccineManufacturer(v.ma),
    Dose: (v) => `${v.dn} / ${v.sd}`,
    'Date of Vaccination': (v) => v.dt,
    'Country of Vaccination': (v) => v.co,
    'Certificate Issuer': (v) => v.is,
  },
};

const hcertTestMappings: HCERTMappings<TestEntry> = {
  Test: {
    'Target Disease': (t) => getTargetDisease(t.tg),
    'Test Type': (t) => getTestType(t.tt),
    'Test Manufacturer': (t) => t.nm || (t.ma && getTestManufacturer(t.ma)) || undefined,
    'Test Time': (t) => formatISO8601Timestamp(t.sc),
    'Test Result': (t) => getTestResult(t.tr),
    'Testing Centre': (t) => t.tc,
    'Country of Test': (t) => t.co,
    'Certificate Issuer': (t) => t.is,
  },
};

export const CPVQrDataTable = ({ qrData, onHCERTStatus }: Props): JSX.Element => {
  const [hcert, setHCERT] = useState<HCERT | null>(null);

  useEffect(() => {
    async function getHCERT() {
      let status = HCERTStatus.Error;

      try {
        const hcert = await parseHCERT(qrData);
        setHCERT(hcert);
        status = validateHCERT(hcert);
      } catch (e) {
        console.error(e);
      }

      onHCERTStatus(status);
    }

    getHCERT();
  }, [qrData]);

  if (hcert === null) {
    return <></>;
  }

  return (
    <Accordion className="cpv-qr-data-parser__accordion">
      <AccordionItem title="Pass information" open={true}>
        {Object.entries(hcertMetadataMappings).map(([title, mappings]) => (
          <Table key={title} size="sm">
            <TableHead>
              <TableRow>
                <TableHeader colSpan={2}>{title}</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(mappings).map(([label, mapper]) => (
                <TableRow key={label}>
                  <TableCell width="40%">{label}</TableCell>
                  <TableCell>{mapper(hcert)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ))}

        {hcert.hcert.v?.map((v, idx) =>
          Object.entries(hcertVaccineMappings).map(([title, mappings]) => (
            <Table key={title + idx} size="sm">
              <TableHead>
                <TableRow>
                  <TableHeader colSpan={2}>{title}</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(mappings).map(([label, mapper]) => (
                  <TableRow key={label}>
                    <TableCell width="40%">{label}</TableCell>
                    <TableCell>{mapper(v)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )),
        )}

        {hcert.hcert.t?.map((t, idx) =>
          Object.entries(hcertTestMappings).map(([title, mappings]) => (
            <Table key={title + idx} size="sm">
              <TableHead>
                <TableRow>
                  <TableHeader colSpan={2}>{title}</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(mappings)
                  .filter(([, mapper]) => mapper(t) !== undefined)
                  .map(([label, mapper]) => (
                    <TableRow key={label}>
                      <TableCell width="40%">{label}</TableCell>
                      <TableCell>{mapper(t)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )),
        )}
      </AccordionItem>
      <AccordionItem title="Barcode payload">
        <CodeSnippet type="multi" feedback="Copied to clipboard" wrapText={true}>
          {qrData}
        </CodeSnippet>
      </AccordionItem>
    </Accordion>
  );
};
