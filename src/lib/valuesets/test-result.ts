import { getFromValueSetValues } from '@cpv/lib/valuesets/common';
import { valueSetValues } from '@cpv/data/test-result.json';

export enum TestResult {
  Negative = '260415000',
  Positive = '260373001',
}

export const getTestResult = (tr: string): string => getFromValueSetValues(valueSetValues, tr);
