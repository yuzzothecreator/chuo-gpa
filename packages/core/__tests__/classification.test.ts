import { describe, it, expect } from 'vitest';
import { getClassification, classify } from '../src/classification.js';

describe('getClassification', () => {
  describe('TCU standard classification', () => {
    it('should return First Class for GPA 4.4', () => {
      expect(getClassification(4.4)).toBe('First Class');
    });

    it('should return First Class for GPA 5.0', () => {
      expect(getClassification(5.0)).toBe('First Class');
    });

    it('should return First Class for GPA 4.7', () => {
      expect(getClassification(4.7)).toBe('First Class');
    });

    it('should return Upper Second Class for GPA 4.3', () => {
      expect(getClassification(4.3)).toBe('Upper Second Class');
    });

    it('should return Upper Second Class for GPA 3.5', () => {
      expect(getClassification(3.5)).toBe('Upper Second Class');
    });

    it('should return Upper Second Class for GPA 3.9', () => {
      expect(getClassification(3.9)).toBe('Upper Second Class');
    });

    it('should return Lower Second Class for GPA 3.4', () => {
      expect(getClassification(3.4)).toBe('Lower Second Class');
    });

    it('should return Lower Second Class for GPA 2.7', () => {
      expect(getClassification(2.7)).toBe('Lower Second Class');
    });

    it('should return Lower Second Class for GPA 3.0', () => {
      expect(getClassification(3.0)).toBe('Lower Second Class');
    });

    it('should return Pass for GPA 2.6', () => {
      expect(getClassification(2.6)).toBe('Pass');
    });

    it('should return Pass for GPA 2.0', () => {
      expect(getClassification(2.0)).toBe('Pass');
    });

    it('should return Fail for GPA 1.9', () => {
      expect(getClassification(1.9)).toBe('Fail');
    });

    it('should return Fail for GPA 0.0', () => {
      expect(getClassification(0.0)).toBe('Fail');
    });

    it('should return Fail for GPA 1.0', () => {
      expect(getClassification(1.0)).toBe('Fail');
    });

    it('should classify former gap values correctly', () => {
      expect(getClassification(4.35)).toBe('Upper Second Class');
      expect(getClassification(3.45)).toBe('Lower Second Class');
      expect(getClassification(2.65)).toBe('Pass');
    });

    it('should reject non-finite GPA', () => {
      expect(() => getClassification(Number.NaN)).toThrow(/finite/);
      expect(() => getClassification(Number.POSITIVE_INFINITY)).toThrow(/finite/);
    });
  });

  describe('university-specific classification', () => {
    it('should classify using UDSM rules', () => {
      expect(getClassification(4.5, 'udsm')).toBe('First Class');
      expect(getClassification(3.8, 'udsm')).toBe('Upper Second Class');
      expect(getClassification(3.0, 'udsm')).toBe('Lower Second Class');
      expect(getClassification(2.3, 'udsm')).toBe('Pass');
    });

    it('should classify using UDOM rules', () => {
      expect(getClassification(4.5, 'udom')).toBe('First Class');
    });

    it('should classify using IAA rules', () => {
      expect(getClassification(4.5, 'iaa')).toBe('First Class');
    });
  });
});

describe('classify', () => {
  it('should be an alias for getClassification', () => {
    expect(classify(4.5)).toBe(getClassification(4.5));
    expect(classify(3.0)).toBe(getClassification(3.0));
    expect(classify(1.0)).toBe(getClassification(1.0));
  });
});
