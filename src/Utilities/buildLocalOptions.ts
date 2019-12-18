import { ILocalOptionsResponse, IPotentialLocalOptions } from "../interfaces";

/**
 * Takes in a schema "tree" and consolidates any mongoose options in with any MSV options
 *
 * @param localObject A "tree" of the schema that contains the "type" variable and potentially other options
 */
export default function buildLocalOPtions(localObject: IPotentialLocalOptions): ILocalOptionsResponse {
	const response: ILocalOptionsResponse = (localObject.MSV_Options !== undefined && localObject.MSV_Options !== null) ?
		localObject.MSV_Options : {};
	if (localObject.enum !== undefined && localObject.enum !== null) {
		response.enum = localObject.enum;
	}
	if (localObject.minLength !== undefined && localObject.minLength !== null) {
		response.minLength = localObject.minLength;
	}
	if (localObject.maxLength !== undefined && localObject.maxLength !== null) {
		response.maxLength = localObject.maxLength;
	}
	if (localObject.lowercase !== undefined && localObject.lowercase !== null) {
		response.lowercase = localObject.lowercase;
	}
	if (localObject.uppercase !== undefined && localObject.uppercase !== null) {
		response.uppercase = localObject.uppercase;
	}
	if (localObject.trim !== undefined && localObject.trim !== null) {
		response.trim = localObject.trim;
	}
	if (localObject.max !== undefined && localObject.max !== null) {
		response.max = localObject.max;
	}
	if (localObject.min !== undefined && localObject.min !== null) {
		response.min = localObject.min;
	}
	if (localObject.required !== undefined && localObject.required !== null) {
		response.required = localObject.required;
	}
	return response;
}
