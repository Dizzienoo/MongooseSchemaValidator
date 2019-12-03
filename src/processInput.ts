import addError from "./addError";
import { EAllowedTypes, IHandleStringResponse, IOptionObject, IResponse } from "./interfaces";

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

function recursiveCheck(schema: object, input: object, globalOptions: IOptionObject = null, path: string = ``): IResponse {
	// Create an array of errors to return
	const response = {
		errors: [],
		data: {},
	};
	// If the Path starts with a full stop, remove the full stop
	if (path.startsWith(`.`)) { path = path.replace(`.`, ``); }
	// Get the Schema Keys
	const schemaKeys = Object.keys(schema);
	console.log(schemaKeys);
	// Get the Input Keys
	const inputKeys = Object.keys(input);
	console.log(inputKeys);
	schemaKeys.forEach((schemaKey) => {
		console.log(schema[schemaKey]);
		// If the Schema Key is A Type identifier
		const allowedType = keyIsAllowedType(schema[schemaKey]);
		if (allowedType !== null) {
			// 	Then we want to check it vs value on this layer
			const checkResponse = checkInputType(schema[schemaKey], input[schemaKey], path, schemaKey, globalOptions, schema[`MSV_Options`]);
			if (checkResponse.errors.length) {
				response.errors = response.errors.concat(checkResponse.errors);
			}
			else {
				response.data[schemaKey] = checkResponse.data;
			}
		}
		// If the schema key is an array
		else if (Array.isArray(schema[schemaKey])) {
			// 	 Then we want to handle the array
			console.log(`ITS AN ARRAY`);
			// TODO: BUILD THIS
		}
		// If the schema key is an object
		else if (typeof schema[schemaKey] === `object` && schema[schemaKey] !== null) {
			console.log(`ITS AN OBJECT`);
			// Get the keys of the sub object
			const subObjKeys = Object.keys(schema[schemaKey]);
			// If the Schema Key Object includes a type key
			if (subObjKeys.includes(`type`)) {
				console.log(schema[schemaKey].type);
				// Then we want to validate the type of the object against the non-nested value
				const checkResponse = checkInputType(
					schema[schemaKey].type,
					input[schemaKey],
					path,
					schemaKey,
					globalOptions,
					schema[schemaKey].MSV_Options,
				);
				if (checkResponse.errors.length) {
					response.errors = response.errors.concat(checkResponse.errors);
				}
				else {
					response.data[schemaKey] = checkResponse.data;
				}

			}
			// Otherwise
			else {
				// we want to deep dive
				console.error(`DEEP DIVE`);
			}
		}
		// Otherwise, it isn't a type identifier, it isn't an array, and it isn't an object to check,
		else {
			// Then we want to throw an error
			throw Error(`UNEXPECTED STUFF`);
		}
	});

	// // If this layer includes a Type Key
	// if (schemaKeys.includes(`type`)) {
	// 	console.log(`Schema Keys includes "type"`);
	// 	// Check the Type is right and handle it
	// 	const handleResponse = checkInputType(input, schema[`type`], path, ``, globalOptions, schema[`MSV_Options`]);
	// 	// If the process returned any errors
	// 	if (handleResponse.errors.length) {
	// 		// Add the Errors to the Error Array
	// 		response.errors = response.errors.concat(handleResponse.errors);
	// 	}
	// 	// Otherwise, return the data
	// 	else {
	// 		response.data = handleResponse.data;
	// 	}
	// }
	// else if (schemaKeysIncludesAllowedType(schemaKeys)) {
	// 	console.log(`Schema Keys inclues an allowed type`);
	// 	return {
	// 		errors: [],
	// 		data: null,
	// 	};
	// }
	// else {
	// 	// !! CURRENTLY FAILS BECAUSE SENDING IN THE TWO STRINGS DOESN'T WORK AND CAUSES A CONSTANT LOOP
	// 	// !! PERHAPS NEED TO RETHINK THIS WHOLE LOOP
	// 	console.log(`Neither Type nor EAllowedType has been found`);
	// 	schemaKeys.map((schemaKey) => {
	// 		console.log(schemaKey);
	// 		console.log(schema[schemaKey]);
	// 		console.log(input[schemaKey]);
	// 		// if (input[schemaKey] !== undefined) {
	// 		// 	console.log(`Not Undefined`);
	// 		// 	const recursiveResponse = recursiveCheck(schema[schemaKey], input[schemaKey], globalOptions, schemaKey);
	// 		// 	console.log(recursiveResponse);
	// 		// 	return recursiveResponse;
	// 		// }
	// 		return response;
	// 	});
	// 	// console.log(`Got to depth`);
	// 	// inputKeys.map((inputKey) => {
	// 	// 	// If we are inspecting an Array
	// 	// 	if (Array.isArray(schema[inputKey])) {
	// 	// 		// Check that the Schema also had an array here
	// 	// 		if (!Array.isArray(input[inputKey])) {
	// 	// 			response.errors.push(addError(path, inputKey, `The Input field provided does not match the schema; Schema expecting array at ${inputKey}`));
	// 	// 		}
	// 	// 		else {
	// 	// 			// !!!  CURRENTLY STOPPED HERE.  AM NOW PROCESSING STRING DATA, HOWEVER NOT SURE THIS WILL WORK FOR ALL EDGE CASES
	// 	// 			console.log(`AT ARRAY`);
	// 	// 			console.log(input[inputKey]);
	// 	// 			console.log(schema[inputKey]);
	// 	// 			// Map through each key, adding it to the response
	// 	// 			input[inputKey].map((key) => {
	// 	// 				console.log(key);
	// 	// 				const nestedResponse = checkInputType(schema[inputKey][0][`type`], key, path, inputKey, globalOptions, null);
	// 	// 				// const nestedResponse = recursiveCheck(schema[inputKey][0], key, globalOptions, `${path}.${inputKey}`);
	// 	// 				if (nestedResponse.errors.length) { response.errors = response.errors.concat(nestedResponse.errors); }
	// 	// 				else { response.data[inputKey] = nestedResponse.data; }
	// 	// 			});


	// 	// 		}
	// 	// 	}
	// 	// });
	// }
	console.log(response);
	return response;
}


