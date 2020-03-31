import { ICombinedOptions, IHandleBooleanResponse } from "../interfaces";


/**
 * Handle a Boolean Input attempting to convert / process as necessary
 *
 * @param inputValue The value we are attempting to process
 * @param options The options that come with the value
 * @param path The original path of the value
 * @param key The key of the value
 */
export default function handleBoolean(
	inputValue: boolean, options: ICombinedOptions, key: string,
): IHandleBooleanResponse {
	const response: IHandleBooleanResponse = {
		error: false,
		errors: {},
		data: null,
	};
	if (((options.convert?.value === true && options.disableLocalOptions !== true) ||
		(options.convertValues === true)) &&
		inputValue !== undefined && typeof inputValue !== `boolean`) {
		// @ts-ignore
		if (inputValue === `false` || inputValue === `no` || inputValue === `0`) {
			inputValue = false;
		}
		else {
			inputValue = Boolean(inputValue);

		}
	}
	if (typeof inputValue !== `boolean`) {
		if (options.required?.value === true && options.ignoreRequired !== true && inputValue === undefined) {
			response.error = true;
			response.errors[key] = `The input for "${key}" is not a boolean and cannot be converted into one`;
		}
		else {
			response.error = true;
			response.errors[key] = `The input for "${key}" is not a boolean`;
		}
	}
	else {
		response.data = inputValue;
	}
	return response;
}
