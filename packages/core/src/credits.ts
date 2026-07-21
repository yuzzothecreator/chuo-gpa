import type { CourseInput, CourseResult } from '@chuo-gpa/types';
import { gradeToPoint } from './grade-converter.js';

/**
 * Calculate total credits from an array of courses.
 */
export function calculateTotalCredits(courses: CourseInput[]): number {
  return courses.reduce((sum, course) => sum + course.credits, 0);
}

/**
 * Calculate total quality points (sum of gradePoint × credits) for courses.
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
 */
export function buildCourseResults(courses: CourseInput[], universityId?: string): CourseResult[] {
  return courses.map((course) => {
    const point = gradeToPoint(course.grade, universityId);
    return {
      name: course.name.trim(),
      credits: course.credits,
      grade: course.grade.trim().toUpperCase(),
      gradePoint: point,
      qualityPoints: point * course.credits,
    };
  });
}
