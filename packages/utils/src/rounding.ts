/**
 * Round a number to a specified number of decimal places.
 *
 * Uses the "round half away from zero" method for consistent academic calculations.
 */
export function roundToDecimal(value: number, places: number = 2): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error('Value to round must be a finite number');
  }

  const safePlaces = Number.isInteger(places) ? Math.min(Math.max(places, 0), 10) : 2;
  const factor = Math.pow(10, safePlaces);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Round a GPA value to 2 decimal places.
 */
export function roundGPA(gpa: number): number {
  return roundToDecimal(gpa, 2);
}
