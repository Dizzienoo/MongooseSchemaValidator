import { ICombinedOptions, IHandleNumberResponse } from "../interfaces";

/**
 * Handle a Number Input attempting to convert / process as necessary
 *
 * @param inputValue The value we are attempting to process
 * @param options The options that come with the value
 * @param path The original path of the value
 * @param key The key of the value
 */
export default function handleNumber(
	inputValue: number, options: ICombinedOptions, key: string,
): IHandleNumberResponse {
	const response: IHandleNumberResponse = {
		error: false,
		errors: {},
		data: null,
	};
	if (
		((options.convert?.value === true && options.disableLocalOptions !== true) ||
			(options.convertValues === true)) &&
		inputValue !== undefined && typeof inputValue !== `number`
	) {
		inputValue = Number(inputValue);
	}
	if (typeof inputValue !== `number`) {
		if ((options.convert?.value === true && options.disableLocalOptions !== true) || (options.convertValues === true)) {
			response.error = true;
			response.errors[key] = `The input for "${key}" is not a number and cannot be converted into one`;
		}
		else {
			response.error = true;
			response.errors[key] = `The input for "${key}" is not a number`;
		}
	}
	else {
		response.data = inputValue;
	}
	if (options.min && response.data < options.min.value) {
		response.error = true;
		response.errors[key] = options.min.message || `The input for "${key}" is smaller than the minimum "${options.min.value}"`;
	}
	if (options.max && response.data > options.max.value) {
		response.error = true;
		response.errors[key] = options.max.message || `The input for "${key}" is larger than the maximum "${options.max.value}"`;
	}
	return response;
}
