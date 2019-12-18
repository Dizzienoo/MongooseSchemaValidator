import { IOptionObject, IResponse } from "./interfaces";
import addError from "./Utilities/addError";
import buildLocalOptions from "./Utilities/buildLocalOptions";
import isObject from "./Utilities/isObject";
import keyIsAllowedType from "./Utilities/keyIsAllowedType";
import processInputType from "./Utilities/processInputType";

export default async function (schema: object, input: object, globalOptions: IOptionObject): Promise<IResponse> {
	const response = {
		errors: [],
		data: null,
	};
	// Make sure that the schema has been passed in
	if (schema === null || typeof schema !== `object` || Array.isArray(schema) || Object.keys(schema).length < 1) {
		response.errors.push({ Schema: `The Schema provided is not an object` });
		return response;
	}
	// Make sure that the original input is okay
	if (input === null || typeof input !== `object` || Array.isArray(input) || Object.keys(input).length < 1) {
		response.errors.push({ Input: `The input provided is not a populated object` });
		return response;
	}
	return await recursiveCheck(schema, input, globalOptions);
}

/**
 * Recursively Check the input objects for validity
 *
 * @param schema The Schema to Check Against
 * @param input The input we are checking
 * @param globalOptions The Options provided with the check
 * @param path The location fo the input depth
 */
