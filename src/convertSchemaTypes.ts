import { EAllowedTypes } from "./interfaces";

export default async function (input: object): Promise<object> {

	const stringified = await JSON.stringify(input, (key, value) => {
		if (typeof value === `function`) {
			const funcValue = value.toString();
			if (funcValue.includes(`Date()`)) { return EAllowedTypes.DATE_TYPE; }
			else if (funcValue.includes(`String()`)) { return EAllowedTypes.STRING_TYPE; }
			else if (funcValue.includes(`Number()`)) { return EAllowedTypes.NUMBER_TYPE; }
			else if (funcValue.includes(`Boolean()`)) { return EAllowedTypes.BOOLEAN_TYPE; }
			else if (funcValue.includes(`ObjectId(key, options)`)) { return EAllowedTypes.MONGOOSE_TYPE; }
		} else if (Array.isArray(value) && value.length === 0) {
			return EAllowedTypes.MIXED_TYPE;
		} else {
			return value;
		}
	});
	return await JSON.parse(stringified);
}
