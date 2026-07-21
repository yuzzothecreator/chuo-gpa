import type { GradeScaleEntry } from '@chuo-gpa/types';
import { getUniversityRule, getDefaultRule } from '@chuo-gpa/university-rules';

/**
 * Convert a letter grade to its numeric grade point value.
 *
 * @param grade - The letter grade (e.g., "A", "B+", "B")
 * @param universityId - Optional university identifier. Defaults to TCU standard.
 * @returns The numeric grade point value
 * @throws {Error} If the grade is not found in the university's scale
 *
 * @example
 * ```typescript
 * gradeToPoint('A');           // 5.0
 * gradeToPoint('B+', 'udsm'); // 4.0
 * ```
 */
export function gradeToPoint(grade: string, universityId?: string): number {
  const rule = universityId ? getUniversityRule(universityId) : getDefaultRule();
  const normalizedGrade = grade.trim().toUpperCase();

  const entry = rule.gradeScale.find((e) => e.grade.toUpperCase() === normalizedGrade);

  if (!entry) {
    const validGrades = rule.gradeScale.map((e) => e.grade).join(', ');
    throw new Error(
      `Grade "${grade}" not found in ${rule.universityName} grading scale. Valid grades: ${validGrades}`,
    );
  }

  return entry.gradePoint;
}

/**
 * Convert a percentage score to its corresponding letter grade.
 *
 * @param score - The percentage score (0–100)
 * @param universityId - Optional university identifier. Defaults to TCU standard.
 * @returns The corresponding grade scale entry
 * @throws {Error} If the score is out of range or no matching grade is found
 *
 * @example
 * ```typescript
 * scoreToGrade(85);          // { grade: 'A', gradePoint: 5.0, minScore: 70, maxScore: 100 }
 * scoreToGrade(55, 'udsm');  // { grade: 'B', gradePoint: 3.0, minScore: 50, maxScore: 59 }
 * ```
 */
export function scoreToGrade(score: number, universityId?: string): GradeScaleEntry {
  if (score < 0 || score > 100) {
    throw new Error(`Score must be between 0 and 100, got ${score}`);
  }

  const rule = universityId ? getUniversityRule(universityId) : getDefaultRule();

  const entry = rule.gradeScale.find(
    (e) =>
      e.minScore !== undefined &&
      e.maxScore !== undefined &&
      score >= e.minScore &&
      score <= e.maxScore,
  );

  if (!entry) {
    throw new Error(`No grade found for score ${score} in ${rule.universityName} grading scale`);
  }

  return entry;
}

/**
 * Convert a grade to a complete grade information object.
 *
 * Accepts either a letter grade or a percentage score.
 *
 * @param input - Letter grade string or numeric score
 * @param universityId - Optional university identifier
 * @returns The grade scale entry with full information
 *
 * @example
 * ```typescript
 * convertGrade('A');   // { grade: 'A', gradePoint: 5.0, minScore: 70, maxScore: 100 }
 * convertGrade(85);    // { grade: 'A', gradePoint: 5.0, minScore: 70, maxScore: 100 }
 * ```
 */
export function convertGrade(input: string | number, universityId?: string): GradeScaleEntry {
  if (typeof input === 'number') {
    return scoreToGrade(input, universityId);
  }

  const rule = universityId ? getUniversityRule(universityId) : getDefaultRule();
  const normalizedGrade = input.trim().toUpperCase();

  const entry = rule.gradeScale.find((e) => e.grade.toUpperCase() === normalizedGrade);

  if (!entry) {
    const validGrades = rule.gradeScale.map((e) => e.grade).join(', ');
    throw new Error(
      `Grade "${input}" not found in ${rule.universityName} grading scale. Valid grades: ${validGrades}`,
    );
  }

  return entry;
}
