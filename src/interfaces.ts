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
 * @property {boolean} convertValues Do we want to attempt to convert the inputs to their desired type?
 * @property {boolean} trimExtraFields Remove any fields that are not defined in the schema?
 * @property {boolean} ignoreRequired Don't throw errors for fields marked as required in the schema but missing
 * @property {boolean} disableLocalOptions Use this option to disable any local options set at the schema level
 */
export interface IGlobalOptions {
	/**
	 * Do we want to attempt to convert the inputs to their desired type?
	 */
	convertValues?: boolean;
	/**
	 * Remove any fields that are not defined in the schema?
	 */
	trimExtraFields?: boolean;
	/**
	 * Don't throw errors for fields marked as required in the schema but missing
	 */
	ignoreRequired?: boolean;
	/**
	 * Use this option to disable any local options set at the schema level
	 */
	disableLocalOptions?: boolean;
	/**
	 * Does the Validator Throw an Error or just return errors
	 */
	throwOnError?: boolean;
}

/**
 * The Options the system supports from the mongoose schema directly
 */
export enum ESupportedMongooseOptions {
	ENUM = "enum",
	MIN_LENGTH = "minLength",
	MAX_LENGTH = "maxLength",
	LOWERCASE = "lowercase",
	UPPERCASE = "uppercase",
	TRIM = "trim",
	MATCH = "match",
	MAX = "max",
	MIN = "min",
	REQUIRED = "required",
	CONVERT = "convert",
	SKIP = "skip",
}

export interface ICombinedOptions extends ISchemaOptions, IGlobalOptions { }

/**
 * The Schema Options that the system can expect to have to handle
 */
export interface IMongooseOptionsResponse extends IInputBaseResponse {
	data: ISchemaOptions;
}

/**
 * The Options that can come out of the schema once it is processed
 */
interface ISchemaOptions {
	required?: {
		value: boolean,
		message?: string,
	};
	enum?: {
		value: string[],
		message?: string,
	};
	minLength?: {
		value: number,
		message?: string,
	};
	maxLength?: {
		value: number,
		message?: string,
	};
	lowercase?: {
		value: boolean,
		message?: string,
	};
	uppercase?: {
		value: boolean,
		message?: string,
	};
	trim?: {
		value: boolean,
		message?: string,
	};
	match?: {
		value: string,
		message?: string,
	};
	max?: {
		value: Date | number,
		message?: string,
	};
	min?: {
		value: Date | number,
		message?: string,
	};
	skip?: {
		value: boolean,
		message?: string,
	};
	convert?: {
		value: boolean,
		message?: string,
	};
}

/**
 * The fields the schema and input functions return
 */
export interface IResponse {
	error: boolean;
	errors: object;
	data: object;
}

/**
 * The Base model for the Process Input Type Responses
 */
interface IInputBaseResponse {
	error: boolean;
	errors: object;
}

/**
 * The response from the global options parser
 */
export interface IGlobalOptionsResponse extends IInputBaseResponse {
	data: IGlobalOptions;
}

/**
 * Response from the Handle String Function
 */
export interface IHandleStringResponse extends IInputBaseResponse {
	data: string;
}

/**
 * Response from the Handle Number Function
 */
export interface IHandleNumberResponse extends IInputBaseResponse {
	data: number;
}

/**
 * Response from the Handle Boolean Function
 */
export interface IHandleBooleanResponse extends IInputBaseResponse {
	data: boolean;
}

/**
 * Response from the Handle Date Function
 */
export interface IHandleDateResponse extends IInputBaseResponse {
	data: Date;
}

/**
 * Response from the Handle MongooseId Function
 */
export interface IHandleMongooseIdResponse extends IInputBaseResponse {
	data: Schema.Types.ObjectId;
}
