import { HCERT, VaccinationGroup } from '@cpv/lib/hcert';

export enum HCERTStatus {
  FullyVaccinated = 0,
  PartiallyVaccinated,
  NotVaccinated,
  Expired,
  UnverifiedSignature,
  Error,
}

export const validateHCERT = ({ iat, exp, hcert, sig }: HCERT): HCERTStatus => {
  if (!sig) return HCERTStatus.UnverifiedSignature;

  const now = Math.floor(Date.now() / 1000);

  if (iat > now) return HCERTStatus.Expired;
  if (exp < now) return HCERTStatus.Expired;

  // Filter out non-COVID-19 vaccines.
  const v = hcert.v.filter((vv) => vv.tg === '840539006');

  if (v.length === 0) return HCERTStatus.NotVaccinated;

  if (v.length > 0) {
    // Group doses by vaccine.
    const grouped = v.reduce((acc, curr) => {
      acc[curr.vp] = [...(acc[curr.vp] || []), curr];
      return acc;
    }, {} as { [key: string]: VaccinationGroup[] });

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
