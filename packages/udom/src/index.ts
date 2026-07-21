/**
 * @module @chuo-gpa/udom
 * University of Dodoma — pre-bound GPA calculator.
 *
 * @example
 * ```typescript
 * import { calculateGPA } from '@chuo-gpa/udom';
 *
 * const result = calculateGPA({
 *   courses: [{ name: 'Database Security', credits: 10, grade: 'A' }],
 * });
 * ```
 *
 * @packageDocumentation
 */

import type {
  CourseInput,
  SemesterInput,
  GPAResult,
  CGPAResult,
  DegreeClassification,
} from '@chuo-gpa/types';
import {
  calculateGPA as coreCalculateGPA,
  calculateCGPA as coreCalculateCGPA,
  getClassification as coreGetClassification,
  gradeToPoint as coreGradeToPoint,
} from '@chuo-gpa/core';

const UNIVERSITY_ID = 'udom';

/**
 * Calculate GPA using UDOM grading rules.
 */
export function calculateGPA(input: { courses: CourseInput[] }): GPAResult {
  return coreCalculateGPA({ ...input, universityId: UNIVERSITY_ID });
}

/**
 * Calculate CGPA using UDOM grading rules.
 */
export function calculateCGPA(input: { semesters: SemesterInput[] }): CGPAResult {
  return coreCalculateCGPA({ ...input, universityId: UNIVERSITY_ID });
}

/**
 * Get degree classification for a GPA using UDOM rules.
 */
export function getClassification(gpa: number): DegreeClassification {
  return coreGetClassification(gpa, UNIVERSITY_ID);
}

/**
 * Convert a letter grade to its grade point using UDOM scale.
 */
export function gradeToPoint(grade: string): number {
  return coreGradeToPoint(grade, UNIVERSITY_ID);
}
