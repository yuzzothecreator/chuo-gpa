import type { CourseInput, CourseResult } from '@chuo-gpa/types';
import { gradeToPoint } from './grade-converter.js';

/**
 * Calculate total credits from an array of courses.
 *
 * @param courses - Array of course inputs
 * @returns Total credit hours
 *
 * @example
 * ```typescript
 * calculateTotalCredits([
 *   { name: 'Math', credits: 10, grade: 'A' },
 *   { name: 'CS', credits: 10, grade: 'B' },
 * ]); // 20
 * ```
 */
export function calculateTotalCredits(courses: CourseInput[]): number {
  return courses.reduce((sum, course) => sum + course.credits, 0);
}

/**
 * Calculate total quality points (sum of gradePoint × credits) for courses.
 *
 * @param courses - Array of course inputs
 * @param universityId - Optional university identifier
 * @returns Total quality points
 *
 * @example
 * ```typescript
 * calculateQualityPoints([
 *   { name: 'Math', credits: 10, grade: 'A' },   // 5.0 × 10 = 50
 *   { name: 'CS', credits: 10, grade: 'B' },     // 3.0 × 10 = 30
 * ]); // 80
 * ```
 */
export function calculateQualityPoints(courses: CourseInput[], universityId?: string): number {
  return courses.reduce((sum, course) => {
    const point = gradeToPoint(course.grade, universityId);
    return sum + point * course.credits;
  }, 0);
}

/**
 * Build detailed course results with grade points and quality points.
 *
 * @internal
 * @param courses - Array of course inputs
 * @param universityId - Optional university identifier
 * @returns Array of detailed course results
 */
export function buildCourseResults(courses: CourseInput[], universityId?: string): CourseResult[] {
  return courses.map((course) => {
    const point = gradeToPoint(course.grade, universityId);
    return {
      name: course.name,
      credits: course.credits,
      grade: course.grade.trim().toUpperCase(),
      gradePoint: point,
      qualityPoints: point * course.credits,
    };
  });
}
