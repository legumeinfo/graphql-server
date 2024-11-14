/**
 * Checks if a given value is an object.
 *
 * @param value - The value to check.
 *
 * @returns A boolean indicating whether or not the value is an object.
 */
export function isObject(value: any): boolean {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
}
