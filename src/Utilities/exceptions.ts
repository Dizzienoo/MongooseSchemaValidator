/**
 * A Schema Exception to highlight Errors in the Schema
 *
 * @param schemaErrors The errors detected in the way the actual schema is set up
 */
export function SchemaException(schemaErrors: object[]) {
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
export function InputException(inputErrors: object[]) {
	return {
		message: `The Input Provided has errors`,
		errors: inputErrors,
	};
}

/**
 * An Options Exception to highlight errors with the Options
 *
 * @param optionsErrors Errors generated in the Process Options function
 */
export function OptionsException(optionsErrors: object[]) {
	return {
		message: `The Options Provided have errors`,
		errors: optionsErrors,
	};
}
