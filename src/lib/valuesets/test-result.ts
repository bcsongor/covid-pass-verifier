import { getFromValueSetValues } from '@cpv/lib/valuesets/common';
import { valueSetValues } from '@cpv/data/test-result.json';

export const getTestResult = (tr: string): string => getFromValueSetValues(valueSetValues, tr);
