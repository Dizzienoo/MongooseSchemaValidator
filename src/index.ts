import CheckSchema from "./checkSchema";
import { IOptionObject, IResponse } from "./interfaces";
import processInput from "./processInput";

/**
 * Validates the Input vs the Pre-Created Schema
 * @param schema The Mongoose Schema tha will be used to process any inputs
 *
 * @returns{function(): void}- The returned Function
 */
export async function buildValidator(schema: object) {
	// Check the Schema for type validity and option validity
	const processedSchema = await CheckSchema(schema, {});
	if (processedSchema.errors.length) {
		throw SchemaException(processedSchema.errors);
	}
	else {
		/**
		 * Ready to recieve an input and process it against previously provided schema
		 *
		 * @param input The data that needs to be validated against the mongoose schema
		 * @param options Any global options for this processing attempt
		 *
		 * @returns {IResponse} Returns either the parsed data for use of an array of errors
		 */
		const inner = async (input: object, options: IOptionObject = {}) =>
			await attemptProcessInput(processedSchema.data, input, options);
		return inner;
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
	processedSchema: object, input: object, options: IOptionObject = {},
): Promise<object | object[]> {
	// If the Schema is okay, run the checks against the input
	const processedInput = await processInput(processedSchema, input, options);
	// If the input processor has returned any errors
	if (processedInput.errors.length) {
		throw InputException(processedInput.errors);
	}
	return processedInput.data;
}

/**
 * A Schema Exception to highlight Errors in the Schema
 *
 * @param schemaErrors The errors detected in the way the actual schema is set up
 */
function SchemaException(schemaErrors: object[]) {
	return {
		message: `Schema Unable to be parsed due to errors`,
		errors: schemaErrors,
	};
}

/**
 * An Input Exception to highlight errors with the Input
 *
 * @param inputErrors Errors generated in the Process Input function
 */
function InputException(inputErrors: object[]) {
	return {
		message: `The Input Provided has errors`,
		errors: inputErrors,
	};
}
