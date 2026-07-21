import type { GPAInput, GPAResult } from '@chuo-gpa/types';
import {
  getUniversityRule,
  getDefaultRule,
  DEFAULT_UNIVERSITY_ID,
} from '@chuo-gpa/university-rules';
import { validateCourses } from '@chuo-gpa/utils';
import { roundGPA } from '@chuo-gpa/utils';
import { buildCourseResults, calculateTotalCredits, calculateQualityPoints } from './credits.js';

/**
 * Calculate GPA (Grade Point Average) for a set of courses.
 *
 * Formula: GPA = Σ(gradePoint × credits) / Σ(credits)
 *
 * @param input - The GPA calculation input containing courses and optional university ID
 * @returns Detailed GPA result with per-course breakdown
 * @throws {ValidationError} If input data is invalid
 * @throws {Error} If the university is not found
 *
 * @example
 * ```typescript
 * const result = calculateGPA({
 *   courses: [
 *     { name: 'Database Security', credits: 10, grade: 'A' },
 *     { name: 'Software Engineering', credits: 10, grade: 'B+' },
 *     { name: 'Data Structures', credits: 10, grade: 'B' },
 *   ],
 * });
 *
 * console.log(result.gpa);          // 4.0
 * console.log(result.totalCredits); // 30
 * ```
 *
 * @example
 * ```typescript
 * // University-specific calculation
 * const result = calculateGPA({
 *   universityId: 'udsm',
 *   courses: [
 *     { name: 'Database Security', credits: 10, grade: 'A' },
 *   ],
 * });
 * ```
 */
export function calculateGPA(input: GPAInput): GPAResult {
  const universityId = input.universityId ?? DEFAULT_UNIVERSITY_ID;
  const rule = input.universityId ? getUniversityRule(input.universityId) : getDefaultRule();

  // Validate input
  validateCourses(input.courses, rule.gradeScale);

  // Calculate
  const totalCredits = calculateTotalCredits(input.courses);
  const totalGradePoints = calculateQualityPoints(input.courses, input.universityId);
  const gpa = roundGPA(totalGradePoints / totalCredits);
  const courses = buildCourseResults(input.courses, input.universityId);

  return {
    gpa,
    totalCredits,
    totalGradePoints,
    courses,
    universityId,
  };
}
