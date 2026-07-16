/**
 * @module @chuo-gpa/core
 * The core academic calculation engine for Tanzanian universities.
 *
 * Provides GPA, CGPA, degree classification, and grade conversion
 * according to different university grading systems in Tanzania.
 *
 * @example
 * ```typescript
 * import { calculateGPA, calculateCGPA, getClassification } from '@chuo-gpa/core';
 *
 * const result = calculateGPA({
 *   courses: [
 *     { name: 'Database Security', credits: 10, grade: 'A' },
 *     { name: 'Software Engineering', credits: 10, grade: 'B+' },
 *   ],
 * });
 *
 * console.log(result.gpa); // 4.5
 * ```
 *
 * @packageDocumentation
 */

export { calculateGPA } from './gpa.js';
export { calculateCGPA } from './cgpa.js';
export { getClassification, classify } from './classification.js';
export { gradeToPoint, scoreToGrade, convertGrade } from './grade-converter.js';
export { calculateTotalCredits, calculateQualityPoints } from './credits.js';

// Re-export types for convenience
export type {
  Course,
  CourseInput,
  GPAInput,
  GPAResult,
  CGPAInput,
  CGPAResult,
  CourseResult,
  SemesterInput,
  SemesterResult,
  DegreeClassification,
  UniversityGradingRule,
  GradeScaleEntry,
  ClassificationEntry,
} from '@chuo-gpa/types';
