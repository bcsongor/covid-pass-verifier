import React from 'react';
import { LogoGithub32 } from '@carbon/icons-react';

import CPVScanner from '@cpv/components/CPVScanner';

export const CPVLandingPage = () => (
<div className="bx--grid cpv-landing-page__grid">
  <div className="bx--row cpv-landing-page__banner">
    <div className="bx--col-lg-16">
      <h1 className="cpv-landing-page__heading">COVID Pass Verifier</h1>
      <h2 className="cpv-landing-page__subheading">Scan and verify HCERT compliant government-issued COVID-19 passes.</h2>
    </div>
  </div>
  <div className="bx--row">
    <div className="bx--col-lg-16">
      <p>Compatible with EU Digital COVID Certificates 🇪🇺 and NHS COVID Passes 🇬🇧.</p>
    </div>
  </div>
  <div className="bx--row cpv-landing-page__scanner">
    <div className="bx--col-lg-16">
      <CPVScanner />
    </div>
  </div>
  <div className="bx--row">
    <div className="bx--col-lg-16 cpv-landing-page__disclaimer">
      <p>
        All processing (including scanning, parsing and verification) happens on the local
        device and no data is sent to external servers.
      </p>
      <p>
        <LogoGithub32 />
      </p>
    </div>
  </div>
</div>);
