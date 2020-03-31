import { EAllowedTypes, IResponse } from "./interfaces";
import { isValidSchemaOption } from "./Utilities/checkOptions";
import ConvertSchemaTypes from "./Utilities/convertSchemaTypes";
import isObject from "./Utilities/isObject";

/**
 * Takes in a Schema, validates it is correct for the validator's purposes and converts the key types to internal enums
 *
 * @param schema The Schema to validate
 */
export default async function (schema: object): Promise<IResponse> {
	const response = {
		error: false,
		errors: {},
		data: null,
	};
	// Make sure that the original input is okay
	if (schema === null || typeof schema !== `object` || Array.isArray(schema) || Object.keys(schema).length < 1) {
		return {
			error: true,
			errors: { Schema: `The Schema provided is not an object` },
			data: null,
		};
	}
	// Then take the whole Schema and Replace all the Object Functions with ENUM Types
	response.data = await ConvertSchemaTypes(schema);
	// Then pass to the recursive function to check for errors
	const recursiveResponse = await recursiveCheck(response.data);
	if (recursiveResponse.error) {
		response.error = true;
		response.errors = recursiveResponse.errors;
	}
	else {
		response.data = recursiveResponse.data;
	}
	// Return the processed schema and the errors
	return response;
}

/**
 * Recursively check every level of the schema for confirmity
 *
 * @param schema The Schema Object to check
 */
function recursiveCheck(schema: object): IResponse {
	const response: IResponse = {
		data: {},
		errors: {},
		error: false,
	};
	// Get the Keys on the Schema
	const keys = Object.keys(schema);
	// If the object includes the key "type" check if the type is an allowed type
	if (keys.includes(`type`) && !isObject(schema[`type`])) {
		// Check that the Type Declared is allowed
		if (!isAllowedType(schema[`type`])) {
			response.error = true;
			response.errors[`type`] = `Type Provided "${schema[`type`]}" is not an allowed type"`;
		}
		// If there is a type to work with
		else {
			// Check for any incoming options and set them up accordingly
			const optionsErrors = isValidSchemaOption(schema, schema[`type`]);
			// If the options are not set up correctly
			if (optionsErrors.error) {
				// Add the errors to the error array
				response.error = true;
				response.errors = optionsErrors.errors;
			}
			else {
				response.data = optionsErrors.data;
				// @ts-ignore
				response.data.type = schema[`type`];
			}
		}
	}
	// Otherwise run through each of the keys to check if they need to go deeper or are valid in their own right
	else {
		// Map through each key
		keys.forEach((k) => {
			// If the Object we are inspecting is an array
			if (Array.isArray(schema[k])) {
				// If the Array is longer than one
				if (schema[k].length > 1) {
					response.error = true;
					response.errors[k] = `Provided Section has more than one object in the array, this is not valid for a schema`;
				}
				// Otherwise, if the array is shallow (doesn't contain an object)
				else if (!isObject(schema[k][0])) {
					// If the input isn't a propper type in the shallow array
					if (!isAllowedType(schema[k][0])) {
						// Add an error
						response.error = true;
						response.errors[k] = `The provided array does not contain deeper object fields or a valid input type`;
					}
				}
				// Otherwise, we want to check the object inside the array
				else {
					const nestedErrors = recursiveCheck(schema[k][0]);
					if (nestedErrors.error) {
						response.error = true;
						response.errors[k] = nestedErrors.errors;
					}
					else {
						if (response.data[k] === undefined) { response.data[k] = []; }
						response.data[k][0] = nestedErrors.data;
						if (nestedErrors.data[`type`] !== undefined) {
							response.data[k][0].type = nestedErrors.data[`type`];
						}
					}
				}
			}
			// If the object we are inspecting is a deeper object, check the object
			else if (isObject(schema[k])) {
				const nestedErrors = recursiveCheck(schema[k]);
				if (nestedErrors.error) {
					response.error = true;
					response.errors[k] = nestedErrors.errors;
				}
				else {
					response.data[k] = nestedErrors.data;
					if (nestedErrors.data[`type`] !== undefined) {
						response.data[k].type = nestedErrors.data[`type`];
					}
				}
			}
			// Otherwise, check that the object is a permitted type
			else if (!isAllowedType(schema[k])) {
				response.error = true;
				response.errors[k] = `Type Provided "${schema[k]}" is not an allowed type`;
			}
		});
	}
	return response;
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
