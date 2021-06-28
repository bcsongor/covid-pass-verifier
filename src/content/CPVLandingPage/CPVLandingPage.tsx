import React from 'react';
import { Button } from 'carbon-components-react';

export const CPVLandingPage = () => (
<div className="bx--grid cpv-landing-page__grid">
  <div className="bx--row cpv-landing-page__banner">
    <div className="bx--col-lg-16">
      <h1 className="cpv-landing-page__heading">Verify pass</h1>
    </div>
  </div>
  <div className="bx--row cpv-landing-page__r2">
    <div className="bx--col-lg-16">
      <p className="cpv-landing-page__p">
        Scan and verify a HCERT compliant government-issued COVID-19 passes.
      </p>
      <p className="cpv-landing-page__p">
        All processing (including scanning, parsing and verification) happens on the local
        device and no data is sent to external servers.
      </p>
    </div>
  </div>
  <div className="bx--row cpv-landing-page__r3">
    <div className="bx--col-lg-8">
      <Button>Scan QR Code</Button>
    </div>
  </div>
</div>);
