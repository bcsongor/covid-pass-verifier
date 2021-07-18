import { HCERT, TestEntry, VaccinationEntry } from '@cpv/lib/hcert';
import { TargetDisease } from './valuesets/disease-agent-targeted';
import { TestResult } from './valuesets/test-result';

export enum HCERTStatus {
  FullyVaccinated = 0,
  PartiallyVaccinated,
  NotVaccinated,
  Negative,
  Positive,
  Expired,
  UnverifiedSignature,
  Error,
}

const validateVaccinationGroup = (vg: VaccinationEntry[]): HCERTStatus => {
  // Filter out non-COVID-19 vaccines.
  const v = vg.filter((vv) => vv.tg === TargetDisease.COVID19);

  if (v.length === 0) return HCERTStatus.NotVaccinated;

  if (v.length > 0) {
    // Group doses by vaccine.
    const grouped = v.reduce((acc, curr) => {
      acc[curr.vp] = [...(acc[curr.vp] || []), curr];
      return acc;
    }, {} as { [key: string]: VaccinationEntry[] });

    // For each vaccine get the doses required and current doses.
    const doses = Object.values(grouped).map((group) =>
      group.reduce(
        (acc, curr) => {
          const sd = parseInt(curr.sd, 10);
          const dn = parseInt(curr.dn, 10);

          if (acc.required < sd) acc.required = sd;
          if (acc.got < dn) acc.got = dn;

          return acc;
        },
        { required: 0, got: 0 },
      ),
    );

    // Check if there's at least one vaccine for which all doses have been administered.
    const hasAllDoses = doses.some((d) => d.required === d.got);

    if (!hasAllDoses) return HCERTStatus.PartiallyVaccinated;
  }

  return HCERTStatus.FullyVaccinated;
};

const validateTestGroup = (t: TestEntry[]): HCERTStatus => {
  // ISO-8601 dates can be lexicographically ordered.
  const latestTest = t.sort((a, b) => b.tt.localeCompare(a.tt))[0];

  if (latestTest.tr === TestResult.Positive) return HCERTStatus.Positive;
  return HCERTStatus.Negative;
};

export const validateHCERT = ({ iat, exp, hcert, sig }: HCERT): HCERTStatus => {
  if (!sig) return HCERTStatus.UnverifiedSignature;

  const now = Math.floor(Date.now() / 1000);

  if (iat > now) return HCERTStatus.Expired;
  if (exp < now) return HCERTStatus.Expired;

  if (hcert.v) return validateVaccinationGroup(hcert.v);
  else if (hcert.t) return validateTestGroup(hcert.t);
  else return HCERTStatus.Error;
};
