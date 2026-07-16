import { describe, it, expect } from 'vitest';
import { calculateCGPA } from '../src/cgpa.js';

describe('calculateCGPA', () => {
  describe('basic calculations', () => {
    it('should calculate CGPA across two semesters', () => {
      const result = calculateCGPA({
        semesters: [
          {
            name: 'Year 1 Semester 1',
            courses: [
              { name: 'Programming I', credits: 10, grade: 'A' },
              { name: 'Mathematics I', credits: 10, grade: 'B+' },
            ],
          },
          {
            name: 'Year 1 Semester 2',
            courses: [
              { name: 'Programming II', credits: 10, grade: 'B+' },
              { name: 'Mathematics II', credits: 10, grade: 'A' },
            ],
          },
        ],
      });

      // Sem1: (5*10 + 4*10)/20 = 4.5
      // Sem2: (4*10 + 5*10)/20 = 4.5
      // CGPA: (50+40+40+50)/40 = 180/40 = 4.5
      expect(result.cgpa).toBe(4.5);
      expect(result.totalCredits).toBe(40);
      expect(result.semesters).toHaveLength(2);
    });

    it('should calculate CGPA with different course loads per semester', () => {
      const result = calculateCGPA({
        semesters: [
          {
            name: 'Semester 1',
            courses: [
              { name: 'Course 1', credits: 15, grade: 'A' },
            ],
          },
          {
            name: 'Semester 2',
            courses: [
              { name: 'Course 2', credits: 5, grade: 'C' },
              { name: 'Course 3', credits: 10, grade: 'B' },
            ],
          },
        ],
      });

      // Sem1: 5.0*15 = 75, credits=15
      // Sem2: 2.0*5 + 3.0*10 = 40, credits=15
      // CGPA: (75+40)/30 = 115/30 = 3.83
      expect(result.cgpa).toBe(3.83);
      expect(result.totalCredits).toBe(30);
    });

    it('should include per-semester GPA in results', () => {
      const result = calculateCGPA({
        semesters: [
          {
            name: 'Semester 1',
            courses: [
              { name: 'Course 1', credits: 10, grade: 'A' },
            ],
          },
          {
            name: 'Semester 2',
            courses: [
              { name: 'Course 2', credits: 10, grade: 'C' },
            ],
          },
        ],
      });

      expect(result.semesters[0]!.gpa).toBe(5.0);
      expect(result.semesters[0]!.name).toBe('Semester 1');
      expect(result.semesters[1]!.gpa).toBe(2.0);
      expect(result.semesters[1]!.name).toBe('Semester 2');
    });
  });

  describe('degree classification', () => {
    it('should classify as First Class for CGPA >= 4.4', () => {
      const result = calculateCGPA({
        semesters: [
          {
            courses: [
              { name: 'Course 1', credits: 10, grade: 'A' },
              { name: 'Course 2', credits: 10, grade: 'A' },
            ],
          },
        ],
      });

      expect(result.cgpa).toBe(5.0);
      expect(result.classification).toBe('First Class');
    });

    it('should classify as Upper Second Class for CGPA 3.5–4.3', () => {
      const result = calculateCGPA({
        semesters: [
          {
            courses: [
              { name: 'Course 1', credits: 10, grade: 'A' },
              { name: 'Course 2', credits: 10, grade: 'B+' },
              { name: 'Course 3', credits: 10, grade: 'B' },
            ],
          },
        ],
      });

      // (5+4+3)*10 / 30 = 4.0
      expect(result.cgpa).toBe(4.0);
      expect(result.classification).toBe('Upper Second Class');
    });

    it('should classify as Lower Second Class for CGPA 2.7–3.4', () => {
      const result = calculateCGPA({
        semesters: [
          {
            courses: [
              { name: 'Course 1', credits: 10, grade: 'B' },
              { name: 'Course 2', credits: 10, grade: 'B' },
            ],
          },
        ],
      });

      expect(result.cgpa).toBe(3.0);
      expect(result.classification).toBe('Lower Second Class');
    });

    it('should classify as Pass for CGPA 2.0–2.6', () => {
      const result = calculateCGPA({
        semesters: [
          {
            courses: [
              { name: 'Course 1', credits: 10, grade: 'C' },
              { name: 'Course 2', credits: 10, grade: 'B' },
            ],
          },
        ],
      });

      // (2+3)*10 / 20 = 2.5
      expect(result.cgpa).toBe(2.5);
      expect(result.classification).toBe('Pass');
    });

    it('should classify as Fail for CGPA < 2.0', () => {
      const result = calculateCGPA({
        semesters: [
          {
            courses: [
              { name: 'Course 1', credits: 10, grade: 'D' },
              { name: 'Course 2', credits: 10, grade: 'F' },
            ],
          },
        ],
      });

      // (1+0)*10 / 20 = 0.5
      expect(result.cgpa).toBe(0.5);
      expect(result.classification).toBe('Fail');
    });
  });

  describe('university-specific CGPA', () => {
    it('should calculate CGPA for UDSM', () => {
      const result = calculateCGPA({
        universityId: 'udsm',
        semesters: [
          {
            courses: [
              { name: 'Course', credits: 10, grade: 'A' },
            ],
          },
        ],
      });

      expect(result.universityId).toBe('udsm');
      expect(result.cgpa).toBe(5.0);
      expect(result.classification).toBe('First Class');
    });
  });

  describe('validation', () => {
    it('should throw on empty semesters', () => {
      expect(() =>
        calculateCGPA({ semesters: [] }),
      ).toThrow('At least one semester is required');
    });

    it('should throw on semester with empty courses', () => {
      expect(() =>
        calculateCGPA({
          semesters: [{ courses: [] }],
        }),
      ).toThrow('At least one course is required');
    });
  });
});
