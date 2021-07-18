import { getFromValueSetValues } from '@cpv/lib/valuesets/common';
import { valueSetValues } from '@cpv/data/disease-agent-targeted.json';

export const getTargetDisease = (tg: string): string => getFromValueSetValues(valueSetValues, tg);
