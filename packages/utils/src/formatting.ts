import type { DegreeClassification } from '@chuo-gpa/types';

/**
 * Format a GPA value for display.
 */
export function formatGPA(gpa: number, places: number = 2): string {
  if (typeof gpa !== 'number' || !Number.isFinite(gpa)) {
    throw new Error('GPA must be a finite number');
  }
  const safePlaces = Number.isInteger(places) ? Math.min(Math.max(places, 0), 10) : 2;
  return gpa.toFixed(safePlaces);
}

/**
 * Format a degree classification with its GPA range.
 */
export function formatClassification(classification: DegreeClassification, gpa?: number): string {
  if (gpa !== undefined) {
    return `${classification} (GPA: ${formatGPA(gpa)})`;
  }
  return classification;
}
