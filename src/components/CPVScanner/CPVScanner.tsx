import React from 'react';
import { Button } from 'carbon-components-react';

import CPVQrReader from '@cpv/components/CPVQrReader';
import CPVQrDataParser from '@cpv/components/CPVQrDataParser';

export const CPVScanner = () => {
  const [isScanning, setIsScanning] = React.useState<boolean>(false);
  const [qrData, setQrData] = React.useState<string | null>(null);

  const startScanning = () => {
    setQrData(null);
    setIsScanning(true);
  };

  const stopScanning = () => setIsScanning(false);

  const onQrData = (data: string) => {
    setQrData(data);
    setIsScanning(false);
  }

  return (
    <>
      {!isScanning && <Button onClick={startScanning}>Scan QR code</Button>}
      {isScanning &&
        <div>
          <Button kind="danger" onClick={stopScanning}>Stop scanning</Button>
          <CPVQrReader onQrData={onQrData} />
        </div>}
      {qrData && <CPVQrDataParser qrData={qrData} />}
    </>
  );
};
