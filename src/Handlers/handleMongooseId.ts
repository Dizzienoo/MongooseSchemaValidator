import { Schema, Types } from "mongoose";
import { IHandleBooleanResponse, IHandleMongooseIdResponse, IOptionObject } from "../interfaces";
import addError from "../Utilities/addError";

/**
 * Handle a Boolean Input attempting to convert / process as necessary
 *
 * @param inputValue The value we are attempting to process
 * @param options The options that come with the value
 * @param path The original path of the value
 * @param key The key of the value
 */
export default function handleMongooseId(
	inputValue: Schema.Types.ObjectId, options: IOptionObject, path: string, key: string,
): IHandleMongooseIdResponse {
	const response: IHandleMongooseIdResponse = {
		errors: [],
		data: null,
	};
	if (key === ``) { key = path; }
	if (options.convert === true) {
		inputValue = new Schema.Types.ObjectId(inputValue.toString());
	}
	if (!/^[a-fA-F0-9]{24}$/.test(inputValue.toString())) {
		if (options.convert === true) {
			response.errors.push(
				addError(path, key, `The input for "${key}" is not a MongooseId and cannot be converted into one`),
			);
		}
		else {
			response.errors.push(
				addError(path, key, `The input for "${key}" is not a MongooseId`),
			);
		}
	}
	else {
		response.data = inputValue;
	}
	return response;
}
