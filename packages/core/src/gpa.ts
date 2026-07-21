import type { GPAInput, GPAResult } from '@chuo-gpa/types';
import {
  getUniversityRule,
  getDefaultRule,
  DEFAULT_UNIVERSITY_ID,
} from '@chuo-gpa/university-rules';
import { validateCourses, roundGPA, ValidationError } from '@chuo-gpa/utils';
import { buildCourseResults, calculateTotalCredits, calculateQualityPoints } from './credits.js';

function resolveUniversityId(universityId?: string): string {
  if (typeof universityId !== 'string') {
    return DEFAULT_UNIVERSITY_ID;
  }
  const trimmed = universityId.trim();
  return trimmed.length > 0 ? trimmed : DEFAULT_UNIVERSITY_ID;
}

/**
 * Calculate GPA (Grade Point Average) for a set of courses.
 *
 * Formula: GPA = Σ(gradePoint × credits) / Σ(credits)
 */
export function calculateGPA(input: GPAInput): GPAResult {
  if (!input || typeof input !== 'object') {
    throw new ValidationError('GPA input must be an object', 'input', input);
  }

  const universityId = resolveUniversityId(input.universityId);
  const rule =
    universityId === DEFAULT_UNIVERSITY_ID && !input.universityId?.trim()
      ? getDefaultRule()
      : getUniversityRule(universityId);

  validateCourses(input.courses, rule.gradeScale);

  const totalCredits = calculateTotalCredits(input.courses);
  const totalGradePoints = calculateQualityPoints(input.courses, universityId);

  if (!Number.isFinite(totalCredits) || totalCredits <= 0) {
    throw new ValidationError('Total credits must be a finite number greater than 0', 'credits');
  }
  if (!Number.isFinite(totalGradePoints)) {
    throw new ValidationError('Total grade points must be a finite number', 'gradePoints');
  }

  const gpa = roundGPA(totalGradePoints / totalCredits);
  if (!Number.isFinite(gpa)) {
    throw new ValidationError('Calculated GPA is not a finite number', 'gpa', gpa);
  }

  const courses = buildCourseResults(input.courses, universityId);

  return {
    gpa,
    totalCredits,
    totalGradePoints,
    courses,
    universityId: rule.universityId,
  };
}
