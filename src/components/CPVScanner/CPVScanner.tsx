import { useState } from 'react';
import { Button, Grid, Row, Column } from 'carbon-components-react';
import { Misuse32, CheckmarkFilled32, CheckmarkFilledWarning32 } from '@carbon/icons-react';
import CPVQrReader from '@cpv/components/CPVQrReader';
import CPVQrDataParser from '@cpv/components/CPVQrDataTable';
import { HCERTStatus } from '@cpv/lib/hcert-verification';

const hcertStatusMapping = {
  [HCERTStatus.PartiallyVaccinated]: {
    icon: <CheckmarkFilledWarning32 />,
    label: 'Partially Vaccinated',
    className: 'amber',
  },
  [HCERTStatus.FullyVaccinated]: {
    icon: <CheckmarkFilled32 />,
    label: 'Fully Vaccinated',
    className: 'green',
  },
  [HCERTStatus.NotVaccinated]: {
    icon: <Misuse32 />,
    label: 'Not Vaccinated',
    className: 'red',
  },
  [HCERTStatus.Expired]: {
    icon: <Misuse32 />,
    label: 'Expired',
    className: 'red',
  },
  [HCERTStatus.UnverifiedSignature]: {
    icon: <Misuse32 />,
    label: 'Unverified Signature',
    className: 'red',
  },
  [HCERTStatus.Error]: {
    icon: <Misuse32 />,
    label: 'Error',
    className: 'red',
  },
};

const CPVCertificateStatus = ({ status }: { status: HCERTStatus }): JSX.Element => {
  const mapped = hcertStatusMapping[status];

  return (
    <div className={['cpv-scanner__status', mapped.className].join(' ')}>
      {mapped.icon}
      <br />
      {mapped.label}
    </div>
  );
};

export const CPVScanner = (): JSX.Element => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [qrData, setQrData] = useState<string | null>(null);
  const [status, setStatus] = useState<HCERTStatus | null>(null);

  const startScanning = () => {
    setQrData(null);
    setIsScanning(true);
  };

  const stopScanning = () => setIsScanning(false);

  const onQrData = (data: string) => {
    setQrData(data);
    setIsScanning(false);
  };

  const onHCERTStatus = (status: HCERTStatus) => {
    setStatus(status);
  };

  return (
    <>
      {!isScanning && (
        <Grid className="cpv-scanner__grid" condensed={true}>
          <Row>
            <Column sm={2}>
              <Button onClick={startScanning}>Scan QR Code</Button>
            </Column>
            <Column sm={2}>{status !== null && <CPVCertificateStatus status={status} />}</Column>
          </Row>
        </Grid>
      )}
      {isScanning && (
        <div>
          <Button kind="danger" onClick={stopScanning}>
            Stop scanning
          </Button>
          <CPVQrReader onQrData={onQrData} />
        </div>
      )}
      {qrData && <CPVQrDataParser qrData={qrData} onHCERTStatus={onHCERTStatus} />}
    </>
  );
};
