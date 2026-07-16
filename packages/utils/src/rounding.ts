/**
 * Round a number to a specified number of decimal places.
 *
 * Uses the "round half away from zero" method for consistent academic calculations.
 *
 * @param value - The number to round
 * @param places - Number of decimal places (default: 2)
 * @returns The rounded number
 *
 * @example
 * ```typescript
 * roundToDecimal(3.456, 2); // 3.46
 * roundToDecimal(3.454, 2); // 3.45
 * roundToDecimal(4.5, 0);   // 5
 * ```
 */
export function roundToDecimal(value: number, places: number = 2): number {
  const factor = Math.pow(10, places);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Round a GPA value to 2 decimal places.
 *
 * Convenience wrapper around {@link roundToDecimal}.
 *
 * @param gpa - The GPA value to round
 * @returns The GPA rounded to 2 decimal places
 */
export function roundGPA(gpa: number): number {
  return roundToDecimal(gpa, 2);
}
