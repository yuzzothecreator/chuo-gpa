/**
 * @module @chuo-gpa/iaa
 * Institute of Accountancy Arusha — pre-bound GPA calculator.
 *
 * @example
 * ```typescript
 * import { calculateGPA } from '@chuo-gpa/iaa';
 *
 * const result = calculateGPA({
 *   courses: [{ name: 'Financial Accounting', credits: 10, grade: 'A' }],
 * });
 * ```
 *
 * @packageDocumentation
 */

import type { CourseInput, SemesterInput, GPAResult, CGPAResult, DegreeClassification } from '@chuo-gpa/types';
import {
  calculateGPA as coreCalculateGPA,
  calculateCGPA as coreCalculateCGPA,
  getClassification as coreGetClassification,
  gradeToPoint as coreGradeToPoint,
} from '@chuo-gpa/core';

const UNIVERSITY_ID = 'iaa';

/**
 * Calculate GPA using IAA grading rules.
 */
export function calculateGPA(input: { courses: CourseInput[] }): GPAResult {
  return coreCalculateGPA({ ...input, universityId: UNIVERSITY_ID });
}

/**
 * Calculate CGPA using IAA grading rules.
 */
export function calculateCGPA(input: { semesters: SemesterInput[] }): CGPAResult {
  return coreCalculateCGPA({ ...input, universityId: UNIVERSITY_ID });
}

/**
 * Get degree classification for a GPA using IAA rules.
 */
export function getClassification(gpa: number): DegreeClassification {
  return coreGetClassification(gpa, UNIVERSITY_ID);
}

/**
 * Convert a letter grade to its grade point using IAA scale.
 */
export function gradeToPoint(grade: string): number {
  return coreGradeToPoint(grade, UNIVERSITY_ID);
}
