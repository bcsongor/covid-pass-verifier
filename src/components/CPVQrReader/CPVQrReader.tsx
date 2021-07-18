import QrReader from 'react-qr-reader';

type Props = {
  onQrData: (data: string) => void;
};

export const CPVQrReader = ({ onQrData }: Props): JSX.Element => {
  const handleScan = (data: string | null): void => {
    if (data != null) {
      onQrData(data);
    }
  };

  const handleError = (err: unknown): void => {
    alert(err);
  };

  return <QrReader onScan={handleScan} onError={handleError} facingMode="environment" />;
};
