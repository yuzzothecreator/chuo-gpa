import type { CGPAInput, CGPAResult, SemesterResult } from '@chuo-gpa/types';
import { getUniversityRule, getDefaultRule, DEFAULT_UNIVERSITY_ID } from '@chuo-gpa/university-rules';
import { validateSemesters, roundGPA } from '@chuo-gpa/utils';
import { buildCourseResults, calculateTotalCredits, calculateQualityPoints } from './credits.js';
import { getClassification } from './classification.js';

/**
 * Calculate CGPA (Cumulative Grade Point Average) across multiple semesters.
 *
 * Formula: CGPA = Σ(all gradePoint × credits across semesters) / Σ(all credits)
 *
 * @param input - The CGPA calculation input containing semesters and optional university ID
 * @returns Detailed CGPA result with per-semester breakdown and degree classification
 * @throws {ValidationError} If input data is invalid
 * @throws {Error} If the university is not found
 *
 * @example
 * ```typescript
 * const result = calculateCGPA({
 *   universityId: 'udsm',
 *   semesters: [
 *     {
 *       name: 'Year 1 Semester 1',
 *       courses: [
 *         { name: 'Programming I', credits: 10, grade: 'A' },
 *         { name: 'Mathematics I', credits: 10, grade: 'B+' },
 *       ],
 *     },
 *     {
 *       name: 'Year 1 Semester 2',
 *       courses: [
 *         { name: 'Programming II', credits: 10, grade: 'B+' },
 *         { name: 'Mathematics II', credits: 10, grade: 'A' },
 *       ],
 *     },
 *   ],
 * });
 *
 * console.log(result.cgpa);           // 4.5
 * console.log(result.classification); // "First Class"
 * ```
 */
export function calculateCGPA(input: CGPAInput): CGPAResult {
  const universityId = input.universityId ?? DEFAULT_UNIVERSITY_ID;
  const rule = input.universityId
    ? getUniversityRule(input.universityId)
    : getDefaultRule();

  // Validate input
  validateSemesters(input.semesters, rule.gradeScale);

  // Calculate per-semester results
  const semesters: SemesterResult[] = input.semesters.map((semester) => {
    const semesterCredits = calculateTotalCredits(semester.courses);
    const semesterQualityPoints = calculateQualityPoints(semester.courses, input.universityId);
    const semesterGPA = roundGPA(semesterQualityPoints / semesterCredits);
    const courses = buildCourseResults(semester.courses, input.universityId);

    return {
      name: semester.name,
      gpa: semesterGPA,
      totalCredits: semesterCredits,
      totalGradePoints: semesterQualityPoints,
      courses,
    };
  });

  // Calculate cumulative totals
  const totalCredits = semesters.reduce((sum, sem) => sum + sem.totalCredits, 0);
  const totalGradePoints = semesters.reduce((sum, sem) => sum + sem.totalGradePoints, 0);
  const cgpa = roundGPA(totalGradePoints / totalCredits);

  // Determine classification
  const classification = getClassification(cgpa, input.universityId);

  return {
    cgpa,
    totalCredits,
    totalGradePoints,
    semesters,
    classification,
    universityId,
  };
}
