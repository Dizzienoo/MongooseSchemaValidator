const CheckSchema = require (`./checkSchema`);
const CheckMongoose = require (`./Checkers/isMongoose`);
const CheckDate = require (`./Checkers/isDate`);
const CheckString = require (`./Checkers/isString`);
const CheckNumber = require (`./Checkers/isNumber`);
const CheckBoolean = require (`./Checkers/isBoolean`);

const mongoose = require (`mongoose`);
const isNOE = require (`./Utilities/isNOE`);
const inArray = require (`./Utilities/inArray`);

module.exports.BuildValidatorSchema = function (schema) {
	try {
		CheckSchema(schema);
		return (input, options) => {
			return validate(schema, input, options);
		};
	}
	catch (err) {
		throw err;
	}
};

const validate = function (schema, input, options, errors) {
	try {
		if (isNOE(schema)) {throw Error(`No Schema Defined`);}
		if (isNOE(input)) {throw Error(`No Input Defined`);}
		if (isNOE(options)) {options = {};}
		if (isNOE(errors)) {errors = {};}
		let keys = Object.keys(schema);
		let response = {};
		keys.map(key => {
			let convert = (options.convert)? true: false;
			if (!isNOE(input[key]) && !isNOE(schema[key])) {
				const {type} = schema[key];
				switch (type) {
				case String:
					let stringreply = CheckString(input[key], convert, schema[key].uppercase, schema[key].lowercase, schema[key].minlength, schema[key].maxlength, schema[key].enum, schema[key].match, schema[key].message);
					if (!isNOE(stringreply.error)) {errors[key]= stringreply.error;}
					// if (!isNOE(stringreply.error)) {throw Error(JSON.stringify({[key]:stringreply.error}));}
					response[key] = stringreply.input;
					break;
				case Number:
					let numberreply = CheckNumber(input[key], convert, schema[key].min, schema[key].max, schema[key].message);
					if (!isNOE(numberreply.error)) {errors[key] =numberreply.error;}
					response[key] = numberreply.input;
					break;
				case Boolean:
					let booleanreply = CheckBoolean(input[key], convert, schema[key].min, schema[key].max, schema[key].message);
					if (!isNOE(booleanreply.error)) {errors[key] = booleanreply.error;}
					response[key] = booleanreply.input;
					break;
				case Date:
					let datereply = CheckDate(input[key], convert, schema[key].message);
					if (!isNOE(datereply.error)) {errors[key] = datereply.error;}
					response[key] = datereply.input;
					break;
				case mongoose.Schema.Types.ObjectId:
					let mongoosereply = CheckMongoose(input[key], convert, schema[key].message);
					if (!isNOE(mongoosereply.error)) {errors[key] = mongoosereply.error;}
					response[key] = mongoosereply.input;
					break;
				case undefined:
					if (Array.isArray(schema[key])) {
						//Would need to figure out if the object was just an array 
						let replies = [];
						let errorReplies = [];
						if (DeepArray(schema[key][0])) {
							//Then we want to run through the Object as normal
							let count;
							input[key].map((entry, i) => {
								count = i;
								let validateResponse = validate(schema[key][0], entry, options);
								if (!isNOE(validateResponse.errors)) {
									errorReplies[i] = validateResponse.errors;
								}
								else {
									replies[i] = validateResponse;
								}
							});
						}
						else {
							//Then we want to send in a "fake" schema object that will give a Key to the Schema type
							input[key].map((entry, i) => {
								let fake = {[i]: schema[key][0]};
								let faked = validate(fake, {[i]: entry}, options);
								if (!isNOE(faked.errors)) {
									errorReplies[i] = faked.errors;
								}
								else {
									replies[i] = faked[i];
								}
							});
						}
						if (!isNOE(errorReplies)) {
							for (i = 0; i < errorReplies.length; i++) {
								if (isNOE(errorReplies[i])){
									errorReplies[i] = {};
								}
							}
							errors[key] = errorReplies;
						}
						response[key] = replies;
					}
					else if (!isNOE(schema[key])) {
						let reply = validate(schema[key], input[key], options);
						response[key] = reply;
					}
					break;
				default: 
					throw Error(`This Type (${type}) is Unsupported`);
				}
			}
			else if (!options.trim && !isNOE(input[key])) {
				response[key] = input[key];
			}
			if (!isNOE(schema[key]) && schema[key].required && isNOE(response[key])) {
				response[key]= schema[key].errmessage || `${key} is required`;
			}
		});
		if (!isNOE(errors)) {
			return {
				inputErrors: true,
				errors
			};
		}
		return response;
	}
	catch (err) {
		throw err;
	}
};

//Takes in the array obejct from the schema and determines if the Array is looking for a block of objects or if the array is an array of types
const DeepArray = function (schemaArray) {
	try {
		let keys = Object.keys(schemaArray);
		if (inArray(`type`, keys) && inArray(schemaArray.type, [
			String,
			Boolean,
			mongoose.Schema.Types.ObjectId,
			Number,
			Date
		])) {
			return false;
		}
		return true;
	}
	catch (err) {
		throw err;
	}
};


//TODO: BUILD MERGE SCHEMA FUNCTION THAT REMOVES DUPLICATES