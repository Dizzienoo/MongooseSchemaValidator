import { ICombinedOptions, IHandleDateResponse } from "../interfaces";
import addError from "../Utilities/addError";

/**
 * Handle a Date Input attempting to convert / process as necessary
 *
 * @param inputValue The value we are attempting to process
 * @param options The options that come with the value
 * @param path The original path of the value
 * @param key The key of the value
 */
export default function handleDate(
	inputValue: Date, options: ICombinedOptions, path: string, key: string,
): IHandleDateResponse {
	const response: IHandleDateResponse = {
		errors: [],
		data: null,
	};
	if (key === ``) { key = path; }
	if (((options.convert?.value === true && options.disableLocalOptions !== true) ||
		(options.convertValues === true)) &&
		inputValue !== undefined) {
		inputValue = new Date(inputValue);
	}
	if (Object.prototype.toString.call(inputValue) !== `[object Date]`) {
		if ((options.convert?.value === true && options.disableLocalOptions !== true) || (options.convertValues === true)) {
			response.errors.push(addError(path, key, `The input for "${key}" is not a date and cannot be converted into one`));
		}
		else {
			response.errors.push(addError(path, key, `The input for "${key}" is not a date`));
		}
	}
	else {
		response.data = inputValue;
	}
	if (!response.errors.length) {
		// @ts-ignore
		if (options.min && new Date(inputValue).toISOString() < new Date(options.min.value).toISOString()) {
			response.errors.push(
				addError(path, key, options.min.message || `The input for "${key}" is smaller than the minimum "${options.min.value}"`),
			);
		}
		if (options.max && new Date(inputValue).toISOString() > new Date(options.max.value).toISOString()) {
			response.errors.push(
				addError(path, key, options.max.message || `The input for "${key}" is larger than the maximum "${options.max.value}"`),
			);
		}
	}
	return response;
}
