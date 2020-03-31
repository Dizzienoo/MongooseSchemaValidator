import handleBoolean from "../Handlers/handleBoolean";
import handleDate from "../Handlers/handleDate";
import handleMongooseId from "../Handlers/handleMongooseId";
import handleNumber from "../Handlers/handleNumber";
import handleString from "../Handlers/handleString";
import {
	EAllowedTypes,
	ICombinedOptions,
	IGlobalOptions,
	IHandleBooleanResponse,
	IHandleDateResponse,
	IHandleMongooseIdResponse,
	IHandleNumberResponse,
	IHandleStringResponse,
} from "../interfaces";

/**
 * Takes in a schema key and an input and fires the correct processing function to process the input
 *
 * @param schemaValue
 * @param inputValue
 * @param key
 * @param globalOptions
 * @param localOptions
 */
export default function processInputType(
	schemaValue: EAllowedTypes,
	inputValue: any,
	key: string,
	globalOptions: IGlobalOptions = null,
	localOptions: IGlobalOptions = null):
	IHandleStringResponse | IHandleNumberResponse | IHandleBooleanResponse |
	IHandleDateResponse | IHandleMongooseIdResponse {
	const options: ICombinedOptions = Object.assign({}, globalOptions, localOptions);
	// If we need to skip the input
	if (options.skip?.value !== true) {
		switch (schemaValue) {
			case EAllowedTypes.BOOLEAN_TYPE:
				return handleBoolean(inputValue, options, key);
			case EAllowedTypes.STRING_TYPE:
				return handleString(inputValue, options, key);
			case EAllowedTypes.NUMBER_TYPE:
				return handleNumber(inputValue, options, key);
			case EAllowedTypes.MONGOOSE_TYPE:
				return handleMongooseId(inputValue, options, key);
			case EAllowedTypes.DATE_TYPE:
				return handleDate(inputValue, options, key);
			case EAllowedTypes.MIXED_TYPE:
				return inputValue;
			default:
				return {
					data: null,
					error: true,
					errors: {
						[key]: `The type provided "${schemaValue}" isn't supported.  This is likely a parser error.`,
					},
				};
		}
	}
	else {
		return {
			error: false,
			errors: {},
			data: inputValue,
		};
	}
}