function checkInputType(schemaValue, inputValue, path, key, globalOptions: IOptionObject = null, localOptions: IOptionObject = null):
	IHandleStringResponse {
	const options: IOptionObject = (localOptions === null || globalOptions.disableLocalOptions) ? globalOptions : localOptions;
	switch (schemaValue) {
		case EAllowedTypes.BOOLEAN_TYPE:
			console.error(`CURRENTLY UNHANLDED`);
			throw Error(`ERROR BOOLEAN`);
			break;
		case EAllowedTypes.STRING_TYPE:
			console.log(`FOUND STRING TYPE`);
			return handleString(inputValue, options, path, key);
		case EAllowedTypes.BOOLEAN_TYPE:
			console.error(`CURRENTLY UNHANLDED`);
			throw Error(`ERROR BOOLEAN`);
			break;
		case EAllowedTypes.BOOLEAN_TYPE:
			console.error(`CURRENTLY UNHANLDED`);
			throw Error(`ERROR BOOLEAN`);
			break;
		case EAllowedTypes.BOOLEAN_TYPE:
			console.error(`CURRENTLY UNHANLDED`);
			throw Error(`ERROR BOOLEAN`);
			break;
		default:
			console.error(`Unexpected schemaValue Error`);
			// TODO: HANDLE THIS
			throw Error(`ERROR DEFAULT`);
			break;
	}
	// console.log(inputValue);
}


function handleString(inputValue: String, options: IOptionObject, path: string, key): IHandleStringResponse {
	const response: IHandleStringResponse = {
		errors: [],
		data: null,
	};
	console.log(inputValue);
	console.log(typeof inputValue);
	if (key === ``) { key = path; }
	if (options.convert === true) {
		inputValue = String(inputValue);
	}
	if (typeof inputValue !== `string`) {
		if (options.convert === true) {
			response.errors.push(addError(path, key, `The input ${key} is not a string and cannot be converted into one`));
		}
		else {
			response.errors.push(addError(path, key, `The input ${key} is not a string`));
		}
	}
	else {
		// Add the Data to the response
		response.data = inputValue;
	}
	console.log(`RETURNING`, response, `FROM HANDLESTRING`);
	return response;
}

/**
 * Checks if a Schema Key is one of the EAllowedTypes
 * @param schemaKeys The Schema Key to check
 *
 * @returns {EAllowedTypes} Allowed type if appropriate or null
 */
function keyIsAllowedType(schemaKey: string): EAllowedTypes {
	if (schemaKey === EAllowedTypes.BOOLEAN_TYPE) { return EAllowedTypes.BOOLEAN_TYPE; }
	if (schemaKey === EAllowedTypes.DATE_TYPE) { return EAllowedTypes.DATE_TYPE; }
	if (schemaKey === EAllowedTypes.MIXED_TYPE) { return EAllowedTypes.MIXED_TYPE; }
	if (schemaKey === EAllowedTypes.MONGOOSE_TYPE) { return EAllowedTypes.MONGOOSE_TYPE; }
	if (schemaKey === EAllowedTypes.NUMBER_TYPE) { return EAllowedTypes.NUMBER_TYPE; }
	if (schemaKey === EAllowedTypes.STRING_TYPE) { return EAllowedTypes.STRING_TYPE; }
	return null;
}
