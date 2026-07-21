import type { CourseInput, SemesterInput, GradeScaleEntry } from '@chuo-gpa/types';

/** Maximum courses allowed in a single GPA calculation. */
export const MAX_COURSES = 100;

/** Maximum semesters allowed in a CGPA calculation. */
export const MAX_SEMESTERS = 40;

/** Maximum credits allowed for a single course. */
export const MAX_CREDITS_PER_COURSE = 100;

/** Maximum length for a course name. */
export const MAX_COURSE_NAME_LENGTH = 200;

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
    // Never retain huge attacker-controlled payloads
    this.value = typeof value === 'string' ? value.slice(0, 100) : value;
  }
}

/**
 * Validate that credits are a finite positive number within bounds.
 */
export function validateCredits(credits: number, courseName: string = 'unknown'): void {
  if (typeof credits !== 'number' || !Number.isFinite(credits)) {
    throw new ValidationError(
      `Invalid credits for course "${courseName}": credits must be a finite number`,
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
  if (credits > MAX_CREDITS_PER_COURSE) {
    throw new ValidationError(
      `Invalid credits for course "${courseName}": credits must be at most ${MAX_CREDITS_PER_COURSE}`,
      'credits',
      credits,
    );
  }
}

/**
 * Validate that a grade exists in the given grade scale.
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
      `Invalid grade for course "${courseName}". Valid grades are: ${validGrades.join(', ')}`,
      'grade',
      grade,
    );
  }
}

/**
 * Validate optional percentage score and consistency with letter grade.
 */
export function validateScore(
  score: number | undefined,
  grade: string,
  gradeScale: GradeScaleEntry[],
  courseName: string,
): void {
  if (score === undefined) {
    return;
  }

  if (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > 100) {
    throw new ValidationError(
      `Invalid score for course "${courseName}": score must be a finite number between 0 and 100`,
      'score',
      score,
    );
  }

  const normalizedGrade = grade.trim().toUpperCase();
  const entry = gradeScale.find((e) => e.grade.toUpperCase() === normalizedGrade);
  if (
    entry &&
    entry.minScore !== undefined &&
    entry.maxScore !== undefined &&
    (score < entry.minScore || score > entry.maxScore)
  ) {
    throw new ValidationError(
      `Score for course "${courseName}" does not match grade ${normalizedGrade}`,
      'score',
      score,
    );
  }
}

/**
 * Validate an array of course inputs.
 */
export function validateCourses(courses: CourseInput[], gradeScale: GradeScaleEntry[]): void {
  if (!Array.isArray(courses)) {
    throw new ValidationError('Courses must be an array', 'courses', courses);
  }

  if (courses.length === 0) {
    throw new ValidationError('At least one course is required', 'courses', courses);
  }

  if (courses.length > MAX_COURSES) {
    throw new ValidationError(
      `Too many courses: maximum is ${MAX_COURSES}`,
      'courses',
      courses.length,
    );
  }

  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];

    if (!course || typeof course !== 'object') {
      throw new ValidationError(`Course at index ${i} is invalid`, 'courses', course);
    }

    if (typeof course.name !== 'string' || course.name.trim().length === 0) {
      throw new ValidationError('Each course must have a non-empty name', 'name', course.name);
    }

    if (course.name.trim().length > MAX_COURSE_NAME_LENGTH) {
      throw new ValidationError(
        `Course name must be at most ${MAX_COURSE_NAME_LENGTH} characters`,
        'name',
      );
    }

    const name = course.name.trim();
    validateCredits(course.credits, name);
    validateGrade(course.grade, gradeScale, name);
    validateScore(course.score, course.grade, gradeScale, name);
  }
}

/**
 * Validate an array of semester inputs.
 */
export function validateSemesters(semesters: SemesterInput[], gradeScale: GradeScaleEntry[]): void {
  if (!Array.isArray(semesters)) {
    throw new ValidationError('Semesters must be an array', 'semesters', semesters);
  }

  if (semesters.length === 0) {
    throw new ValidationError('At least one semester is required', 'semesters', semesters);
  }

  if (semesters.length > MAX_SEMESTERS) {
    throw new ValidationError(
      `Too many semesters: maximum is ${MAX_SEMESTERS}`,
      'semesters',
      semesters.length,
    );
  }

  for (let i = 0; i < semesters.length; i++) {
    const semester = semesters[i];

    if (!semester || typeof semester !== 'object') {
      throw new ValidationError(`Semester ${i + 1} is invalid`, 'semesters', semester);
    }

    if (!Array.isArray(semester.courses)) {
      throw new ValidationError(
        `Semester ${i + 1} must have a courses array`,
        'courses',
        semester.courses,
      );
    }

    validateCourses(semester.courses, gradeScale);
  }
}
