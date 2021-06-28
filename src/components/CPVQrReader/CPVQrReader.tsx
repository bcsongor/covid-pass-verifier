import React from 'react';
import QrReader from 'react-qr-reader';

type Props = {
  onQrData: (data: string) => void;
}

export const CPVQrReader = ({ onQrData }: Props) => {
  const handleScan = (data: string | null) => {
    if (data != null) {
      onQrData(data);
    }
  };

  const handleError = (err: any) => {
    alert(err);
  };

  return (
    <QrReader
      onScan={handleScan}
      onError={handleError}
      facingMode="environment"
    />
  )
};
