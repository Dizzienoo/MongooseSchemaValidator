import CheckSchema from "./checkSchema";
import { IGlobalOptions, IResponse } from "./interfaces";
import processInput from "./processInput";
import { isValidGlobalOption } from "./Utilities/checkOptions";
import { InputException, OptionsException, SchemaException } from "./Utilities/exceptions";

/**
 * Validates the Input vs the Pre-Created Schema
 * @param schema The Mongoose Schema tha will be used to process any inputs
 *
 * @returns{function(): void}- The returned Function
 */
export async function buildValidator(schema: object) {
	// Check the Schema for type validity and option validity
	const processedSchema = await CheckSchema(schema);
	if (processedSchema.error) {
		throw SchemaException(processedSchema.errors);
	}
	else {
		/**
		 * Ready to receive an input and process it against previously provided schema
		 *
		 * @param input The data that needs to be validated against the mongoose schema
		 * @param options Any global options for this processing attempt
		 *
		 * @returns {IResponse} Returns either the parsed data for use of an array of errors
		 */
		return async (input: object, options: IGlobalOptions = {}) =>
			await attemptProcessInput(processedSchema.data, input, options);
	}
}

/**
 * Handle the input that we have
 *
 * @param processedSchema The Pre-processed schema that we are comparing the input to
 * @param input The information we want to process
 * @param options Global options/configurations for processing the input
 */
async function attemptProcessInput(
	processedSchema: object, input: object, options: IGlobalOptions = {},
): Promise<IResponse> {
	const globalOptions = await isValidGlobalOption(options);
	if (globalOptions.error) {
		throw OptionsException({ globalOptions: globalOptions.errors });
	}
	// If the Schema is okay, run the checks against the input
	const processedInput = await processInput(processedSchema, input, options);
	// If the input processor has returned any errors and we are expecting the system to throw
	if (processedInput.error && options.throwOnError !== false) {
		throw InputException(processedInput.errors);
	}
	else if (processedInput.error) {
		return processedInput;
	}
	return processedInput;
}
