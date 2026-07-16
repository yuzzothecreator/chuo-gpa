import type { UniversityGradingRule } from '@chuo-gpa/types';

/**
 * University of Dar es Salaam (UDSM) grading rule.
 *
 * UDSM follows the TCU standard 5-point grading scale.
 *
 * @see https://www.udsm.ac.tz
 */
export const udsmRule: UniversityGradingRule = {
  universityId: 'udsm',
  universityName: 'University of Dar es Salaam',
  maxGPA: 5.0,
  gradeScale: [
    { grade: 'A', gradePoint: 5.0, minScore: 70, maxScore: 100 },
    { grade: 'B+', gradePoint: 4.0, minScore: 60, maxScore: 69 },
    { grade: 'B', gradePoint: 3.0, minScore: 50, maxScore: 59 },
    { grade: 'C', gradePoint: 2.0, minScore: 40, maxScore: 49 },
    { grade: 'D', gradePoint: 1.0, minScore: 35, maxScore: 39 },
    { grade: 'F', gradePoint: 0.0, minScore: 0, maxScore: 34 },
  ],
  classificationScale: [
    { classification: 'First Class', minGPA: 4.4, maxGPA: 5.0 },
    { classification: 'Upper Second Class', minGPA: 3.5, maxGPA: 4.3 },
    { classification: 'Lower Second Class', minGPA: 2.7, maxGPA: 3.4 },
    { classification: 'Pass', minGPA: 2.0, maxGPA: 2.6 },
  ],
};
