import { describe, it, expect } from 'vitest';
import {
  getUniversityRule,
  listUniversities,
  hasUniversity,
  getDefaultRule,
  registerUniversity,
  DEFAULT_UNIVERSITY_ID,
} from '@chuo-gpa/university-rules';

describe('university-rules registry', () => {
  describe('getUniversityRule', () => {
    it('should return UDSM rule', () => {
      const rule = getUniversityRule('udsm');
      expect(rule.universityId).toBe('udsm');
      expect(rule.universityName).toBe('University of Dar es Salaam');
      expect(rule.maxGPA).toBe(5.0);
      expect(rule.gradeScale).toHaveLength(6);
      expect(rule.classificationScale).toHaveLength(4);
    });

    it('should return UDOM rule', () => {
      const rule = getUniversityRule('udom');
      expect(rule.universityId).toBe('udom');
      expect(rule.universityName).toBe('University of Dodoma');
    });

    it('should return IAA rule', () => {
      const rule = getUniversityRule('iaa');
      expect(rule.universityId).toBe('iaa');
      expect(rule.universityName).toBe('Institute of Accountancy Arusha');
    });

    it('should be case insensitive', () => {
      const rule = getUniversityRule('UDSM');
      expect(rule.universityId).toBe('udsm');
    });

    it('should handle whitespace', () => {
      const rule = getUniversityRule('  udsm  ');
      expect(rule.universityId).toBe('udsm');
    });

    it('should throw for unknown university', () => {
      expect(() => getUniversityRule('unknown')).toThrow(/not found/);
    });
  });

  describe('getDefaultRule', () => {
    it('should return TCU standard', () => {
      const rule = getDefaultRule();
      expect(rule.universityId).toBe(DEFAULT_UNIVERSITY_ID);
      expect(rule.maxGPA).toBe(5.0);
    });
  });

  describe('listUniversities', () => {
    it('should list all built-in universities', () => {
      const universities = listUniversities();
      expect(universities.length).toBeGreaterThanOrEqual(4); // tcu-standard, udsm, udom, iaa
    });

    it('should include UDSM', () => {
      const universities = listUniversities();
      const udsm = universities.find((u) => u.universityId === 'udsm');
      expect(udsm).toBeDefined();
    });
  });

  describe('hasUniversity', () => {
    it('should return true for known universities', () => {
      expect(hasUniversity('udsm')).toBe(true);
      expect(hasUniversity('udom')).toBe(true);
      expect(hasUniversity('iaa')).toBe(true);
    });

    it('should return false for unknown universities', () => {
      expect(hasUniversity('unknown')).toBe(false);
    });
  });

  describe('registerUniversity', () => {
    it('should register a new university', () => {
      registerUniversity({
        universityId: 'test-uni',
        universityName: 'Test University',
        maxGPA: 5.0,
        gradeScale: [
          { grade: 'A', gradePoint: 5.0, minScore: 70, maxScore: 100 },
          { grade: 'F', gradePoint: 0.0, minScore: 0, maxScore: 69 },
        ],
        classificationScale: [
          { classification: 'First Class', minGPA: 4.4, maxGPA: 5.0 },
          { classification: 'Pass', minGPA: 2.0, maxGPA: 4.3 },
        ],
      });

      expect(hasUniversity('test-uni')).toBe(true);
      const rule = getUniversityRule('test-uni');
      expect(rule.universityName).toBe('Test University');
    });

    it('should throw when registering duplicate university', () => {
      expect(() =>
        registerUniversity({
          universityId: 'udsm',
          universityName: 'Duplicate',
          maxGPA: 5.0,
          gradeScale: [],
          classificationScale: [],
        }),
      ).toThrow(/already registered/);
    });
  });

  describe('grade scale structure', () => {
    it('UDSM grade scale should cover A through F', () => {
      const rule = getUniversityRule('udsm');
      const grades = rule.gradeScale.map((e) => e.grade);
      expect(grades).toContain('A');
      expect(grades).toContain('B+');
      expect(grades).toContain('B');
      expect(grades).toContain('C');
      expect(grades).toContain('D');
      expect(grades).toContain('F');
    });

    it('grade scales should have valid score ranges', () => {
      const rule = getUniversityRule('udsm');
      for (const entry of rule.gradeScale) {
        expect(entry.minScore).toBeDefined();
        expect(entry.maxScore).toBeDefined();
        expect(entry.minScore!).toBeLessThanOrEqual(entry.maxScore!);
        expect(entry.gradePoint).toBeGreaterThanOrEqual(0);
        expect(entry.gradePoint).toBeLessThanOrEqual(5);
      }
    });

    it('classification scale should have valid GPA ranges', () => {
      const rule = getUniversityRule('udsm');
      for (const entry of rule.classificationScale) {
        expect(entry.minGPA).toBeLessThanOrEqual(entry.maxGPA);
        expect(entry.minGPA).toBeGreaterThanOrEqual(0);
        expect(entry.maxGPA).toBeLessThanOrEqual(5);
      }
    });
  });
});
