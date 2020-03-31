import { Schema, Types } from "mongoose";
import { ICombinedOptions, IHandleMongooseIdResponse } from "../interfaces";

/**
 * Handle a Boolean Input attempting to convert / process as necessary
 *
 * @param inputValue The value we are attempting to process
 * @param options The options that come with the value
 * @param path The original path of the value
 * @param key The key of the value
 */
export default function handleMongooseId(
	inputValue: Schema.Types.ObjectId, options: ICombinedOptions, key: string,
): IHandleMongooseIdResponse {
	const response: IHandleMongooseIdResponse = {
		error: false,
		errors: {},
		data: null,
	};
	// If we are supposed to convert, there is something to convert and it isn't undefined
	if (((options.convert?.value === true && options.disableLocalOptions !== true) ||
		(options.convertValues === true)) &&
		inputValue !== undefined) {
		// @ts-ignore
		inputValue = Types.ObjectId(inputValue.toString());
	}
	if (!/^[a-fA-F0-9]{24}$/.test(inputValue.toString())) {
		if ((options.convert?.value === true && options.disableLocalOptions !== true) || (options.convertValues === true)) {
			response.errors[key] = `The input for "${key}" is not a MongooseId and cannot be converted into one`;
			response.error = true;
		}
		else {
			response.errors[key] = `The input for "${key}" is not a MongooseId`;
			response.error = true;
		}
	}
	else {
		response.data = inputValue;
	}
	return response;
}
