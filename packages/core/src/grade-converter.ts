import type { GradeScaleEntry } from '@chuo-gpa/types';
import { getUniversityRule, getDefaultRule } from '@chuo-gpa/university-rules';

function resolveRule(universityId?: string) {
  if (typeof universityId === 'string' && universityId.trim().length > 0) {
    return getUniversityRule(universityId);
  }
  return getDefaultRule();
}

/**
 * Convert a letter grade to its numeric grade point value.
 */
export function gradeToPoint(grade: string, universityId?: string): number {
  if (typeof grade !== 'string') {
    throw new Error('Grade must be a string');
  }

  const rule = resolveRule(universityId);
  const normalizedGrade = grade.trim().toUpperCase();

  if (normalizedGrade.length === 0) {
    throw new Error('Grade must be a non-empty string');
  }

  const entry = rule.gradeScale.find((e) => e.grade.toUpperCase() === normalizedGrade);

  if (!entry) {
    const validGrades = rule.gradeScale.map((e) => e.grade).join(', ');
    throw new Error(
      `Grade not found in ${rule.universityName} grading scale. Valid grades: ${validGrades}`,
    );
  }

  return entry.gradePoint;
}

/**
 * Convert a percentage score to its corresponding letter grade.
 */
export function scoreToGrade(score: number, universityId?: string): GradeScaleEntry {
  if (typeof score !== 'number' || !Number.isFinite(score)) {
    throw new Error('Score must be a finite number');
  }
  if (score < 0 || score > 100) {
    throw new Error(`Score must be between 0 and 100, got ${score}`);
  }

  const rule = resolveRule(universityId);

  const entry = rule.gradeScale.find(
    (e) =>
      e.minScore !== undefined &&
      e.maxScore !== undefined &&
      score >= e.minScore &&
      score <= e.maxScore,
  );

  if (!entry) {
    throw new Error(`No grade found for score in ${rule.universityName} grading scale`);
  }

  return entry;
}

/**
 * Convert a grade to a complete grade information object.
 * Accepts either a letter grade or a percentage score.
 */
export function convertGrade(input: string | number, universityId?: string): GradeScaleEntry {
  if (typeof input === 'number') {
    return scoreToGrade(input, universityId);
  }

  if (typeof input !== 'string') {
    throw new Error('Grade input must be a string or number');
  }

  const rule = resolveRule(universityId);
  const normalizedGrade = input.trim().toUpperCase();

  if (normalizedGrade.length === 0) {
    throw new Error('Grade must be a non-empty string');
  }

  const entry = rule.gradeScale.find((e) => e.grade.toUpperCase() === normalizedGrade);

  if (!entry) {
    const validGrades = rule.gradeScale.map((e) => e.grade).join(', ');
    throw new Error(
      `Grade not found in ${rule.universityName} grading scale. Valid grades: ${validGrades}`,
    );
  }

  return entry;
}
