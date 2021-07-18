import { getFromValueSetValues } from '@cpv/lib/valuesets/common';
import { valueSetValues } from '@cpv/data/vaccine-medicinal-product.json';

export const getVaccineMedicinalProduct = (mp: string): string => getFromValueSetValues(valueSetValues, mp);
