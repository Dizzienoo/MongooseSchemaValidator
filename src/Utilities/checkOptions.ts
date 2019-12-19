import {
	EAllowedTypes,
	ESupportedMongooseOptions,
	IGlobalOptions,
	IGlobalOptionsResponse,
	IMongooseOptionsResponse,
} from "../interfaces";
import addError from "./addError";

/**
 * Takes in a Mongoose Option and Handles Appropriately
 *
 * @param SchemaOption A potential mongoose option from the schema
 * @param type The schema type we are going to process
 */
export function isValidSchemaOption(SchemaOption: object, type: EAllowedTypes): IMongooseOptionsResponse {
	let response: IMongooseOptionsResponse = {
		errors: [],
		data: {},
	};
	// Get the Keys from the incoming Object
	const fieldKeys = Object.keys(SchemaOption);
	fieldKeys.forEach((fieldKey) => {
		// If the field Key is actually one we want to validate
		if (isMonitoredKey(fieldKey)) {
			// If the field key is a universal key
			if (
				fieldKey === ESupportedMongooseOptions.REQUIRED ||
				fieldKey === ESupportedMongooseOptions.CONVERT ||
				fieldKey === ESupportedMongooseOptions.SKIP
			) {
				// All the universal keys are booleans, run handle Bool to validate
				response = processBooleanOption(SchemaOption, fieldKey, response);
			}
			// Otherwise we need to manage byinput type
			else {
				switch (type) {
					// If the option is attached to processing a string
					case EAllowedTypes.STRING_TYPE:
						switch (fieldKey) {
							// If it is lowercase, uppercase or trim
							case ESupportedMongooseOptions.LOWERCASE:
							case ESupportedMongooseOptions.UPPERCASE:
							case ESupportedMongooseOptions.TRIM:
								// Handle the Boolean
								response = processBooleanOption(SchemaOption, fieldKey, response);
								break;
							// If the option is min or max length
							case ESupportedMongooseOptions.MIN_LENGTH:
							case ESupportedMongooseOptions.MAX_LENGTH:
								// Handle the number
								response = processNumberOption(SchemaOption, fieldKey, response);
								break;
							case ESupportedMongooseOptions.ENUM:
								// Handle the enum
								response = processEnumOption(SchemaOption, fieldKey, response);
								break;
							// Otherwise, this option shouldn't be on this type
							default:
								response.errors.push(addError(`schemaOptions`, `${fieldKey}`, `Option "${fieldKey}" is not an accepted key on "${type}"`));
								break;
						}
						break;
					case EAllowedTypes.NUMBER_TYPE:
						switch (fieldKey) {
							case ESupportedMongooseOptions.MIN:
							case ESupportedMongooseOptions.MAX:
								// Handle the number
								response = processNumberOption(SchemaOption, fieldKey, response);
								break;
							// Otherwise, this option shouldn't be on this type
							default:
								response.errors.push(addError(`schemaOptions`, `${fieldKey}`, `Option "${fieldKey}" is not an accepted key on "${type}"`));
								break;
						}
						break;
					case EAllowedTypes.DATE_TYPE:
						switch (fieldKey) {
							case ESupportedMongooseOptions.MIN:
							case ESupportedMongooseOptions.MAX:
								// Handle the date
								response = processDateOption(SchemaOption, fieldKey, response);
								break;
							// Otherwise, this option shouldn't be on this type
							default:
								response.errors.push(addError(`schemaOptions`, `${fieldKey}`, `Option "${fieldKey}" is not an accepted key on "${type}"`));
								break;
						}
						break;
					default:
						response.errors.push(addError(`schemaOptions`, `${fieldKey}`, `Option "${fieldKey}" is not an accepted key on "${type}"`));
						break;
				}
			}
		}
	});
	return response;
}

/**
 * Takes in the global options for validate and checks they are use-able
 *
 * @param globalOptions The options the User has provided to the validate function
 */
