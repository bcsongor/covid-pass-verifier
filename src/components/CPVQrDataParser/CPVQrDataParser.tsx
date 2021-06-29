import React from 'react';
import { Accordion, AccordionItem, CodeSnippet } from 'carbon-components-react';

import { _debug } from './hcert-parser';

type Props = {
  qrData: string;
};

export const CPVQrDataParser = ({ qrData }: Props) => {
  return (
    <Accordion>
      <AccordionItem title="Pass information" open>
        {_debug(qrData)}
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
