/**
 * @module @chuo-gpa/types
 * Shared TypeScript type definitions for the Chuo-GPA ecosystem.
 *
 * @packageDocumentation
 */

export type { Course, CourseInput } from './course.js';
export type {
  GPAResult,
  GPAInput,
  CGPAResult,
  CGPAInput,
  CourseResult,
  SemesterInput,
  SemesterResult,
} from './gpa.js';
export type { UniversityGradingRule, GradeScaleEntry, ClassificationEntry } from './university.js';
export type { DegreeClassification } from './classification.js';
