import { IHandleNumberResponse, IInternalOptions } from "../interfaces";
import addError from "../Utilities/addError";

/**
 * Handle a Number Input attempting to convert / process as necessary
 *
 * @param inputValue The value we are attempting to process
 * @param options The options that come with the value
 * @param path The original path of the value
 * @param key The key of the value
 */
export default function handleNumber(
	inputValue: number, options: IInternalOptions, path: string, key: string,
): IHandleNumberResponse {
	const response: IHandleNumberResponse = {
		errors: [],
		data: null,
	};
	if (key === ``) { key = path; }
	if (options.convert === true) {
		inputValue = Number(inputValue);
	}
	if (typeof inputValue !== `number`) {
		if (options.convert === true) {
			response.errors.push(addError(path, key, `The input for "${key}" is not a number and cannot be converted into one`));
		}
		else {
			response.errors.push(addError(path, key, `The input for "${key}" is not a number`));
		}
	}
	else {
		response.data = inputValue;
	}
	if (options.min && response.data < options.min) {
		response.errors.push(addError(path, key, `The input for "${key}" is smaller than the minimum "${options.min}"`));
	}
	if (options.max && response.data > options.max) {
		response.errors.push(addError(path, key, `The input for "${key}" is larger than the maximum "${options.max}"`));
	}
	return response;
}
