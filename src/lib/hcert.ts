export interface VaccinationEntry {
  tg: string; // target disease, e.g. "840539006" for COVID-19
  vp: string; // vaccine, e.g. "1119349007" for a SARS-CoV-2 mRNA vaccine
  mp: string; // vaccine product
  ma: string; // manufacturer of the vaccine product
  dn: string; // number of dose in a series of doses
  sd: string; // total number of doses in a series
  dt: string; // date of vaccination
  co: string; // country that administered the vaccine
  is: string; // certificate issuer
  ci: string; // unique certificate identifier
}

export interface TestEntry {
  tg: string; // target disease
  tt: string; // type of test
  nm?: string; // name of the nucleic acid amplification test (NAAT)
  ma?: string; // name and manufacturer of the rapid antigen test (RAT)
  sc: string; // test collection timestamp
  tr: string; // test result
  tc?: string; // testing centre
  co: string; // country of test
  is: string; // certificate issuer
  ci: string; // unique certificate identifier
}

export interface DigitalHealthCertificate {
  ver: string; // version
  dob: string; // date of birth
  nam: {
    fn: string; // forename
    fnt: string; // standardised forename (ICAO 9303)
    gn: string; // surname
    gnt: string; // standardised surname (ICAO 9303)
  };
  v?: VaccinationEntry[];
  t?: TestEntry[];
}

/**
 * Specified in https://ec.europa.eu/health/sites/default/files/ehealth/docs/covid-certificate_json_specification_en.pdf.
 * JSON schema: https://raw.githubusercontent.com/ehn-dcc-development/ehn-dcc-schema/release/1.3.0/DCC.combined-schema.json.
 */
export interface HCERT {
  iss: string; // issuer country (alpha-2)
  iat: number; // issued at timestamp
  exp: number; // expires at timestamp
  hcert: DigitalHealthCertificate;
  sig: boolean; // signature validity
}
