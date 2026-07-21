import type { DegreeClassification } from '@chuo-gpa/types';
import { getUniversityRule, getDefaultRule } from '@chuo-gpa/university-rules';

/**
 * Get the degree classification for a given GPA.
 *
 * @param gpa - The GPA value to classify
 * @param universityId - Optional university identifier. Defaults to TCU standard.
 * @returns The degree classification
 *
 * @example
 * ```typescript
 * getClassification(4.5);          // "First Class"
 * getClassification(3.8, 'udsm'); // "Upper Second Class"
 * getClassification(1.5);          // "Fail"
 * ```
 */
export function getClassification(gpa: number, universityId?: string): DegreeClassification {
  const rule = universityId ? getUniversityRule(universityId) : getDefaultRule();

  for (const entry of rule.classificationScale) {
    if (gpa >= entry.minGPA && gpa <= entry.maxGPA) {
      return entry.classification;
    }
  }

  return 'Fail';
}

/**
 * Alias for {@link getClassification}.
 *
 * @param gpa - The GPA value to classify
 * @param universityId - Optional university identifier
 * @returns The degree classification
 */
export function classify(gpa: number, universityId?: string): DegreeClassification {
  return getClassification(gpa, universityId);
}
