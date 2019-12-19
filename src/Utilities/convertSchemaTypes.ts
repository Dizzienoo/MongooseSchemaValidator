import { EAllowedTypes } from "../interfaces";

/**
 * Converts Schema Types into Enums and Adds depth to and Shallow Inputs e.g.(name: String)
 *
 * @param input The raw schema
 */
export default async function (input: object): Promise<object> {

	const stringified = await JSON.stringify(input, (key, value) => {
		if (typeof value === `function`) {
			const funcValue = value.toString();
			if (funcValue.includes(`Date()`)) {
				return (key === `type`) ? EAllowedTypes.DATE_TYPE : { type: EAllowedTypes.DATE_TYPE };
			}
			else if (funcValue.includes(`String()`)) {
				return (key === `type`) ? EAllowedTypes.STRING_TYPE : { type: EAllowedTypes.STRING_TYPE };
			}
			else if (funcValue.includes(`Number()`)) {
				return (key === `type`) ? EAllowedTypes.NUMBER_TYPE : { type: EAllowedTypes.NUMBER_TYPE };
			}
			else if (funcValue.includes(`Boolean()`)) {
				return (key === `type`) ? EAllowedTypes.BOOLEAN_TYPE : { type: EAllowedTypes.BOOLEAN_TYPE };
			}
			else if (funcValue.includes(`ObjectId(key, options)`)) {
				return (key === `type`) ? EAllowedTypes.MONGOOSE_TYPE : { type: EAllowedTypes.MONGOOSE_TYPE };
			}
		} else if (Array.isArray(value) && value.length === 0) {
			return EAllowedTypes.MIXED_TYPE;
		} else {
			return value;
		}
	});
	return await JSON.parse(stringified);
}
