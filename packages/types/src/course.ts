/**
 * Represents a course input for GPA calculation.
 */
export interface CourseInput {
  /** Course name or identifier */
  name: string;

  /** Credit hours/units for the course */
  credits: number;

  /** Letter grade received (e.g., "A", "B+", "B", "C", "D", "F") */
  grade: string;

  /** Optional percentage score (0–100) */
  score?: number;
}

/**
 * Alias for CourseInput — used when the context is generic.
 */
export type Course = CourseInput;
