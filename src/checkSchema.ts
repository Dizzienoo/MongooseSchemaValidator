import addError from "./addError";
import ConvertSchemaTypes from "./convertSchemaTypes";
import { EAllowedTypes, EOptionTypes, IOptionObject, IResponse } from "./interfaces";

/**
 * Takes in a Schema, validates it is correct for the validator's purposes and converts the key types to internal enums
 *
 * @param schema The Schema to validate
 */
export default async function (schema: object, options: IOptionObject): Promise<IResponse> {
	const response = {
		errors: [],
		data: null,
	};
	// Make sure that the original input is okay
	if (schema === null || typeof schema !== `object` || Array.isArray(schema) || Object.keys(schema).length < 1) {
		return {
			errors: [{ Schema: `The Schema provided is not an object` }],
			data: null,
		};
	}
	// Then take the whole Schema and Replace all the Object Functions with ENUM Types
	response.data = await ConvertSchemaTypes(schema);
	// Then pass to the recursive function to check for errors
	response.errors = await recursiveCheck(response.data);
	// Then pass through all the provided options to check for any issues
	response.errors = response.errors.concat(await isValidOption(options));
	// Return the processed schema and the errors
	return response;
}

/**
 * Recursively check every level of the schema for confirmity
 *
 * @param schema The Schema Object to check
 * @param path The previous path that is being innvestigated
 */
function recursiveCheck(schema: object, path: string = ``): object[] {
	// Create an array of errors to return
	let errors = [];
	// If the Path starts with a full stop, remove the full stop
	if (path.startsWith(`.`)) { path = path.replace(`.`, ``); }
	// Get the Keys on the Schema
	const keys = Object.keys(schema);
	// If the object includes the key "type" check if the type is an allowed type
	if (keys.includes(`type`)) {
		// Otherwise run through each of the keys to check if they need to go deeper or are valid in their own right
		if (!isAllowedType(schema[`type`])) { errors.push(addError(path, `type`, `Type Provided "${schema[`type`]}" is not an allowed type"`)); }
		// If the user has specified some MSV Options in this "branch"
		else if (keys.includes(`MSV_Options`)) {
			// If those options are invalid
			const optionErrors = isValidSchemaOption(schema[`MSV_Options`], path);
			// If the options parser has found errors
			if (optionErrors.length) {
				// Add those errors to the Errors list
				errors = errors.concat(optionErrors);
			}
		}
	}
	else {
		// Map through each key
		keys.map((k) => {
			// If the Object we are inspecting is an array
			if (Array.isArray(schema[k])) {
				// If the Array is longer than one
				if (schema[k].length > 1) {
					errors.push(addError(path, k, `Provided Section has more than one object in the array, this is not valid for a schema`));
				}
				// Otherwise, we want to check the object inside the array
				else {
					const nestedErrors = recursiveCheck(schema[k][0], `${path}.${k}`);
					if (nestedErrors.length) { errors = errors.concat(nestedErrors); }
				}
			}
			// If the object we are inspecting is a deeper object, check the object
			else if (isObject(schema[k])) {
				const nestedErrors = recursiveCheck(schema[k], `${path}.${k}`);
				if (nestedErrors.length) { errors = errors.concat(nestedErrors); }
			}
			// Otherwise, check that the object is a permitted type
			else if (!isAllowedType(schema[k])) {
				errors.push(addError(path, k, `Type Provided "${schema[k]}" is not an allowed type`));
			}
		});
	}
	return errors;
}

/**
 * Checks if the field is one of our allowed types
 *
 * @param type The field to test
 *
 * @returns {boolean} True if the type is allowed
 *
 */
function isAllowedType(type: EAllowedTypes): boolean {
	return (type === EAllowedTypes.BOOLEAN_TYPE ||
		type === EAllowedTypes.DATE_TYPE ||
		type === EAllowedTypes.MONGOOSE_TYPE ||
		type === EAllowedTypes.NUMBER_TYPE ||
		type === EAllowedTypes.STRING_TYPE ||
		type === EAllowedTypes.MIXED_TYPE);
}

/**
 * Checks if the value is an object with any fields to parse
 *
 * @param value The value to inspect for depth
 */
function isObject(value): boolean {
	return !(value === null || typeof value !== `object` || Array.isArray(value) || Object.keys(value).length < 1);
}

/**
 * Takes in the top level options object and checks it is valid
 *
 * @param optionObject The Top level options object
 */
function isValidOption(optionObject: IOptionObject): object[] {
	const errors = [];
	// Make sure that the original input is okay
	if (optionObject !== null && (typeof optionObject !== `object` || Array.isArray(optionObject))) {
		errors.push({ Options: `The Options provided is not an object` });
		return errors;
	}
	const optionKeys = Object.keys(optionObject);
	if (optionKeys.length) {
		optionKeys.map((option) => {
			if (!isAllowedOptionType(option, false)) {
				errors.push(addError(``, `Options`, `The provided option "${option}" is not recognised as a valid MSV Option`));
			}
			else {
				switch (option) {
					case EOptionTypes.CONVERT:
					case EOptionTypes.TRIM:
						if (optionObject[option] !== true && optionObject[option] !== false) {
							errors.push(addError(``, `MSV_Options`, `The provided option "${option}" should be a boolean value`));
						}
						break;
				}
			}
		});
	}
	return errors;
}

/**
 * Takes in an MSV_Options object from the schema and validates it's options
 *
 * @param optionObject The options object we need to validate
 * @param path The nested path
 *
 * @returns Empty array if the options provided are allowed
 */
function isValidSchemaOption(optionObject: object, path: string): object[] {
	const errors = [];
	const optionKeys = Object.keys(optionObject);
	optionKeys.map((option) => {
		if (!isAllowedOptionType(option, true)) {
			errors.push(
				addError(path, `MSV_Options`, `The provided option "${option}" is not recognised as a valid MSV Option`),
			);
		}
		else {
			switch (option) {
				case EOptionTypes.CONVERT:
				case EOptionTypes.SKIP:
				case EOptionTypes.TRIM:
				case EOptionTypes.DISABLE_LOCAL_OPTIONS:
					if (optionObject[option] !== true && optionObject[option] !== false) {
						errors.push(addError(path, `MSV_Options`, `The provided option "${option}" should be a boolean value`));
					}
					break;
			}
		}
	});
	return errors;
}

/**
 * Checks if a passed in option is an allowed option
 *
 * @param key The Option key
 * @param schema Is the check for a schema key or main (true for schema key)
 *
 * @returns True if the passed in key is an allowed option
 */
function isAllowedOptionType(key: string, schema: boolean): boolean {
	if (
		schema &&
		key !== EOptionTypes.CONVERT &&
		key !== EOptionTypes.TRIM &&
		key !== EOptionTypes.SKIP
	) {
		return false;
	}
	else if (
		!schema &&
		key !== EOptionTypes.CONVERT &&
		key !== EOptionTypes.TRIM &&
		key !== EOptionTypes.DISABLE_LOCAL_OPTIONS
	) {
		return false;
	}
	return true;
}
