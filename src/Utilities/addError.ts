/**
 * Create an error object with the correct path for the key
 *
 * @param path The Original Path Of the Object
 * @param key The Key of the object
 * @param errMessage The Message for the Error
 *
 * @returns An Error Object to be added to an errors array
 */
export default function (path: string, key: string, errMessage: string): object {
	let newPath = key;
	if (path !== ``) {
		newPath = `${path}.${key}`;
	}
	// If the Path starts with a full stop, remove the full stop
	if (newPath.startsWith(`.`)) { newPath = newPath.replace(`.`, ``); }
	// If the Path ends with a full stop, remove the full stop
	if (newPath.endsWith(`.`)) { newPath = newPath.slice(0, newPath.length - 1); }
	// Return the Path with the Error Message
	return { [newPath]: errMessage };
}
