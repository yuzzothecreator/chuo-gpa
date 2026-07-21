import { describe, it, expect } from 'vitest';
import { gradeToPoint, scoreToGrade, convertGrade } from '../src/grade-converter.js';

describe('gradeToPoint', () => {
  it('should convert A to 5.0', () => {
    expect(gradeToPoint('A')).toBe(5.0);
  });

  it('should convert B+ to 4.0', () => {
    expect(gradeToPoint('B+')).toBe(4.0);
  });

  it('should convert B to 3.0', () => {
    expect(gradeToPoint('B')).toBe(3.0);
  });

  it('should convert C to 2.0', () => {
    expect(gradeToPoint('C')).toBe(2.0);
  });

  it('should convert D to 1.0', () => {
    expect(gradeToPoint('D')).toBe(1.0);
  });

  it('should convert F to 0.0', () => {
    expect(gradeToPoint('F')).toBe(0.0);
  });

  it('should be case insensitive', () => {
    expect(gradeToPoint('a')).toBe(5.0);
    expect(gradeToPoint('b+')).toBe(4.0);
    expect(gradeToPoint('f')).toBe(0.0);
  });

  it('should handle leading/trailing spaces', () => {
    expect(gradeToPoint(' A ')).toBe(5.0);
    expect(gradeToPoint('  B+  ')).toBe(4.0);
  });

  it('should throw for invalid grade', () => {
    expect(() => gradeToPoint('Z')).toThrow(/not found/);
    expect(() => gradeToPoint('A+')).toThrow(/not found/);
    expect(() => gradeToPoint('')).toThrow(/non-empty|not found/);
  });

  it('should work with specific university', () => {
    expect(gradeToPoint('A', 'udsm')).toBe(5.0);
    expect(gradeToPoint('B', 'udom')).toBe(3.0);
    expect(gradeToPoint('C', 'iaa')).toBe(2.0);
  });
});

describe('scoreToGrade', () => {
  it('should convert score 85 to grade A', () => {
    const entry = scoreToGrade(85);
    expect(entry.grade).toBe('A');
    expect(entry.gradePoint).toBe(5.0);
  });

  it('should convert score 70 to grade A (boundary)', () => {
    const entry = scoreToGrade(70);
    expect(entry.grade).toBe('A');
  });

  it('should convert score 65 to grade B+', () => {
    const entry = scoreToGrade(65);
    expect(entry.grade).toBe('B+');
    expect(entry.gradePoint).toBe(4.0);
  });

  it('should convert score 55 to grade B', () => {
    const entry = scoreToGrade(55);
    expect(entry.grade).toBe('B');
  });

  it('should convert score 45 to grade C', () => {
    const entry = scoreToGrade(45);
    expect(entry.grade).toBe('C');
  });

  it('should convert score 37 to grade D', () => {
    const entry = scoreToGrade(37);
    expect(entry.grade).toBe('D');
  });

  it('should convert score 20 to grade F', () => {
    const entry = scoreToGrade(20);
    expect(entry.grade).toBe('F');
  });

  it('should convert score 0 to grade F', () => {
    const entry = scoreToGrade(0);
    expect(entry.grade).toBe('F');
  });

  it('should convert score 100 to grade A', () => {
    const entry = scoreToGrade(100);
    expect(entry.grade).toBe('A');
  });

  it('should throw for score below 0', () => {
    expect(() => scoreToGrade(-1)).toThrow(/between 0 and 100/);
  });

  it('should throw for score above 100', () => {
    expect(() => scoreToGrade(101)).toThrow(/between 0 and 100/);
  });

  // Boundary tests
  it('should handle boundary scores correctly', () => {
    expect(scoreToGrade(69).grade).toBe('B+'); // upper boundary of B+
    expect(scoreToGrade(60).grade).toBe('B+'); // lower boundary of B+
    expect(scoreToGrade(59).grade).toBe('B'); // upper boundary of B
    expect(scoreToGrade(50).grade).toBe('B'); // lower boundary of B
    expect(scoreToGrade(49).grade).toBe('C'); // upper boundary of C
    expect(scoreToGrade(40).grade).toBe('C'); // lower boundary of C
    expect(scoreToGrade(39).grade).toBe('D'); // upper boundary of D
    expect(scoreToGrade(35).grade).toBe('D'); // lower boundary of D
    expect(scoreToGrade(34).grade).toBe('F'); // upper boundary of F
  });
});

describe('convertGrade', () => {
  it('should handle string grades', () => {
    const entry = convertGrade('A');
    expect(entry.grade).toBe('A');
    expect(entry.gradePoint).toBe(5.0);
  });

  it('should handle numeric scores', () => {
    const entry = convertGrade(85);
    expect(entry.grade).toBe('A');
    expect(entry.gradePoint).toBe(5.0);
  });

  it('should handle string grades with university', () => {
    const entry = convertGrade('B+', 'udsm');
    expect(entry.grade).toBe('B+');
    expect(entry.gradePoint).toBe(4.0);
  });

  it('should throw for invalid string grades', () => {
    expect(() => convertGrade('Z')).toThrow(/not found/);
    expect(() => convertGrade('A+')).toThrow(/Valid grades/);
  });

  it('should throw for out-of-range numeric scores', () => {
    expect(() => convertGrade(-5)).toThrow(/between 0 and 100/);
    expect(() => convertGrade(150)).toThrow(/between 0 and 100/);
  });
});
