const mongoose = require (`mongoose`);
const isNOE = require (`../Utilities/isNOE`);
const inArray = require (`../Utilities/inArray`);

let testobject = {
	name: {type: String, required: true},
	type: {type: String, uppercase: true, required: true},
	key: {type: Number, required: true},
	profiles: {type: mongoose.Schema.Types.ObjectId, ref: `logicProfile`},
	result: {type: mongoose.Schema.Types.ObjectId, ref: `contactCard`},
	shallowarray: [{type: String, required: true}],
	deeparray: [
		{
			username: {type: String, lowercase: true},
			password: {type: String},
			age: {type: Number}
		}
	],
	object: {
		other: {type: Number},
		values: {type: Boolean},
		date: {type: Date}
	}
};

const index = require (`../index`);

describe (`Check the Schema Validator`, () => {
	test(`Check that missing type throws an error`, () => {
		let errored = false;
		let errormessage = ``;
		try {
			index.BuildValidatorSchema({missingtype: {tarp: `isMISSING`}});
		}
		catch (err) {
			errored = true;
			errormessage = err.message;
		}
		expect(errored).toBe(true);
		expect(errormessage).toBe(`Schema has the following errors: {"missingtype":"No Type has been provided"}`);
	});
	
	test(`Check that nested missing types throw an error`, () => {
		let errored1 = false;
		let errormessage1 = ``;
		try {
			index.BuildValidatorSchema({
				goodobject: {
					nested: {
						notypehere: `atall`
					},
					nestedarr: [{stillnoType: `Here`}],
					goodarr: [{type: `One here`}],
					goodtype: {type: String}
				}});
		}
		catch (err) {
			errored1 = true;
			errormessage1 = err.message;
		}
		expect(errored1).toBe(true);
		expect(errormessage1).toBe(`Schema has the following errors: {"goodobject.nested":"No Type has been provided","goodobject.nestedarr.0":"No Type has been provided","goodobject.goodarr.0":"Type provided is Unsupported"}`);
	});

	test(`Check that unsupported types throw Errors`, () => {
		let errored = false;
		let errormessage = ``;
		try {
			index.BuildValidatorSchema({
				missingtype: {
					nested: {
						notypehere: {type: String}
					},
					nestedarr: [{type: `Here`}],
					goodarr: [{type: `One here`}]
				}});
		}
		catch (err) {
			errored = true;
			errormessage = err.message;
		}
		expect(errored).toBe(true);
		expect(errormessage).toBe(`Schema has the following errors: {"missingtype.nestedarr.0":"Type provided is Unsupported","missingtype.goodarr.0":"Type provided is Unsupported"}`);
	});

	test(`Check that a good schema is parsed`, () => {
		let response = index.BuildValidatorSchema(testobject);
		expect(response).toBeInstanceOf(Function);
	});
	
	test(`Check that two Schemas can be combined`, () => {
		let oneschema = {
			name: {type: String}
		};
		let twoschema = {
			age: {type: Number}
		};
		let response = index.BuildValidatorSchema(Object.assign(oneschema, twoschema));
		expect(response).toBeInstanceOf(Function);
	});

	test(`Check that Trim Option works correctly`, () => {
		let schema = index.BuildValidatorSchema(testobject);
		let response = schema({name: `Adam`, type: `This`, key: 123, remove: `Removed`}, {trim: true});
		expect(response).toEqual({name: `Adam`, type: `THIS`, key: 123});
	});
});

/**
 * 	test(`Check that when Enum field is not an Array throws Error`, () => {
		let schema = index.BuildValidatorSchema({name: {type: String, enum: [
			`string1`,
			`string2`,
			`Adam Wallis`
		]}});
		let errored = false;
		let errormessage = ``;
		try {
			schema({name: `aaa`});
		}
		catch (err) {
			errored = true;
			errormessage = err.message;
		}
		expect(errored).toBe(true);
		expect(errormessage).toBe(JSON.stringify({name: `Error, String provided is not in the Enum Array`}));
	});
});
 */

//TODO: ADD IN ABILITY TO PARSE CUSTOM ERROR MESSAGES ON REQUIRED, MIN, MAX LIKE HERE: https://mongoosejs.com/docs/validation.html

