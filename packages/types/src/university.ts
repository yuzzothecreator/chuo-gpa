import type { DegreeClassification } from './classification.js';

/**
 * A single entry in a university's grading scale.
 */
export interface GradeScaleEntry {
  /** Letter grade (e.g., "A", "B+", "B", "C", "D", "F") */
  grade: string;

  /** Numeric grade point value */
  gradePoint: number;

  /** Minimum percentage score for this grade (inclusive) */
  minScore?: number;

  /** Maximum percentage score for this grade (inclusive) */
  maxScore?: number;
}

/**
 * A single entry in a university's degree classification scale.
 */
export interface ClassificationEntry {
  /** The classification label */
  classification: DegreeClassification;

  /** Minimum GPA for this classification (inclusive) */
  minGPA: number;

  /** Maximum GPA for this classification (inclusive) */
  maxGPA: number;
}

/**
 * Complete grading rule definition for a university.
 * This is the plugin interface — implement this to add a new university.
 */
export interface UniversityGradingRule {
  /** Unique identifier (e.g., "udsm", "udom", "iaa") */
  universityId: string;

  /** Full university name */
  universityName: string;

  /** Grade scale mapping letter grades to grade points */
  gradeScale: GradeScaleEntry[];

  /** Degree classification scale mapping GPA ranges to classifications */
  classificationScale: ClassificationEntry[];

  /** Maximum possible GPA (e.g., 5.0 for TCU standard) */
  maxGPA: number;
}
