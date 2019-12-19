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
	 * Wether the system throws an error when it detects issues with the input or not
	 */
	doNotThrow?: boolean;
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
	MAX = "max",
	MIN = "min",
	REQUIRED = "required",
	CONVERT = "convert",
	SKIP = "skip",
}

/**
 * The Options that are part of the Mongoose Schema already
 */
export interface IMongooseOptions {
	enum?: string[];
	minLength?: number;
	maxLength?: number;
	lowercase?: boolean;
	uppercase?: boolean;
	trim?: boolean;
	max?: Date | number;
	min?: Date | number;
	required?: boolean;
	convert?: boolean;
	skip?: boolean;
}

export interface ICombinedOptions extends ISchemaOptions, IGlobalOptions { }

/**
 * The Schema Options that the system can expect to have to handle
 */
export interface IMongooseOptionsResponse {
	errors: object[];
	data: ISchemaOptions;
}

interface ISchemaOptions {
	required?: {
		value: IMongooseOptions["required"],
		message?: string,
	};
	enum?: {
		value: IMongooseOptions["enum"],
		message?: string,
	};
	minLength?: {
		value: IMongooseOptions["minLength"],
		message?: string,
	};
	maxLength?: {
		value: IMongooseOptions["maxLength"],
		message?: string,
	};
	lowercase?: {
		value: IMongooseOptions["lowercase"],
		message?: string,
	};
	uppercase?: {
		value: IMongooseOptions["uppercase"],
		message?: string,
	};
	trim?: {
		value: IMongooseOptions["trim"],
		message?: string,
	};
	max?: {
		value: IMongooseOptions["max"],
		message?: string,
	};
	min?: {
		value: IMongooseOptions["min"],
		message?: string,
	};
	skip?: {
		value: IMongooseOptions["skip"],
		message?: string,
	};
	convert?: {
		value: IMongooseOptions["convert"],
		message?: string,
	};
}

/**
 * The allowed Option keys
 */
export enum EMSVOptionTypes {
	CONVERT_VALUES = "convertValues",
	SKIP = "skip",
}


/**
 * The fields the schema and input functions return
 */
export interface IResponse {
	errors: object[];
	data: object;
}

/**
 * The response from the global options parser
 */
export interface IGlobalOptionsResponse {
	errors: object[];
	data: IGlobalOptions;
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
