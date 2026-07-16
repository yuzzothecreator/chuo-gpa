/**
 * @module @chuo-gpa/udsm
 * University of Dar es Salaam — pre-bound GPA calculator.
 *
 * @example
 * ```typescript
 * import { calculateGPA } from '@chuo-gpa/udsm';
 *
 * const result = calculateGPA({
 *   courses: [{ name: 'Database Security', credits: 10, grade: 'A' }],
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

const UNIVERSITY_ID = 'udsm';

/**
 * Calculate GPA using UDSM grading rules.
 *
 * @param input - Object with a `courses` array
 * @returns GPA result with UDSM grading applied
 */
export function calculateGPA(input: { courses: CourseInput[] }): GPAResult {
  return coreCalculateGPA({ ...input, universityId: UNIVERSITY_ID });
}

/**
 * Calculate CGPA using UDSM grading rules.
 *
 * @param input - Object with a `semesters` array
 * @returns CGPA result with degree classification
 */
export function calculateCGPA(input: { semesters: SemesterInput[] }): CGPAResult {
  return coreCalculateCGPA({ ...input, universityId: UNIVERSITY_ID });
}

/**
 * Get degree classification for a GPA using UDSM rules.
 *
 * @param gpa - The GPA value
 * @returns The degree classification
 */
export function getClassification(gpa: number): DegreeClassification {
  return coreGetClassification(gpa, UNIVERSITY_ID);
}

/**
 * Convert a letter grade to its grade point using UDSM scale.
 *
 * @param grade - The letter grade
 * @returns The numeric grade point
 */
export function gradeToPoint(grade: string): number {
  return coreGradeToPoint(grade, UNIVERSITY_ID);
}