function recursiveCheck(
	schema: object, input: object, globalOptions: IOptionObject = null, path: string = ``,
): IResponse {
	// Create an array of errors to return
	const response = {
		errors: [],
		data: {},
	};
	// If the Path starts with a full stop, remove the full stop
	if (path.startsWith(`.`)) { path = path.replace(`.`, ``); }
	// Get the Schema Keys
	let schemaKeys = Object.keys(schema);
	// Get the input keys
	const inputKeys = Object.keys(input);
	// Parse through each input key
	inputKeys.forEach((inputKey) => {
		// If the	input key is defined in the schema
		if (schemaKeys.includes(inputKey)) {
			// Remove the key from the schema, it won't need to be checked later
			schemaKeys = schemaKeys.filter((e) => e !== inputKey);
			// Define the schema key
			const schemaKey = inputKey;
			// If the Schema Key is A Type identifier
			const allowedType = keyIsAllowedType(schema[schemaKey]);
			if (allowedType !== null) {
				// 	Then we want to check it vs value on this layer
				const checkResponse = processInputType(schema[schemaKey], input[schemaKey], path, schemaKey, globalOptions, schema[`MSV_Options`]);
				if (checkResponse.errors.length) {
					response.errors = response.errors.concat(checkResponse.errors);
				}
				else if (checkResponse.data !== null) {
					response.data[schemaKey] = checkResponse.data;
				}
			}
			// If the schema key is an array
			else if (Array.isArray(schema[schemaKey])) {
				// Then we want to handle the array
				if (!Array.isArray(input[schemaKey])) {
					response.errors = response.errors.concat([addError(path, schemaKey, `Expecting an Array of entries but did not recieve one`)]);
				}
				// Otherwise, if the schema array simply had a type def in it
				else if (keyIsAllowedType(schema[schemaKey][0])) {
					// Go through each object in the input array
					input[schemaKey].forEach((arrayKey, i) => {
						// Process the input with the nested schema
						const arrRes = processInputType(schema[schemaKey][0], arrayKey, path, `${schemaKey}[${i}]`, globalOptions, {});
						if (arrRes.errors.length) {
							response.errors = response.errors.concat(arrRes.errors);
						}
						else if (arrRes.data !== null) {
							if (response.data[schemaKey] === undefined) { response.data[schemaKey] = []; }
							response.data[schemaKey].push(arrRes.data);
						}
					});

				}
				else {
					// Check the inside of the Array Object
					const potentialKeys = Object.keys(schema[schemaKey][0]);
					// If the inside of the object includes type
					if (potentialKeys.includes(`type`) && !isObject(schema[schemaKey].type)) {
						// Use this object as the schema and process through each input array value
						input[schemaKey].forEach((arrayKey, i) => {
							// Then we need to add any options from this block to local options
							const localOptions = (globalOptions.disableLocalOptions !== true) ? buildLocalOptions(schema[schemaKey]) : {};
							// Process The input values
							const processResponse = processInputType(
								schema[schemaKey][0].type, arrayKey, path, `schemaKey[${i}]`, globalOptions, localOptions,
							);
							if (processResponse.errors.length) {
								response.errors = response.errors.concat(processResponse.errors);
							}
							else if (processResponse.data !== null) {
								if (response.data[schemaKey] === undefined) { response.data[schemaKey] = []; }
								response.data[schemaKey].push(processResponse.data);
							}
						});
					}
					else {
						// If there is more depth to the object
						input[schemaKey].forEach((arrayKey, i) => {
							// Go in and recursively dive into the objects
							const recursiveResponse = recursiveCheck(schema[schemaKey][0], arrayKey, globalOptions, path);
							let responseKeys = [];
							if (recursiveResponse.data !== null) {
								responseKeys = Object.keys(recursiveResponse.data);
							}
							if (recursiveResponse.errors.length) {
								response.errors = response.errors.concat(recursiveResponse.errors);
							}
							else if (recursiveResponse.data !== null && responseKeys.length) {
								if (response.data[schemaKey] === undefined) { response.data[schemaKey] = []; }
								response.data[schemaKey].push(recursiveResponse.data);
							}
						});
					}
				}
			}
			// If the schema key is an object
			else if (typeof schema[schemaKey] === `object` && schema[schemaKey] !== null) {
				// Get the keys of the sub object
				const subObjKeys = Object.keys(schema[schemaKey]);
				// If the Schema Key Object includes a type key
				if (subObjKeys.includes(`type`) && !isObject(schema[schemaKey].type)) {
					// Check that there is an input to check
					// TODO: THIS MAY BE BETTER MOVED TO THE TOP OF THE FUNCTION
					if (input === undefined || input[schemaKey] === undefined) {
						if (schema[schemaKey].required === true && !globalOptions.ignoreRequired) {
							response.errors = response.errors.concat([addError(path, schemaKey, `The input for "${schemaKey}" is required but empty`)]);
						}
						else {
							response.data = null;
						}
						return response;
					}
					// Then we need to add any options from this block to local options
					const localOptions = (globalOptions.disableLocalOptions !== true) ? buildLocalOptions(schema[schemaKey]) : {};
					// Then we want to validate the type of the object against the non-nested value
					const checkResponse = processInputType(
						schema[schemaKey].type,
						input[schemaKey],
						path,
						schemaKey,
						globalOptions,
						localOptions,
					);
					if (checkResponse.errors.length) {
						response.errors = response.errors.concat(checkResponse.errors);
					}
					else if (checkResponse.data !== null) {
						if (response.data === null) { response.data = {}; }
						response.data[schemaKey] = checkResponse.data;
					}

				}
				// Otherwise
				else {
					// we want to deep dive
					const deepResponse = recursiveCheck(schema[schemaKey], input[schemaKey], globalOptions, `${path}.${schemaKey}`);
					if (deepResponse.errors.length) {
						response.errors = response.errors.concat(deepResponse.errors);
					}
					else if (deepResponse.data !== null) {
						response.data[schemaKey] = deepResponse.data;
					}
				}
			}
			// Otherwise, it isn't a type identifier, it isn't an array, and it isn't an object to check
			else {
				// Then we want to throw an error
				throw Error(`UNEXPECTED ERROR`);
			}
		}
		// If we don't need to get rid of the extra inputs, add them to the response
		else if (!globalOptions.trimExtraFields) {
			response.data[inputKey] = input[inputKey];
		}
	});
	// If there are any schema keys left, check if they are required
	if (schemaKeys.length) {
		schemaKeys.forEach((schemaKey) => {
			if (schema[schemaKey].required && !globalOptions.ignoreRequired) {
				response.errors.push(
					addError(path, schemaKey, `The input for "${schemaKey}" is required but empty`),
				);
			}
		});
	}
	return response;
}
