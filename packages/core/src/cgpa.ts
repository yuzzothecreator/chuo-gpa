import type { CGPAInput, CGPAResult, SemesterResult } from '@chuo-gpa/types';
import {
  getUniversityRule,
  getDefaultRule,
  DEFAULT_UNIVERSITY_ID,
} from '@chuo-gpa/university-rules';
import { validateSemesters, roundGPA, ValidationError } from '@chuo-gpa/utils';
import { buildCourseResults, calculateTotalCredits, calculateQualityPoints } from './credits.js';
import { getClassification } from './classification.js';

function resolveUniversityId(universityId?: string): string {
  if (typeof universityId !== 'string') {
    return DEFAULT_UNIVERSITY_ID;
  }
  const trimmed = universityId.trim();
  return trimmed.length > 0 ? trimmed : DEFAULT_UNIVERSITY_ID;
}

/**
 * Calculate CGPA (Cumulative Grade Point Average) across multiple semesters.
 *
 * Formula: CGPA = Σ(all gradePoint × credits across semesters) / Σ(all credits)
 */
export function calculateCGPA(input: CGPAInput): CGPAResult {
  if (!input || typeof input !== 'object') {
    throw new ValidationError('CGPA input must be an object', 'input', input);
  }

  const universityId = resolveUniversityId(input.universityId);
  const rule =
    universityId === DEFAULT_UNIVERSITY_ID && !input.universityId?.trim()
      ? getDefaultRule()
      : getUniversityRule(universityId);

  validateSemesters(input.semesters, rule.gradeScale);

  const semesters: SemesterResult[] = input.semesters.map((semester) => {
    const semesterCredits = calculateTotalCredits(semester.courses);
    const semesterQualityPoints = calculateQualityPoints(semester.courses, universityId);

    if (!Number.isFinite(semesterCredits) || semesterCredits <= 0) {
      throw new ValidationError(
        'Semester credits must be a finite number greater than 0',
        'credits',
      );
    }
    if (!Number.isFinite(semesterQualityPoints)) {
      throw new ValidationError('Semester grade points must be a finite number', 'gradePoints');
    }

    const semesterGPA = roundGPA(semesterQualityPoints / semesterCredits);
    if (!Number.isFinite(semesterGPA)) {
      throw new ValidationError(
        'Calculated semester GPA is not a finite number',
        'gpa',
        semesterGPA,
      );
    }

    const courses = buildCourseResults(semester.courses, universityId);

    return {
      name: semester.name,
      gpa: semesterGPA,
      totalCredits: semesterCredits,
      totalGradePoints: semesterQualityPoints,
      courses,
    };
  });

  const totalCredits = semesters.reduce((sum, sem) => sum + sem.totalCredits, 0);
  const totalGradePoints = semesters.reduce((sum, sem) => sum + sem.totalGradePoints, 0);

  if (!Number.isFinite(totalCredits) || totalCredits <= 0) {
    throw new ValidationError('Total credits must be a finite number greater than 0', 'credits');
  }
  if (!Number.isFinite(totalGradePoints)) {
    throw new ValidationError('Total grade points must be a finite number', 'gradePoints');
  }

  const cgpa = roundGPA(totalGradePoints / totalCredits);
  if (!Number.isFinite(cgpa)) {
    throw new ValidationError('Calculated CGPA is not a finite number', 'cgpa', cgpa);
  }

  const classification = getClassification(cgpa, universityId);

  return {
    cgpa,
    totalCredits,
    totalGradePoints,
    semesters,
    classification,
    universityId: rule.universityId,
  };
}
