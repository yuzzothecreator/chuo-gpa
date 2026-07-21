import type { CourseInput, SemesterInput, GradeScaleEntry } from '@chuo-gpa/types';

/**
 * Error thrown when input validation fails.
 */
export class ValidationError extends Error {
  public readonly field: string;
  public readonly value: unknown;

  constructor(message: string, field: string, value?: unknown) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }
}

/**
 * Validate that credits are a positive number.
 *
 * @param credits - The credit value to validate
 * @param courseName - Course name for error context
 * @throws {ValidationError} If credits are invalid
 */
export function validateCredits(credits: number, courseName: string = 'unknown'): void {
  if (typeof credits !== 'number' || isNaN(credits)) {
    throw new ValidationError(
      `Invalid credits for course "${courseName}": credits must be a number`,
      'credits',
      credits,
    );
  }
  if (credits <= 0) {
    throw new ValidationError(
      `Invalid credits for course "${courseName}": credits must be greater than 0, got ${credits}`,
      'credits',
      credits,
    );
  }
}

/**
 * Validate that a grade exists in the given grade scale.
 *
 * @param grade - The grade to validate
 * @param gradeScale - The valid grade scale entries
 * @param courseName - Course name for error context
 * @throws {ValidationError} If the grade is not in the scale
 */
export function validateGrade(
  grade: string,
  gradeScale: GradeScaleEntry[],
  courseName: string = 'unknown',
): void {
  if (typeof grade !== 'string' || grade.trim().length === 0) {
    throw new ValidationError(
      `Invalid grade for course "${courseName}": grade must be a non-empty string`,
      'grade',
      grade,
    );
  }

  const normalizedGrade = grade.trim().toUpperCase();
  const validGrades = gradeScale.map((entry) => entry.grade.toUpperCase());

  if (!validGrades.includes(normalizedGrade)) {
    throw new ValidationError(
      `Invalid grade "${grade}" for course "${courseName}". Valid grades are: ${validGrades.join(', ')}`,
      'grade',
      grade,
    );
  }
}

/**
 * Validate an array of course inputs.
 *
 * @param courses - The courses to validate
 * @param gradeScale - The valid grade scale entries
 * @throws {ValidationError} If any course has invalid data
 */
export function validateCourses(courses: CourseInput[], gradeScale: GradeScaleEntry[]): void {
  if (!Array.isArray(courses)) {
    throw new ValidationError('Courses must be an array', 'courses', courses);
  }

  if (courses.length === 0) {
    throw new ValidationError('At least one course is required', 'courses', courses);
  }

  for (const course of courses) {
    if (!course.name || typeof course.name !== 'string') {
      throw new ValidationError('Each course must have a non-empty name', 'name', course.name);
    }
    validateCredits(course.credits, course.name);
    validateGrade(course.grade, gradeScale, course.name);
  }
}

/**
 * Validate an array of semester inputs.
 *
 * @param semesters - The semesters to validate
 * @param gradeScale - The valid grade scale entries
 * @throws {ValidationError} If any semester has invalid data
 */
export function validateSemesters(semesters: SemesterInput[], gradeScale: GradeScaleEntry[]): void {
  if (!Array.isArray(semesters)) {
    throw new ValidationError('Semesters must be an array', 'semesters', semesters);
  }

  if (semesters.length === 0) {
    throw new ValidationError('At least one semester is required', 'semesters', semesters);
  }

  for (let i = 0; i < semesters.length; i++) {
    const semester = semesters[i]!;

    if (!semester.courses || !Array.isArray(semester.courses)) {
      throw new ValidationError(
        `Semester ${i + 1} must have a courses array`,
        'courses',
        semester.courses,
      );
    }

    validateCourses(semester.courses, gradeScale);
  }
}
