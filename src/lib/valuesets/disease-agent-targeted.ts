import { getFromValueSetValues } from '@cpv/lib/valuesets/common';
import { valueSetValues } from '@cpv/data/disease-agent-targeted.json';

export enum TargetDisease {
  COVID19 = '840539006',
}

export const getTargetDisease = (tg: string): string => getFromValueSetValues(valueSetValues, tg);
