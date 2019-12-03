/**
 * The values that the system recognises
 */
export enum EAllowedTypes {
	DATE_TYPE = "DATE_TYPE",
	MIXED_TYPE = "MIXED_TYPE",
	STRING_TYPE = "STRING_TYPE",
	NUMBER_TYPE = "NUMBER_TYPE",
	BOOLEAN_TYPE = "BOOLEAN_TYPE",
	MONGOOSE_TYPE = "MONGOOSE_TYPE",
}

/**
 * The avalable options as inputs
 */
export interface IOptionObject {
	convert?: boolean;
	trim?: boolean;
	disableLocalOptions?: boolean; // Wether to disable or allow local option settings
}

/**
 * The allowed Option keys
 */
export enum EOptionTypes {
	CONVERT = "convert",
	TRIM = "trim",
	SKIP = "skip",
	DISABLE_LOCAL_OPTIONS = "disableLocalOptions",
}
/**
 * When are we skipping the validation of this field
 */
export enum ESkipTypes {
	ALWAYS = "ALWAYS",
	INPUT_ONLY = "INPUT_ONLY",
	OUTPUT_ONLY = "OUTPUT_ONLY",
}

/**
 * The fields the schema and input functions return
 */
export interface IResponse {
	errors: object[];
	data: object;
}

/**
 * Response from the Handle String Function
 */
export interface IHandleStringResponse {
	errors: object[];
	data: string;
}

