import { ICombinedOptions, IHandleStringResponse } from "../interfaces";
import addError from "../Utilities/addError";

/**
 * Handle a String Input attempting to convert / process as necessary
 *
 * @param inputValue The value we are attempting to process
 * @param options The options that come with the value
 * @param path The original path of the value
 * @param key The key of the value
 */
export default function handleString(
	inputValue: string, options: ICombinedOptions, path: string, key,
): IHandleStringResponse {
	const response: IHandleStringResponse = {
		errors: [],
		data: null,
	};
	// If the key is empty key = path
	if (key === ``) { key = path; }
	// If we are supposed to convert, there is something to convert and it isn't a string
	if (
		((options.convert?.value === true && options.disableLocalOptions !== true) ||
			(options.convertValues === true)) &&
		inputValue !== undefined && typeof inputValue !== `string`
	) {
		inputValue = String(inputValue);
	}
	// If the input is required, the ignore required rule isn't set and we don't have an input
	if (options.required?.value === true && options.ignoreRequired !== true && inputValue === undefined) {
		response.errors.push(
			addError(path, key, `The input for "${key}" is marked as required but no value has been provided`),
		);
	}
	// Otherwise if there is an input to parse
	else if (inputValue !== undefined) {
		// If the input isn't a string
		if (typeof inputValue !== `string`) {
			if ((options.convert?.value === true && options.disableLocalOptions !== true) || (options.convertValues === true)) {
				response.errors.push(
					addError(path, key, `The input for "${key}" is not a string and cannot be converted into one`),
				);
			}
			else {
				response.errors.push(
					addError(path, key, `The input for "${key}" is not a string`),
				);
			}
		}
		// Otherwise, we are good to add the value to the response
		else {
			// Add the Data to the response
			response.data = inputValue;
		}
		// If the response's length is longer than the max length
		if (options.maxLength && response.data.length > options.maxLength.value) {
			response.errors.push(
				addError(path, key, options.maxLength.message || `The input for "${key}" is longer than the allowed maximum, "${options.maxLength.value}"`),
			);
		}
		// If the response's length is shorter than the min length
		if (options.minLength && response.data.length < options.minLength.value) {
			response.errors.push(
				addError(path, key, options.minLength.message || `The input for "${key}" is shorter than the allowed minimum, "${options.minLength.value}"`),
			);
		}
		// Convert input to Lowercase
		if (options.lowercase) {
			response.data = response.data.toLowerCase();
		}
		// Convert input to Uppercase
		if (options.uppercase) {
			response.data = response.data.toUpperCase();
		}
		if (options.enum !== undefined && options.enum !== null) {
			if (!options.enum.value.includes(response.data)) {
				response.errors.push(
					addError(path, key, `The input for "${key}" is not one of the designated allowed Enums`),
				);
			}
		}
		if (options.trim?.value === true) {
			response.data = response.data.trim();
		}
	}
	return response;
}
