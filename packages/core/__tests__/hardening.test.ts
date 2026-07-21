import { describe, it, expect } from 'vitest';
import {
  calculateGPA,
  calculateCGPA,
  convertGrade,
  gradeToPoint,
  scoreToGrade,
} from '../src/index.js';

describe('hardening / crash-safety', () => {
  it('rejects non-object GPA input', () => {
    expect(() => calculateGPA(null as never)).toThrow(/object/);
  });

  it('rejects non-object CGPA input', () => {
    expect(() => calculateCGPA(null as never)).toThrow(/object/);
  });

  it('treats blank universityId as default', () => {
    const result = calculateGPA({
      universityId: '   ',
      courses: [{ name: 'Math', credits: 10, grade: 'A' }],
    });
    expect(result.universityId).toBe('tcu-standard');
    expect(result.gpa).toBe(5);
  });

  it('rejects non-string grades', () => {
    expect(() => gradeToPoint(null as never)).toThrow(/string/);
    expect(() => convertGrade({} as never)).toThrow(/string or number/);
  });

  it('rejects non-finite scores', () => {
    expect(() => scoreToGrade(Number.NaN)).toThrow(/finite/);
    expect(() => scoreToGrade(Number.POSITIVE_INFINITY)).toThrow(/finite/);
  });

  it('rejects score/grade mismatch', () => {
    expect(() =>
      calculateGPA({
        courses: [{ name: 'Math', credits: 10, grade: 'A', score: 20 }],
      }),
    ).toThrow(/does not match grade/);
  });

  it('rejects too many courses', () => {
    const courses = Array.from({ length: 101 }, (_, i) => ({
      name: `Course ${i}`,
      credits: 1,
      grade: 'A',
    }));
    expect(() => calculateGPA({ courses })).toThrow(/Too many courses/);
  });

  it('rejects oversized credits', () => {
    expect(() =>
      calculateGPA({
        courses: [{ name: 'Math', credits: 101, grade: 'A' }],
      }),
    ).toThrow(/at most 100/);
  });

  it('still calculates CGPA for valid multi-semester input', () => {
    const result = calculateCGPA({
      universityId: 'udsm',
      semesters: [
        {
          name: 'S1',
          courses: [{ name: 'A', credits: 10, grade: 'A' }],
        },
        {
          name: 'S2',
          courses: [{ name: 'B', credits: 10, grade: 'B' }],
        },
      ],
    });
    expect(result.cgpa).toBe(4);
    expect(result.classification).toBe('Upper Second Class');
  });
});
