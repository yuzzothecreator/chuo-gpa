import type { CourseInput } from './course.js';
import type { DegreeClassification } from './classification.js';

/**
 * Input for a single semester's GPA calculation.
 */
export interface SemesterInput {
  /** Optional semester name (e.g., "Year 1 Semester 1") */
  name?: string;

  /** Optional academic year */
  year?: number;

  /** Courses taken in this semester */
  courses: CourseInput[];
}

/**
 * Input for GPA calculation.
 */
export interface GPAInput {
  /** University identifier (e.g., "udsm", "udom", "iaa"). Defaults to TCU standard. */
  universityId?: string;

  /** Courses to calculate GPA for */
  courses: CourseInput[];
}

/**
 * Input for CGPA calculation across multiple semesters.
 */
export interface CGPAInput {
  /** University identifier (e.g., "udsm", "udom", "iaa"). Defaults to TCU standard. */
  universityId?: string;

  /** Semesters with their courses */
  semesters: SemesterInput[];
}

/**
 * Result for a single course after GPA calculation.
 */
export interface CourseResult {
  /** Course name */
  name: string;

  /** Credit hours/units */
  credits: number;

  /** Letter grade */
  grade: string;

  /** Numeric grade point value */
  gradePoint: number;

  /** Quality points (gradePoint × credits) */
  qualityPoints: number;
}

/**
 * Result of a single semester's GPA calculation.
 */
export interface SemesterResult {
  /** Semester name */
  name?: string;

  /** Semester GPA */
  gpa: number;

  /** Total credits in this semester */
  totalCredits: number;

  /** Total quality points in this semester */
  totalGradePoints: number;

  /** Per-course results */
  courses: CourseResult[];
}

/**
 * Result of a GPA calculation.
 */
export interface GPAResult {
  /** Calculated GPA */
  gpa: number;

  /** Total credits */
  totalCredits: number;

  /** Total quality points (sum of gradePoint × credits) */
  totalGradePoints: number;

  /** Per-course breakdown */
  courses: CourseResult[];

  /** University used for calculation */
  universityId: string;
}

/**
 * Result of a CGPA calculation across semesters.
 */
export interface CGPAResult {
  /** Cumulative GPA */
  cgpa: number;

  /** Total credits across all semesters */
  totalCredits: number;

  /** Total quality points across all semesters */
  totalGradePoints: number;

  /** Per-semester breakdown */
  semesters: SemesterResult[];

  /** Degree classification based on CGPA */
  classification: DegreeClassification;

  /** University used for calculation */
  universityId: string;
}
