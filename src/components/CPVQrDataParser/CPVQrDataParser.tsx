import React from 'react';
import { Accordion, AccordionItem, CodeSnippet } from 'carbon-components-react';

import { parseHCERT } from '@cpv/lib/hcert-parser';

type Props = {
  qrData: string;
};

export const CPVQrDataParser = ({ qrData }: Props) => {
  return (
    <Accordion>
      <AccordionItem title="Pass information" open>
        {JSON.stringify(parseHCERT(qrData), null, 2)}
      </AccordionItem>
      <AccordionItem title="Raw QR data">
        <CodeSnippet
          type="multi"
          feedback="Copied to clipboard"
          wrapText={true}
        >
          {qrData}
        </CodeSnippet>
      </AccordionItem>
    </Accordion>
  );
};
