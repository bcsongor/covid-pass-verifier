import { getFromValueSetValues } from '@cpv/lib/valuesets/common';
import { valueSetValues } from '@cpv/data/vaccine-mah-manf.json';

export const getVaccineManufacturer = (ma: string) => getFromValueSetValues(valueSetValues, ma);
