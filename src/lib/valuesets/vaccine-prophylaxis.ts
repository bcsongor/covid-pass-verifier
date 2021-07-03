import { getFromValueSetValues } from '@cpv/lib/valuesets/common';
import { valueSetValues } from '@cpv/data/vaccine-prophylaxis.json';

export const getVaccineProphylaxis = (vp: string) => getFromValueSetValues(valueSetValues, vp);
