import type { DegreeClassification } from '@chuo-gpa/types';

/**
 * Format a GPA value for display.
 *
 * @param gpa - The GPA value
 * @param places - Decimal places (default: 2)
 * @returns Formatted GPA string
 *
 * @example
 * ```typescript
 * formatGPA(4.5);     // "4.50"
 * formatGPA(3.0, 1);  // "3.0"
 * ```
 */
export function formatGPA(gpa: number, places: number = 2): string {
  return gpa.toFixed(places);
}

/**
 * Format a degree classification with its GPA range.
 *
 * @param classification - The degree classification
 * @param gpa - Optional GPA to include
 * @returns Formatted classification string
 *
 * @example
 * ```typescript
 * formatClassification("First Class", 4.5);
 * // "First Class (GPA: 4.50)"
 * ```
 */
export function formatClassification(
  classification: DegreeClassification,
  gpa?: number,
): string {
  if (gpa !== undefined) {
    return `${classification} (GPA: ${formatGPA(gpa)})`;
  }
  return classification;
}
