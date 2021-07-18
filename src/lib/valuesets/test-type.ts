import { getFromValueSetValues } from '@cpv/lib/valuesets/common';
import { valueSetValues } from '@cpv/data/test-type.json';

export const getTestType = (tt: string): string => getFromValueSetValues(valueSetValues, tt);
