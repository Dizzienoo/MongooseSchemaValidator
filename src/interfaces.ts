import { Schema } from "mongoose";

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
 * The global options that can be set with each Validate call
 * @property {boolean} convert Do we want to attempt to convert the inputs to their desired type?
 * @property {boolean} trimExtraFields Remove any fields that are not defined in the schema?
 * @property {boolean} ignoreRequired Don't throw errors for fields marked as required in the schema but missing
 * @property {boolean} disableLocalOptions Use this option to disable any local options set at the schema level
 */
export interface IOptionObject {
	/**
	 * Do we want to attempt to convert the inputs to their desired type?
	 */
	convert?: boolean; // This could be local or global
	/**
	 * Remove any fields that are not defined in the schema?
	 */
	trimExtraFields?: boolean; // This would be a global option only
	/**
	 * Don't throw errors for fields marked as required in the schema but missing
	 */
	ignoreRequired?: boolean; // This would be a global option only
	/**
	 * Use this option to disable any local options set at the schema level
	 */
	disableLocalOptions?: boolean; // Wether to disable or allow local option settings
}

export interface IInternalOptions extends IOptionObject {
	enum?: string[];
	minLength?: number;
	maxLength?: number;
	lowercase?: boolean;
	uppercase?: boolean;
	trim?: boolean;
	max?: Date | number;
	min?: Date | number;
	required?: boolean;
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

/**
 * Response from the Handle Number Function
 */
export interface IHandleNumberResponse {
	errors: object[];
	data: number;
}

/**
 * Response from the Handle Boolean Function
 */
export interface IHandleBooleanResponse {
	errors: object[];
	data: boolean;
}

/**
 * Response from the Handle Date Function
 */
export interface IHandleDateResponse {
	errors: object[];
	data: Date;
}

/**
 * Response from the Handle MongooseId Function
 */
export interface IHandleMongooseIdResponse {
	errors: object[];
	data: Schema.Types.ObjectId;
}

/**
 * The potential responses from parsing all available incoming local options
 */
export interface ILocalOptionsResponse {
	convert?: boolean;
	enum?: string[];
	minLength?: number;
	maxLength?: number;
	lowercase?: boolean;
	uppercase?: boolean;
	trim?: boolean;
	max?: Date | number;
	min?: Date | number;
	required?: boolean;
}

export interface IPotentialLocalOptions {
	MSV_Options?: {
		convert?: boolean;
	};
	enum?: string[];
	minLength?: number;
	maxLength?: number;
	lowercase?: boolean;
	uppercase?: boolean;
	trim?: boolean;
	max?: Date | number;
	min?: Date | number;
	required?: boolean;
}