///////////////////////
//// String Checks ////
///////////////////////
describe (`Check String inputs`, () => {
	test(`Check that Number fails, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: String}});
		let response = schema({name: 123});
		expect(response).toEqual({
			inputErrors: true, 
			errors: {name: `Error, not a String`}
		});
	});

	test(`Check that Number passes, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: String}});
		let response = schema({name: 123}, {convert: true});
		expect(response).toEqual({name: `123`});
		expect(typeof response.name).toBe(`string`);
	});

	test(`Check that Boolean fails, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: String}});
		let response = schema({name: true});
		expect(response).toEqual({
			inputErrors: true, 
			errors: {name: `Error, not a String`}
		});
	});

	test(`Check that Boolean passes, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: String}});
		let response = schema({name: true}, {convert: true});
		expect(response).toEqual({name: `true`});
		expect(typeof response.name).toBe(`string`);
	});

	test(`Check that Date fails, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: String}});
		let response = schema({name: new Date(`1 January 2001`)});
		expect(response).toEqual({
			inputErrors: true, 
			errors: {name: `Error, not a String`}
		});
	});

	test(`Check that Date passes, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: String}});
		let response = schema({name: new Date(`1 January 2001`)}, {convert: true});
		expect(response).toEqual({name: `Mon Jan 01 2001 00:00:00 GMT+0000 (Greenwich Mean Time)`});
		expect(typeof response.name).toBe(`string`);
	});

	test(`Check that MongooseId fails, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: String}});
		let response = schema({name: mongoose.Types.ObjectId(`5c34e4966b86103a80a71f57`)});
		expect(response).toEqual({
			inputErrors: true, 
			errors: {name: `Error, not a String`}
		});
	});

	test(`Check that MongooseId passes, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: String}});
		let response = schema({name: mongoose.Types.ObjectId(`5c34e4966b86103a80a71f57`)}, {convert: true});
		expect(response).toEqual({name: `5c34e4966b86103a80a71f57`});
		expect(typeof response.name).toBe(`string`);
	});

	test(`Check that String passes, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: String}});
		let response = schema({name: `Adam Wallis`});
		expect(response).toEqual({name: `Adam Wallis`});
		expect(typeof response.name).toBe(`string`);
	});

	test(`Check that String passes, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: String}});
		let response = schema({name: `Adam Wallis`}, {convert: true});
		expect(response).toEqual({name: `Adam Wallis`});
		expect(typeof response.name).toBe(`string`);
	});

	test(`Check that String to Lowercase works`, () => {
		let schema = index.BuildValidatorSchema({name: {type: String, required: true, lowercase: true}});
		let response = schema({name: `Adam Wallis`});
		expect(response).toEqual({name: `adam wallis`});
		expect(typeof response.name).toBe(`string`);
	});

	test(`Check that String to Uppercase works`, () => {
		let schema = index.BuildValidatorSchema({name: {type: String, required: true, uppercase: true}});
		let response = schema({name: `Adam Wallis`});
		expect(response).toEqual({name: `ADAM WALLIS`});
		expect(typeof response.name).toBe(`string`);
	});

	test(`Check that String Min Length detects string that is too short`, () => {
		let schema = index.BuildValidatorSchema({name: {type: String, minlength: 5}});
		let response = schema({name: `aaa`});
		expect(response).toEqual({inputErrors: true, errors: {name: `Error, String provided is shorter than the min length of 5`}});
	});

	test(`Check that String Max Length detects string that is too long`, () => {
		let schema = index.BuildValidatorSchema({name: {type: String, maxlength: 5}});
		let response = schema({name: `aaaaaaaaaa`});
		expect(response).toEqual({inputErrors: true, errors: {name: `Error, String provided is longer than the max length of 5`}});
	});

	test(`Check that String in defined Enum is detected`, () => {
		let schema = index.BuildValidatorSchema({name: {type: String, enum: [
			`string1`,
			`string2`,
			`Adam Wallis`
		]}});
		let response = schema({name: `Adam Wallis`});
		expect(response).toEqual({name: `Adam Wallis`});
		expect(typeof response.name).toBe(`string`);
	});

	test(`Check that String not in Enum throws Error`, () => {
		let schema = index.BuildValidatorSchema({name: {type: String, enum: [
			`string1`,
			`string2`,
			`Adam Wallis`
		]}});
		let response = schema({name: `aaa`});
		expect(response).toEqual({
			inputErrors: true, 
			errors: {name: `Error, String provided is not in the Enum Array`}});
	});

	test(`Check that Match option accepts correct String`, () => {
		let schema = index.BuildValidatorSchema({name: {type: String, match: /\S+@\S+\.\S+/}});
		let response = schema({name: `AdamWallis@Email.com`});
		expect(response).toEqual({name: `AdamWallis@Email.com`});
		expect(typeof response.name).toBe(`string`);
	});

	test(`Check that Match option rejects incorrect String`, () => {
		let schema = index.BuildValidatorSchema({name: {type: String, match: /\S+@\S+\.\S+/}});
		let response = schema({name: `aaa`});
		expect(response).toEqual({
			inputErrors: true, 
			errors: {name: `Error, String provided does not pass Match test`}});
	});
});

