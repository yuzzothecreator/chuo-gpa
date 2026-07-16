/**
 * @module @chuo-gpa/university-rules
 * University grading rules registry for the Chuo-GPA ecosystem.
 *
 * @packageDocumentation
 */

export {
  getUniversityRule,
  listUniversities,
  registerUniversity,
  hasUniversity,
  getDefaultRule,
  DEFAULT_UNIVERSITY_ID,
} from './registry.js';
