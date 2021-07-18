import { getFromValueSetValues } from '@cpv/lib/valuesets/common';
import { valueSetValues } from '@cpv/data/test-manf.json';

export const getTestManufacturer = (ma: string): string => getFromValueSetValues(valueSetValues, ma);