// ///////////////////////
// //// Number Checks ////
// ///////////////////////
describe (`Check Number inputs`, () => {
	test(`Check that Number String fails, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Number}});
		let response = schema({name: `123`});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a Number`}});
	});

	test(`Check that Number String passes, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Number}});
		let response = schema({name: `123`}, {convert: true});
		expect(response).toEqual({name: 123});
		expect(typeof response.name).toBe(`number`);
	});

	test(`Check that Normal String fails, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Number}});
		let response = schema({name: `stringy`});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a Number`}});
	});

	test(`Check that Normal String fails, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Number}});
		let response = schema({name: `stringy`}, {convert: true});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a Number`}});
	});

	test(`Check that Boolean fails, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Number}});
		let response = schema({name: true});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a Number`}});
	});

	test(`Check that true Boolean passes, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Number}});
		let response = schema({name: true}, {convert: true});
		expect(response).toEqual({name: 1});
		expect(typeof response.name).toBe(`number`);
	});

	test(`Check that false Boolean passes, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Number}});
		let response = schema({name: false}, {convert: true});
		expect(response).toEqual({name: 0});
		expect(typeof response.name).toBe(`number`);
	});

	test(`Check that Date fails, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Number}});
		let response = schema({name: new Date(`1 January 2001`)});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a Number`}});
	});

	test(`Check that Date passes, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Number}});
		let response = schema({name: new Date(`1 January 2001`)}, {convert: true});
		expect(response).toEqual({name: 978307200000});
		expect(typeof response.name).toBe(`number`);
	});

	test(`Check that MongooseId fails, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Number}});
		let response = schema({name: mongoose.Types.ObjectId(`5c34e4966b86103a80a71f57`)});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a Number`}});
	});

	test(`Check that MongooseId fails, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Number}});
		let response = schema({name: mongoose.Types.ObjectId(`5c34e4966b86103a80a71f57`)}, {convert: true});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a Number`}});
	});

	test(`Check that Number passes, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Number}});
		let response = schema({name: 1235432});
		expect(response).toEqual({name: 1235432});
		expect(typeof response.name).toBe(`number`);
	});

	test(`Check that Number passes, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Number}});
		let response = schema({name: 1235432}, {convert: true});
		expect(response).toEqual({name: 1235432});
		expect(typeof response.name).toBe(`number`);
	});

	test(`Check that Number over min and under max passes`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Number, min: 5, max: 15}});
		let response = schema({name: 10}, {convert: true});
		expect(response).toEqual({name: 10});
		expect(typeof response.name).toBe(`number`);
	});

	test(`Check that Number on min passes`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Number, min: 5, max: 15}});
		let response = schema({name: 5}, {convert: true});
		expect(response).toEqual({name: 5});
		expect(typeof response.name).toBe(`number`);
	});

	test(`Check that Number on max passes`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Number, min: 5, max: 15}});
		let response = schema({name: 15}, {convert: true});
		expect(response).toEqual({name: 15});
		expect(typeof response.name).toBe(`number`);
	});
	
	test(`Check that Number under min fails`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Number, min: 5, max: 15}});
		let response = schema({name: 1}, {convert: true});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, Number is smaller than 5`}});
	});

	test(`Check that Number over max fails`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Number, min: 5, max: 15}});
		let response = schema({name: 16}, {convert: true});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, Number is larger than 15`}});
	});
});


