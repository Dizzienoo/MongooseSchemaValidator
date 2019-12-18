/**
 * Checks if the value is an object with any fields to parse
 *
 * @param value The value to inspect for depth
 */
export default function isObject(value): boolean {
	return !(value === null || typeof value !== `object` || Array.isArray(value) || Object.keys(value).length < 1);
}