export function isValidGlobalOption(globalOptions: IGlobalOptions): IGlobalOptionsResponse {
	const response: IGlobalOptionsResponse = {
		errors: [],
		data: {},
	};
	if (globalOptions.convertValues) {
		if (globalOptions.convertValues === true || globalOptions.convertValues === false) {
			response.data.convertValues = globalOptions.convertValues;
		}
		else {
			response.errors.push(addError(`globalOptions`, `convertValues`, `Option provided in the global Options, "convertValues", needs to be be a boolean`));
		}
	}
	if (globalOptions.trimExtraFields) {
		if (globalOptions.trimExtraFields === true || globalOptions.trimExtraFields === false) {
			response.data.trimExtraFields = globalOptions.trimExtraFields;
		}
		else {
			response.errors.push(addError(`globalOptions`, `trimExtraFields`, `Option provided in the global Options, "trimExtraFields", needs to be be a boolean`));
		}
	}
	if (globalOptions.ignoreRequired) {
		if (globalOptions.ignoreRequired === true || globalOptions.ignoreRequired === false) {
			response.data.ignoreRequired = globalOptions.ignoreRequired;
		}
		else {
			response.errors.push(addError(`globalOptions`, `ignoreRequired`, `Option provided in the global Options, "ignoreRequired", needs to be be a boolean`));
		}
	}
	if (globalOptions.disableLocalOptions) {
		if (globalOptions.disableLocalOptions === true || globalOptions.disableLocalOptions === false) {
			response.data.disableLocalOptions = globalOptions.disableLocalOptions;
		}
		else {
			response.errors.push(addError(`globalOptions`, `disableLocalOptions`, `Option provided in the global Options, "disableLocalOptions", needs to be be a boolean`));
		}
	}
	if (globalOptions.doNotThrow) {
		if (globalOptions.doNotThrow === true || globalOptions.doNotThrow === false) {
			response.data.doNotThrow = globalOptions.doNotThrow;
		}
		else {
			response.errors.push(addError(`globalOptions`, `doNotThrow`, `Option provided in the global Options, "doNotThrow", needs to be be a boolean`));
		}
	}
	return response;
}

/**
 * Checks wether a key is one of the schema keys the system should be checking
 *
 * @param key The Key to check
 */
function isMonitoredKey(key: string): boolean {

	if (
		key === ESupportedMongooseOptions.ENUM ||
		key === ESupportedMongooseOptions.MIN_LENGTH ||
		key === ESupportedMongooseOptions.MAX_LENGTH ||
		key === ESupportedMongooseOptions.MIN ||
		key === ESupportedMongooseOptions.MAX ||
		key === ESupportedMongooseOptions.LOWERCASE ||
		key === ESupportedMongooseOptions.UPPERCASE ||
		key === ESupportedMongooseOptions.TRIM ||
		key === ESupportedMongooseOptions.REQUIRED ||
		key === ESupportedMongooseOptions.CONVERT ||
		key === ESupportedMongooseOptions.SKIP
	) { return true; }
	return false;
}

/**
 * Utility Function to process Boolean Options without re-writing the same code 10 times
 *
 * @param SchemaOption A potential mongoose option from the schema
 * @param fieldKey The key we are examining
 * @param response The full response to be sent back to the parent function
 */
function processBooleanOption(
	SchemaOption: object, fieldKey: string, response: IMongooseOptionsResponse,
): IMongooseOptionsResponse {
	if (SchemaOption[fieldKey] === true || SchemaOption[fieldKey] === false) {
		response.data[fieldKey] = { value: SchemaOption[fieldKey] };
	}
	else if (Array.isArray(SchemaOption[fieldKey])) {
		if (SchemaOption[fieldKey][0] === true || SchemaOption[fieldKey][0] === false) {
			response.data[fieldKey] = { value: SchemaOption[fieldKey][0] };
		}
		else {
			response.errors.push(addError(`schemaOptions`, `${fieldKey}.value`, `Value provided in the Schema Option "${fieldKey}" should be a boolean`));
		}
		if (SchemaOption[fieldKey][1] !== undefined && typeof SchemaOption[fieldKey][1] !== `string`) {
			response.errors.push(addError(`schemaOptions`, `${fieldKey}.message`, `Message provided in the Schema Option "${fieldKey}" should be a string`));
		}
		else if (SchemaOption[fieldKey][1] !== undefined) {
			response.data[fieldKey].message = SchemaOption[fieldKey][1];
		}
	}
	else if (SchemaOption[fieldKey].value === true || SchemaOption[fieldKey].value === false) {
		response.data[fieldKey] = SchemaOption[fieldKey];
	}
	else {
		response.errors.push(addError(`schemaOptions`, `${fieldKey}.value`, `Value provided in the Schema Option "${fieldKey}" should be a boolean`));
	}
	if (SchemaOption[fieldKey].message !== undefined && typeof SchemaOption[fieldKey].message !== `string`) {
		response.errors.push(addError(`schemaOptions`, `${fieldKey}.message`, `Message provided in the Schema Option "${fieldKey}" should be a string`));
	}
	return response;
}

/**
 * Utility Function to process Number Options without re-writing the same code 10 times
 *
 * @param SchemaOption A potential mongoose option from the schema
 * @param fieldKey The key we are examining
 * @param response The full response to be sent back to the parent function
 */
