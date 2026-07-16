import { describe, it, expect } from 'vitest';
import { calculateGPA } from '../src/gpa.js';

describe('calculateGPA', () => {
  describe('basic calculations', () => {
    it('should calculate GPA for a single course with grade A', () => {
      const result = calculateGPA({
        courses: [{ name: 'Database Security', credits: 10, grade: 'A' }],
      });

      expect(result.gpa).toBe(5.0);
      expect(result.totalCredits).toBe(10);
      expect(result.totalGradePoints).toBe(50);
      expect(result.courses).toHaveLength(1);
    });

    it('should calculate GPA for multiple courses', () => {
      const result = calculateGPA({
        courses: [
          { name: 'Database Security', credits: 10, grade: 'A' },
          { name: 'Software Engineering', credits: 10, grade: 'B+' },
          { name: 'Data Structures', credits: 10, grade: 'B' },
        ],
      });

      // (5.0*10 + 4.0*10 + 3.0*10) / 30 = 120/30 = 4.0
      expect(result.gpa).toBe(4.0);
      expect(result.totalCredits).toBe(30);
      expect(result.totalGradePoints).toBe(120);
    });

    it('should calculate GPA with different credit weights', () => {
      const result = calculateGPA({
        courses: [
          { name: 'Major Course', credits: 15, grade: 'A' },
          { name: 'Minor Course', credits: 5, grade: 'C' },
        ],
      });

      // (5.0*15 + 2.0*5) / 20 = 85/20 = 4.25
      expect(result.gpa).toBe(4.25);
      expect(result.totalCredits).toBe(20);
      expect(result.totalGradePoints).toBe(85);
    });

    it('should handle all grade types', () => {
      const result = calculateGPA({
        courses: [
          { name: 'Course A', credits: 10, grade: 'A' },
          { name: 'Course B+', credits: 10, grade: 'B+' },
          { name: 'Course B', credits: 10, grade: 'B' },
          { name: 'Course C', credits: 10, grade: 'C' },
          { name: 'Course D', credits: 10, grade: 'D' },
          { name: 'Course F', credits: 10, grade: 'F' },
        ],
      });

      // (5+4+3+2+1+0)*10 / 60 = 150/60 = 2.5
      expect(result.gpa).toBe(2.5);
      expect(result.totalCredits).toBe(60);
    });

    it('should return correct course details', () => {
      const result = calculateGPA({
        courses: [{ name: 'Database Security', credits: 10, grade: 'A' }],
      });

      expect(result.courses[0]).toEqual({
        name: 'Database Security',
        credits: 10,
        grade: 'A',
        gradePoint: 5.0,
        qualityPoints: 50,
      });
    });
  });

  describe('university-specific calculations', () => {
    it('should calculate GPA for UDSM', () => {
      const result = calculateGPA({
        universityId: 'udsm',
        courses: [
          { name: 'Programming', credits: 10, grade: 'A' },
          { name: 'Mathematics', credits: 10, grade: 'B+' },
        ],
      });

      expect(result.gpa).toBe(4.5);
      expect(result.universityId).toBe('udsm');
    });

    it('should calculate GPA for UDOM', () => {
      const result = calculateGPA({
        universityId: 'udom',
        courses: [{ name: 'Statistics', credits: 10, grade: 'B' }],
      });

      expect(result.gpa).toBe(3.0);
      expect(result.universityId).toBe('udom');
    });

    it('should calculate GPA for IAA', () => {
      const result = calculateGPA({
        universityId: 'iaa',
        courses: [{ name: 'Accounting', credits: 10, grade: 'A' }],
      });

      expect(result.gpa).toBe(5.0);
      expect(result.universityId).toBe('iaa');
    });

    it('should use TCU standard when no universityId is provided', () => {
      const result = calculateGPA({
        courses: [{ name: 'Course', credits: 10, grade: 'A' }],
      });

      expect(result.universityId).toBe('tcu-standard');
    });
  });

  describe('grade case insensitivity', () => {
    it('should handle lowercase grades', () => {
      const result = calculateGPA({
        courses: [{ name: 'Course', credits: 10, grade: 'a' }],
      });

      expect(result.gpa).toBe(5.0);
    });

    it('should handle mixed case grades', () => {
      const result = calculateGPA({
        courses: [{ name: 'Course', credits: 10, grade: 'b+' }],
      });

      expect(result.gpa).toBe(4.0);
    });
  });

  describe('edge cases', () => {
    it('should handle perfect GPA', () => {
      const result = calculateGPA({
        courses: [
          { name: 'Course 1', credits: 10, grade: 'A' },
          { name: 'Course 2', credits: 10, grade: 'A' },
          { name: 'Course 3', credits: 10, grade: 'A' },
        ],
      });

      expect(result.gpa).toBe(5.0);
    });

    it('should handle zero GPA (all F)', () => {
      const result = calculateGPA({
        courses: [
          { name: 'Course 1', credits: 10, grade: 'F' },
          { name: 'Course 2', credits: 10, grade: 'F' },
        ],
      });

      expect(result.gpa).toBe(0.0);
    });
  });

  describe('validation errors', () => {
    it('should throw on empty courses array', () => {
      expect(() =>
        calculateGPA({ courses: [] }),
      ).toThrow('At least one course is required');
    });

    it('should throw on invalid grade', () => {
      expect(() =>
        calculateGPA({
          courses: [{ name: 'Course', credits: 10, grade: 'Z' }],
        }),
      ).toThrow(/Invalid grade/);
    });

    it('should throw on zero credits', () => {
      expect(() =>
        calculateGPA({
          courses: [{ name: 'Course', credits: 0, grade: 'A' }],
        }),
      ).toThrow(/credits must be greater than 0/);
    });

    it('should throw on negative credits', () => {
      expect(() =>
        calculateGPA({
          courses: [{ name: 'Course', credits: -5, grade: 'A' }],
        }),
      ).toThrow(/credits must be greater than 0/);
    });

    it('should throw on unknown university', () => {
      expect(() =>
        calculateGPA({
          universityId: 'nonexistent',
          courses: [{ name: 'Course', credits: 10, grade: 'A' }],
        }),
      ).toThrow(/not found/);
    });
  });
});
