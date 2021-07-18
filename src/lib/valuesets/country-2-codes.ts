import { getFromValueSetValues } from '@cpv/lib/valuesets/common';
import { valueSetValues } from '@cpv/data/country-2-codes.json';

export const getCountry = (c: string): string => getFromValueSetValues(valueSetValues, c);
