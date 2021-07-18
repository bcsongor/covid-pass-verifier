import { LogoGithub16 } from '@carbon/icons-react';
import CPVScanner from '@cpv/components/CPVScanner';

export const CPVLandingPage = (): JSX.Element => (
  <div className="bx--grid cpv-landing-page__grid">
    <div className="bx--row cpv-landing-page__banner">
      <div className="bx--col-lg-16">
        <h1 className="cpv-landing-page__heading">COVID Pass Verifier</h1>
        <h2 className="cpv-landing-page__subheading">
          Scan and verify HCERT compliant government-issued COVID-19 passes.
        </h2>
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
          All processing (including scanning, parsing and verification) happens on the local device and no data is sent
          to external servers.
        </p>
        <p>
          Please{' '}
          <a href="mailto:hello@covid-pass-verifier.com" target="_blank" rel="noreferrer">
            email me
          </a>{' '}
          at <span className="email">hello@covid-pass-verifier.com</span> with any questions or concerns. The source
          code for the enitre web application is available{' '}
          <a href="https://github.com/bcsongor/covid-pass-verifier" target="_blank" rel="noreferrer">
            on&nbsp;&nbsp;
            <LogoGithub16 /> GitHub
          </a>
          .
        </p>
      </div>
    </div>
    <div className="bx--row">
      <div className="bx--col-lg-8 bx--offset-lg-4 bx--col-sm-2 bx--offset-sm-1 cpv-landing-page__footer">
        v{process.env.REACT_APP_GIT_DATE}-{process.env.REACT_APP_GIT_SHA}
      </div>
    </div>
  </div>
);