// ////////////////////////
// //// Boolean Checks ////
// ////////////////////////
describe (`Check Boolean inputs`, () => {
	test(`Check that Positive Number fails, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Boolean}});
		let response = schema({name: 1});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a Boolean`}});
	});

	test(`Check that Negative Number fails, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Boolean}});
		let response = schema({name: -1});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a Boolean`}});
	});

	test(`Check that Null Number passes, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Boolean}});
		let response = schema({name: 0}, {convert: true});
		expect(response).toEqual({name: false});
		expect(typeof response.name).toBe(`boolean`);
	});

	test(`Check that Negative Number passes, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Boolean}});
		let response = schema({name: -1}, {convert: true});
		expect(response).toEqual({name: true});
		expect(typeof response.name).toBe(`boolean`);
	});

	test(`Check that Positive Number passes, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Boolean}});
		let response = schema({name: 1}, {convert: true});
		expect(response).toEqual({name: true});
		expect(typeof response.name).toBe(`boolean`);
	});

	test(`Check that Boolean passes, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Boolean}});
		let response = schema({name: true});
		expect(response).toEqual({name: true});
		expect(typeof response.name).toBe(`boolean`);
	});

	test(`Check that Boolean passes, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Boolean}});
		let response = schema({name: true}, {convert: true});
		expect(response).toEqual({name: true});
		expect(typeof response.name).toBe(`boolean`);
	});

	test(`Check that Date fails, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Boolean}});
		let response = schema({name: new Date(`1 January 2001`)});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a Boolean`}});
	});

	test(`Check that Date passes, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Boolean}});
		let response = schema({name: new Date(`1 January 2001`)}, {convert: true});
		expect(response).toEqual({name: true});
		expect(typeof response.name).toBe(`boolean`);
	});

	test(`Check that MongooseId fails, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Boolean}});
		let response = schema({name: mongoose.Types.ObjectId(`5c34e4966b86103a80a71f57`)});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a Boolean`}});
	});

	test(`Check that MongooseId passes, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Boolean}});
		let response = schema({name: mongoose.Types.ObjectId(`5c34e4966b86103a80a71f57`)}, {convert: true});
		expect(response).toEqual({name: true});
		expect(typeof response.name).toBe(`boolean`);
	});
});


// /////////////////////
// //// Date Checks ////
// /////////////////////
describe (`Check Date inputs`, () => {
	test(`Check that Positive Number fails, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Date}});
		let response = schema({name: 1});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a Date`}});
	});

	test(`Check that Negative Number fails, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Date}});
		let response = schema({name: 0});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a Date`}});
	});

	test(`Check that Null Number passes, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Date}});
		let response = schema({name: 0}, {convert: true});
		expect(response).toEqual({name: new Date(`1970-01-01T00:00:00.000Z`)});
		expect(response.name instanceof Date).toBe(true);
	});

	test(`Check that Negative Number fails, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Date}});
		let response = schema({name: -1}, {convert: true});
		expect(response).toEqual({name: new Date(`1969-12-31T23:59:59.999Z`)});
		expect(response.name instanceof Date).toBe(true);
	});

	test(`Check that Positive Number passes, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Date}});
		let response = schema({name: 1}, {convert: true});
		expect(response).toEqual({name: new Date(`1970-01-01T00:00:00.001Z`)});
		expect(response.name instanceof Date).toBe(true);
	});

	test(`Check that Date passes, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Date}});
		let response = schema({name: new Date(`1 January 2001`)});
		expect(response).toEqual({name: new Date(`2001-01-01T00:00:00.000Z`)});
		expect(response.name instanceof Date).toBe(true);
	});

	test(`Check that Date passes, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Date}});
		let response = schema({name: new Date(`1 January 2001`)}, {convert: true});
		expect(response).toEqual({name: new Date(`2001-01-01T00:00:00.000Z`)});
		expect(response.name instanceof Date).toBe(true);
	});

	test(`Check that MongooseId fails, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Date}});
		let response = schema({name: mongoose.Types.ObjectId(`5c34e4966b86103a80a71f57`)});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a Date`}});
	});

	test(`Check that MongooseId fails, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Date}});
		let response = schema({name: mongoose.Types.ObjectId(`5c34e4966b86103a80a71f57`)}, {convert: true});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a Date`}});
	});

	test(`Check that Boolean fails, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Date}});
		let response = schema({name: true});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a Date`}});
	});

	test(`Check that false Boolean passes, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Date}});
		let response = schema({name: false}, {convert: true});
		expect(response).toEqual({name: new Date(`1970-01-01T00:00:00.000Z`)});
		expect(response.name instanceof Date).toBe(true);
	});

	test(`Check that true Boolean passes, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Date}});
		let response = schema({name: true}, {convert: true});
		expect(response).toEqual({name: new Date(`1970-01-01T00:00:00.001Z`)});
		expect(response.name instanceof Date).toBe(true);
	});

	test(`Check that Non-Date String fails, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Date}});
		let response = schema({name: true});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a Date`}});
	});

	test(`Check that Non-Date String fails, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Date}});
		let response = schema({name: `justastring`});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a Date`}});
	});

	test(`Check that Non-Date String fails, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Date}});
		let response = schema({name: `justastring`}, {convert: true});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a Date`}});
	});

	test(`Check that Date String fails, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: Date}});
		let response = schema({name: `1 January 1970`});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a Date`}});
	});
});