function processNumberOption(
	SchemaOption: object, fieldKey: string, response: IMongooseOptionsResponse,
): IMongooseOptionsResponse {
	if (typeof (SchemaOption[fieldKey]) === `number`) {
		response.data[fieldKey] = { value: SchemaOption[fieldKey] };
	}
	else if (Array.isArray(SchemaOption[fieldKey])) {
		if (typeof (SchemaOption[fieldKey][0]) === `number`) {
			response.data[fieldKey] = { value: SchemaOption[fieldKey][0] };
		}
		else {
			response.errors.push(addError(`schemaOptions`, `${fieldKey}.value`, `Value provided in the Schema Option "${fieldKey}" should be a number`));
		}
		if (SchemaOption[fieldKey][1] !== undefined && typeof SchemaOption[fieldKey][1] !== `string`) {
			response.errors.push(addError(`schemaOptions`, `${fieldKey}.message`, `Message provided in the Schema Option "${fieldKey}" should be a string`));
		}
		else if (SchemaOption[fieldKey][1] !== undefined) {
			response.data[fieldKey].message = SchemaOption[fieldKey][1];
		}
	}
	else if (typeof (SchemaOption[fieldKey].value) === `number`) {
		response.data[fieldKey] = SchemaOption[fieldKey];
	}
	else {
		response.errors.push(addError(`schemaOptions`, `${fieldKey}.value`, `Value provided in the Schema Option "${fieldKey}" should be a number`));
	}
	if (SchemaOption[fieldKey].message !== undefined && typeof SchemaOption[fieldKey].message !== `string`) {
		response.errors.push(addError(`schemaOptions`, `${fieldKey}.message`, `Message provided in the Schema Option "${fieldKey}" should be a string`));
	}
	return response;
}

/**
 * Utility Function to process Date Options without re-writing the same code 10 times
 *
 * @param SchemaOption A potential mongoose option from the schema
 * @param fieldKey The key we are examining
 * @param response The full response to be sent back to the parent function
 */
function processDateOption(
	SchemaOption: object, fieldKey: string, response: IMongooseOptionsResponse,
): IMongooseOptionsResponse {
	if (new Date(SchemaOption[fieldKey]).toString() !== `Invalid Date`) {
		response.data[fieldKey] = { value: new Date(SchemaOption[fieldKey]) };
	}
	else if (Array.isArray(SchemaOption[fieldKey])) {
		if (new Date(SchemaOption[fieldKey][0]).toString() !== `Invalid Date`) {
			response.data[fieldKey] = { value: new Date(SchemaOption[fieldKey][0]) };
		}
		else {
			response.errors.push(addError(`schemaOptions`, `${fieldKey}.value`, `Value provided in the Schema Option "${fieldKey}" should be a date`));
		}
		if (SchemaOption[fieldKey][1] !== undefined && typeof SchemaOption[fieldKey][1] !== `string`) {
			response.errors.push(addError(`schemaOptions`, `${fieldKey}.message`, `Message provided in the Schema Option "${fieldKey}" should be a string`));
		}
		else if (SchemaOption[fieldKey][1] !== undefined) {
			response.data[fieldKey].message = SchemaOption[fieldKey][1];
		}
	}
	else if (new Date(SchemaOption[fieldKey].value).toString() !== `Invalid Date`) {
		response.data[fieldKey] = { value: new Date(SchemaOption[fieldKey].value) };
		if (SchemaOption[fieldKey].message !== undefined) {
			response.data[fieldKey].message = SchemaOption[fieldKey].message;
		}
	}
	else {
		response.errors.push(addError(`schemaOptions`, `${fieldKey}.value`, `Value provided in the Schema Option "${fieldKey}" should be a date`));
	}
	if (SchemaOption[fieldKey].message !== undefined && typeof SchemaOption[fieldKey].message !== `string`) {
		response.errors.push(addError(`schemaOptions`, `${fieldKey}.message`, `Message provided in the Schema Option "${fieldKey}" should be a string`));
	}
	return response;
}

/**
 * Utility Function to process Enum Options without re-writing the same code 10 times
 *
 * @param SchemaOption A potential mongoose option from the schema
 * @param fieldKey The key we are examining
 * @param response The full response to be sent back to the parent function
 */
function processEnumOption(
	SchemaOption: object, fieldKey: string, response: IMongooseOptionsResponse,
): IMongooseOptionsResponse {
	if (Array.isArray(SchemaOption[fieldKey])) {
		response.data[fieldKey] = { value: SchemaOption[fieldKey] };
	}
	else if (Array.isArray(SchemaOption[fieldKey].value)) {
		response.data[fieldKey] = { value: SchemaOption[fieldKey].value };
	}
	else {
		response.errors.push(addError(`schemaOptions`, `${fieldKey}.value`, `Value provided in the Schema Option "${fieldKey}" should be a number`));
	}
	if (SchemaOption[fieldKey].message !== undefined && typeof SchemaOption[fieldKey].message !== `string`) {
		response.errors.push(addError(`schemaOptions`, `${fieldKey}.message`, `Message provided in the Schema Option "${fieldKey}" should be a string`));
	}
	return response;
}
