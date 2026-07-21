import type { DegreeClassification } from '@chuo-gpa/types';
import { getUniversityRule, getDefaultRule } from '@chuo-gpa/university-rules';
import { roundGPA } from '@chuo-gpa/utils';

/**
 * Get the degree classification for a given GPA.
 */
export function getClassification(gpa: number, universityId?: string): DegreeClassification {
  if (typeof gpa !== 'number' || !Number.isFinite(gpa)) {
    throw new Error('GPA must be a finite number');
  }

  const rule =
    typeof universityId === 'string' && universityId.trim().length > 0
      ? getUniversityRule(universityId)
      : getDefaultRule();

  const rounded = roundGPA(gpa);

  for (const entry of rule.classificationScale) {
    if (rounded >= entry.minGPA && rounded <= entry.maxGPA) {
      return entry.classification;
    }
  }

  return 'Fail';
}

/**
 * Alias for {@link getClassification}.
 */
export function classify(gpa: number, universityId?: string): DegreeClassification {
  return getClassification(gpa, universityId);
}