// ///////////////////////////
// //// MongooseID Checks ////
// ///////////////////////////
describe (`Check MongooseId inputs`, () => {
	test(`Check that MongooseID passes, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: mongoose.Schema.Types.ObjectId}});
		let response = schema({name: mongoose.Types.ObjectId(`5c35d8fea51e244198dca2a0`)});
		expect(response).toEqual({name: mongoose.Types.ObjectId(`5c35d8fea51e244198dca2a0`)});
		expect(typeof response.name).toBe(`object`);
	});

	test(`Check that MongooseID passes, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: mongoose.Schema.Types.ObjectId}});
		let response = schema({name: mongoose.Types.ObjectId(`5c35d8fea51e244198dca2a0`)}, {convert: true});
		expect(response).toEqual({name: mongoose.Types.ObjectId(`5c35d8fea51e244198dca2a0`)});
		expect(typeof response.name).toBe(`object`);
	});

	test(`Check that Boolean fails, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: mongoose.Schema.Types.ObjectId}});
		let response = schema({name: true});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a MongooseId`}});
	});

	test(`Check that Boolean fails, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: mongoose.Schema.Types.ObjectId}});
		let response = schema({name: true}, {convert: true});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a MongooseId`}});
	});

	test(`Check that Date fails, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: mongoose.Schema.Types.ObjectId}});
		let response = schema({name: new Date(`1 January 2001`)});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a MongooseId`}});
	});

	test(`Check that Date fails, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: mongoose.Schema.Types.ObjectId}});
		let response = schema({name: new Date(`1 January 2001`)}, {convert: true});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a MongooseId`}});
	});

	test(`Check that MongooseId String fails, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: mongoose.Schema.Types.ObjectId}});
		let response = schema({name: `5c34e4966b86103a80a71f57`});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a MongooseId`}});
	});

	test(`Check that MongooseId String passes, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: mongoose.Schema.Types.ObjectId}});
		let response = schema({name: `5c34e4966b86103a80a71f57`}, {convert: true});
		expect(response).toEqual({name: mongoose.Types.ObjectId(`5c34e4966b86103a80a71f57`)});
		expect(typeof response.name).toBe(`object`);
	});

	test(`Check that Non-ID String fails, no conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: mongoose.Schema.Types.ObjectId}});
		let response = schema({name: `astring`});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a MongooseId`}});
	});

	test(`Check that Non-ID String fails, conversion`, () => {
		let schema = index.BuildValidatorSchema({name: {type: mongoose.Schema.Types.ObjectId}});
		let response = schema({name: `astring`}, {convert: true});
		expect(response).toEqual({inputErrors: true, errors:{name: `Error, not a MongooseId`}});
	});
});

// ///////////////////////
// //// Complete Test ////
// ///////////////////////
describe(`Put all this together into A Full Schema Check`, () => {
	test(`Test a Creation of a Full Validated Schema that will Pass`, () => {
		let schema = index.BuildValidatorSchema(testobject);
		let response = schema({
			name: `Adam Wallis`,
			type: `Atesttype`,
			key: 55328,
			profiles: mongoose.Types.ObjectId(`5c35d8fea51e244198dca2a0`),
			result: mongoose.Types.ObjectId(`5c35d8fea51e244198dca2a1`),
			shallowarray: [`One String`, `123`],
			deeparray: [
				{
					username: `adam`,
					password: `TESTPASS`,
					age: 300
				}
			],
			object: {
				values: true,
				date: new Date(122231222)
			}
		});
		expect(response).toEqual({ 
			name: `Adam Wallis`,
			type: `ATESTTYPE`,
			key: 55328,
			profiles: mongoose.Types.ObjectId(`5c35d8fea51e244198dca2a0`),
			result: mongoose.Types.ObjectId(`5c35d8fea51e244198dca2a1`),
			shallowarray: [ `One String`, `123` ],
			deeparray: [ { username: `adam`, password: `TESTPASS`, age: 300 } ],
			object: { values: true, date: new Date(`1970-01-02T09:57:11.222Z`)} 
		});
	});
});