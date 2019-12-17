import { IHandleBooleanResponse, IOptionObject } from "../interfaces";
import addError from "../Utilities/addError";

/**
 * Handle a Boolean Input attempting to convert / process as necessary
 *
 * @param inputValue The value we are attempting to process
 * @param options The options that come with the value
 * @param path The original path of the value
 * @param key The key of the value
 */
export default function handleBoolean(
	inputValue: boolean, options: IOptionObject, path: string, key: string,
): IHandleBooleanResponse {
	const response: IHandleBooleanResponse = {
		errors: [],
		data: null,
	};
	if (key === ``) { key = path; }
	if (options.convert === true) {
		// @ts-ignore
		if (inputValue === `false` || inputValue === `no` || inputValue === `0`) {
			inputValue = false;
		}
		else {
			inputValue = Boolean(inputValue);

		}
	}
	if (typeof inputValue !== `boolean`) {
		if (options.convert === true) {
			response.errors.push(
				addError(path, key, `The input for "${key}" is not a boolean and cannot be converted into one`),
			);
		}
		else {
			response.errors.push(
				addError(path, key, `The input for "${key}" is not a boolean`),
			);
		}
	}
	else {
		response.data = inputValue;
	}
	return response;
}
