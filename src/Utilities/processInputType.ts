import handleBoolean from "../Handlers/handleBoolean";
import handleDate from "../Handlers/handleDate";
import handleMongooseId from "../Handlers/handleMongooseId";
import handleNumber from "../Handlers/handleNumber";
import handleString from "../Handlers/handleString";
import {
	EAllowedTypes,
	IHandleBooleanResponse,
	IHandleDateResponse,
	IHandleMongooseIdResponse,
	IHandleNumberResponse,
	IHandleStringResponse,
	IOptionObject,
} from "../interfaces";
import addError from "./addError";

/**
 * Takes in a schema key and an input and fires the correct processing function to process the input
 *
 * @param schemaValue
 * @param inputValue
 * @param path
 * @param key
 * @param globalOptions
 * @param localOptions
 */
export default function processInputType(
	schemaValue: EAllowedTypes,
	inputValue: any,
	path: string,
	key: string,
	globalOptions: IOptionObject = null,
	localOptions: IOptionObject = null):
	IHandleStringResponse | IHandleNumberResponse | IHandleBooleanResponse |
	IHandleDateResponse | IHandleMongooseIdResponse {
	const options: IOptionObject = Object.assign(globalOptions, localOptions);
	switch (schemaValue) {
		case EAllowedTypes.BOOLEAN_TYPE:
			return handleBoolean(inputValue, options, path, key);
		case EAllowedTypes.STRING_TYPE:
			return handleString(inputValue, options, path, key);
		case EAllowedTypes.NUMBER_TYPE:
			return handleNumber(inputValue, options, path, key);
		case EAllowedTypes.MONGOOSE_TYPE:
			return handleMongooseId(inputValue, options, path, key);
		case EAllowedTypes.DATE_TYPE:
			return handleDate(inputValue, options, path, key);
		case EAllowedTypes.MIXED_TYPE:
			return inputValue;
		default:
			return {
				data: null,
				errors: [
					addError(path, key, `The type provided "${schemaValue}" isn't supported.  This is likely a parser error.`)
				],
			};
	}
}
