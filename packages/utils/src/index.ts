/**
 * @module @chuo-gpa/utils
 * Shared utility functions for the Chuo-GPA ecosystem.
 *
 * @packageDocumentation
 */

export { roundToDecimal, roundGPA } from './rounding.js';
export {
  ValidationError,
  validateCredits,
  validateGrade,
  validateScore,
  validateCourses,
  validateSemesters,
  MAX_COURSES,
  MAX_SEMESTERS,
  MAX_CREDITS_PER_COURSE,
  MAX_COURSE_NAME_LENGTH,
} from './validation.js';
export { formatGPA, formatClassification } from './formatting.js';
