import { Schema, Types } from "mongoose";
import BuildValidator from "./index";

describe(`Test Schema Validator`, () => {

	test(`Check that just string into the schema field fails`, async () => {
		try {
			// @ts-ignore
			await BuildValidator(`string`);
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [{ Schema: `The Schema provided is not an object` }],
			});
		}
	});

	test(`Check that just an array into the schema field fails`, async () => {
		try {
			// @ts-ignore
			await BuildValidator([]);
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [{ Schema: `The Schema provided is not an object` }],
			});
		}
	});

	test(`Check that empty object into the schema field fails`, async () => {
		try {
			// @ts-ignore
			await BuildValidator({});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [{ Schema: `The Schema provided is not an object` }],
			});
		}
	});

	test(`Check that just a number into the schema field fails`, async () => {
		try {
			// @ts-ignore
			await BuildValidator(1);
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [{ Schema: `The Schema provided is not an object` }],
			});
		}
	});

	test(`Check that just a boolean into the schema field fails`, async () => {
		try {
			// @ts-ignore
			await BuildValidator(true);
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [{ Schema: `The Schema provided is not an object` }],
			});
		}
	});

	test(`Check that a schema with no type fails`, async () => {
		try {
			// @ts-ignore
			await BuildValidator({
				name: String,
				date: Number,
				month: `Date`,
				flag: Boolean,
				actualDate: Date,
				objectID: Schema.Types.ObjectId,
				object: {
					nested: String,
					flag2: `Date`,
					mixedArray: [],
				},
				allowedArray: [{ type: String }],
				shallowArray: [String],
				invalidShallowArray: [`Strung`],
				toobigArray: [{ oneObj: String }, { twoObj: String }],
				invalidType: { type: `WRONG` },
				allowedType: { type: String },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{ month: `Type Provided "Date" is not an allowed type` },
					{ 'object.flag2': `Type Provided "Date" is not an allowed type` },
					{ invalidShallowArray: `The provided array does not contain deeper object fields or a valid input type` },
					{ toobigArray: `Provided Section has more than one object in the array, this is not valid for a schema` },
					{ 'invalidType.type': `Type Provided "WRONG" is not an allowed type"` },
				],
			});
		}
	});

});

describe(`Test the Options inputs as part of schema`, () => {

	test(`Send in an invalid Key, expect failure`, async () => {
		try {
			await BuildValidator({
				name: { type: String, MSV_Options: { KEY: true } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						'name.MSV_Options': `The provided option "KEY" is not recognised as a valid MSV Option`,
					},
				],
			});
		}
	});

	test(`Send in a valid Key, with an invalid value expect failure`, async () => {
		try {
			await BuildValidator({
				name: { type: String, MSV_Options: { convert: `fail` } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						'name.MSV_Options': `The provided option "convert" should be a boolean value`,
					},
				],
			});
		}
	});

	test(`Send in trim Key, with an invalid value, expect failure`, async () => {
		try {
			await BuildValidator({
				name: { type: String, MSV_Options: { trim: `aaa` } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						'name.MSV_Options': `The provided option "trim" should be a boolean value`,
					},
				],
			});
		}
	});

	test(`Send in skip Key, with an invalid value, expect failure`, async () => {
		try {
			await BuildValidator({
				name: { type: String, MSV_Options: { skip: `true` } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						'name.MSV_Options': `The provided option "skip" should be a boolean value`,
					},
				],
			});
		}
	});

	test(`Send in Schema with required field and Input, expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: String, required: true },
			name2: { type: String },
		});
		expect(await validator({
			name: `A String`,
			name2: `123`,
		}, { ignoreRequired: true })).toEqual({
			name: `A String`,
			name2: `123`,
		});
	});

	test(`Send in Schema with required field but missing in Input, expect Error`, async () => {
		try {
			const validator = await BuildValidator({
				name: { type: String, required: true },
				name2: { type: String },
			});
			await validator({
				name2: `123`,
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input for "name" is required but empty`,
					},
				],
			});
		}
	});

	test(`Send in Schema with required field but missing in Input but ignoring Required option, expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: String, required: true },
			name2: { type: String },
		});
		expect(await validator({
			name2: `123`,
		}, { ignoreRequired: true })).toEqual({
			name2: `123`,
		});
	});

	test(`Send in all keys, with correct values, expect success`, async () => {
		try {
			const validate = await BuildValidator({
				name: {
					type: String, MSV_Options: {
						skip: true,
						convert: true,
						trim: true,
					},
				},
			});
			await validate({ name: `Adam` }, {});
			// throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						Input: `The input provided is not a populated object`,
					},
				],
			});
		}
	});

});

describe(`String Input Testing`, () => {

	test(`Send in string input where string is expected (same layer).  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: String,
		});
		expect(await validator({
			name: `hello`,
		}, {})).toEqual({
			name: `hello`,
		});
	});

	test(`Send in string input where string is expected.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: String },
		});
		expect(await validator({
			name: `hello`,
		}, {})).toEqual({
			name: `hello`,
		});
	});

	test(`Send in convertable to string input where string is expected but convert not flagged.  Expect Failure`, async () => {
		try {
			const validator = await BuildValidator({
				name: { type: String },
			});
			console.log(await validator({
				name: 123,
			}, {}));
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input for "name" is not a string`,
					},
				],
			});
		}
	});

	test(`Send in convertable input where string is expected and convert is flagged globally.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: String },
		});
		expect(await validator({
			name: 123,
		}, { convert: true })).toEqual({
			name: `123`,
		});
	});

	test(`Send in convertable input where string is expected and convert is not flagged globally but is locally.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: String, MSV_Options: { convert: true } },
		});
		expect(await validator({
			name: 123,
		}, {})).toEqual({
			name: `123`,
		});
	});

	test(`Send in convertable input where string is expected and is flagged locally but local is disabled.  Expect Failure`, async () => {
		try {
			const validator = await BuildValidator({
				name: { type: String, MSV_Options: { convert: true } },
			});
			await validator({
				name: 123,
			}, { disableLocalOptions: true });
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input for "name" is not a string`,
					},
				],
			});
		}
	});

	test(`Send in object nested input.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: {
				type: {
					deep: String,
				},
			},
		});
		expect(await validator({ name: { type: { deep: `Hello` } } }, {}))
			.toEqual({ name: { type: { deep: `Hello` } } });
	});

	test(`Send in convertable input where string is expected and is flagged globally and locally but local is disabled.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: String, MSV_Options: { convert: true } },
		});
		expect(await validator({
			name: true,
		}, { disableLocalOptions: true, convert: true })).toEqual({
			name: `true`,
		});
	});

	test(`Send in convertable to string input where string is expected and convert is flagged globally but overridden locally.  Expect Failure`, async () => {
		try {
			const validator = await BuildValidator({
				name: { type: String, MSV_Options: { convert: false } },
			});
			await validator({
				name: true,
			}, { convert: true });
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input for "name" is not a string`,
					},
				],
			});
		}
	});

	test(`Send in input schema with an array but an input with an object where the array is expected.  Expect Failure`, async () => {
		try {
			const validator = await BuildValidator({
				name: [{ type: String }],
			});
			console.log(await validator({
				name: `hello`,
			}));
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `Expecting an Array of entries but did not recieve one`,
					},
				],
			});
		}
	});


	test(`Send in string within minLength and maxLength params.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: String, minLength: 2, maxLength: 10 },
		});
		expect(await validator({
			name: `123`,
		})).toEqual({
			name: `123`,
		});
	});

	test(`Send in string within minLength and maxLength params with convert.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: String, minLength: 2, maxLength: 10 },
		});
		expect(await validator({
			name: 123,
		}, { convert: true })).toEqual({
			name: `123`,
		});
	});

	test(`Send in string shorter than minLength.  Expect Failure`, async () => {
		try {
			const validator = await BuildValidator({
				name: { type: String, minLength: 4, maxLength: 10 },
			});
			await validator({
				name: `hey`,
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input for "name" is shorter than the allowed minimum, "4"`,
					},
				],
			});
		}
	});

	test(`Send in string longer than maxLength.  Expect Failure`, async () => {
		try {
			const validator = await BuildValidator({
				name: { type: String, minLength: 4, maxLength: 10 },
			});
			await validator({
				name: `hey there how's it going?`,
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input for "name" is longer than the allowed maximum, "10"`,
					},
				],
			});
		}
	});

	test(`Send in string within enum params.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: String, enum: [`One`, `Two`, `Three`] },
		});
		expect(await validator({
			name: `One`,
		})).toEqual({
			name: `One`,
		});
	});

	test(`Send in convertable to string within enum params.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: String, enum: [`One`, `Two`, `Three`, `true`] },
		});
		expect(await validator({
			name: true,
		}, { convert: true })).toEqual({
			name: `true`,
		});
	});

	test(`Send in string not in enum.  Expect Failure`, async () => {
		try {
			const validator = await BuildValidator({
				name: { type: String, enum: [`One`, `Two`, `Three`] },
			});
			await validator({
				name: `hey there how's it going?`,
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input for "name" is not one of the designated allowed Enums`,
					},
				],
			});
		}
	});

	test(`Send in trimmable string.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: String, trim: true },
		});
		expect(await validator({
			name: `true `,
		}, { convert: true })).toEqual({
			name: `true`,
		});
	});

});

// Placed After String Testing as it uses string inputs and string validation to complete
describe(`Shallow Array Input Testing`, () => {

	test(`Send in shallow array with correct input.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: [String],
		});
		expect(await validator({
			name: [`true`],
		})).toEqual({
			name: [`true`],
		});
	});

	test(`Send in shallow array with multiple correct inputs.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: [String],
		});
		expect(await validator({
			name: [`true`, `red`, `blue`],
		})).toEqual({
			name: [`true`, `red`, `blue`],
		});
	});

	test(`Send in shallow array with multiple incorrect inputs.  Expect Failure`, async () => {
		try {
			const validator = await BuildValidator({
				name: [String],
			});
			await validator({
				name: [true, false],
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						"name[0]": `The input for \"name[0]\" is not a string`,
					},
					{
						"name[1]": `The input for \"name[1]\" is not a string`,
					},
				],
			});
		}
	});

});

// Placed After String Testing as it uses string inputs and string validation to complete
describe(`Deep Array Input Testing`, () => {

	test(`Send in deep array with correct input.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: [{ type: String }],
		});
		expect(await validator({
			name: [`true`],
		})).toEqual({
			name: [`true`],
		});
	});

	test(`Send in a deeper array with correct input.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: [{ stile: { type: String } }],
		});
		expect(await validator({
			name: [{ stile: `true` }],
		})).toEqual({
			name: [{ stile: `true` }],
		});
	});

	test(`Send in the deepest array with correct input.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: [{
				stile: {
					underneath: {
						deeper: String,
					},
					infront: {
						lotsofDepth: {
							type: String,
						},
					},
				},
			}],
		});
		expect(await validator({
			name: [{
				stile: {
					underneath: {
						deeper: `true`,
					},
					infront: {
						lotsofDepth: 1234,
					},
				},
			}],
		}, { convert: true })).toEqual({
			name: [{
				stile: {
					underneath: {
						deeper: `true`,
					},
					infront: {
						lotsofDepth: `1234`,
					},
				},
			}],
		});
	});

	test(`Send in the deepest array with correct input.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: [{
				stile: {
					underneath: {
						deeper: String,
					},
					infront: {
						lotsofDepth: {
							type: String,
						},
					},
				},
			}],
		});
		expect(await validator({
			name: [{
				stile: {
					underneath: {
						deeper: `true`,
					},
				},
				infront: {
					lotsofDepth: 1234,
				},
			}],
		}, { convert: true, trimExtraFields: true })).toEqual({
			name: [{
				stile: {
					underneath: {
						deeper: `true`,
					},
				},
			}],
		});
	});

	test(`Send in the deepest array with a missing input.  Expect Failure`, async () => {
		const validator = await BuildValidator({
			name: [{
				stile: {
					underneath: {
						deeper: String,
					},
					infront: {
						lotsofDepth: {
							type: String,
							required: true,
						},
					},
				},
			}],
		});
		try {
			await validator({
				name: [{
					stile: {
						underneath: {
							deeper: `true`,
						},
					},
					infront: {
						lotsofDepth: 1234,
					},
				}],
			}, { convert: true });
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [{
					"stile.infront.lotsofDepth": `The input for "lotsofDepth" is required but empty`,
				}],
			});
		}
	});

	test(`Send in the deepest array with missing inputs.  Expect Failure`, async () => {
		const validator = await BuildValidator({
			name: [{
				stile: {
					underneath: {
						deeper: String,
					},
					infront: {
						lotsofDepth: {
							type: String,
							required: true,
						},
					},
				},
			}],
		});
		try {
			await validator({
				name: [
					{
						stile: {
							underneath: {
								deeper: `true`,
							},
						},
						infront: {
							lotsofDepth: 1234,
						},
					},
					{
						stile: {
							underneath: {
								deeper: 1234,
							},
							infront: {
								lotsofDepth: 1234,
							},
						},
					},
					{
						stile: {
							underneath: {
								tried: `troop`,
							},
							infront: {
								lotsofDepth: 1234,
							},
						},
					},
				],
			}, { convert: true });
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						"stile.infront.lotsofDepth": `The input for "lotsofDepth" is required but empty`,
					},
					{
						"stile.underneath.deeper": `The input for "deeper" is marked as required but no value has been provided`,
					}],
			});
		}
	});

});

describe(`Test sending in extra input and ut beinf trimmed or not`, () => {

	test(`Send in Extra input with trim to true.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: [{ stile: { type: String } }],
		});
		expect(await validator({
			name: [{ stile: `true` }],
			extra: `string`,
		}, { trimExtraFields: true })).toEqual({
			name: [{ stile: `true` }],
		});
	});

	test(`Send in Extra input with trim to true.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: [{ stile: { type: String } }],
		});
		expect(await validator({
			name: [{ stile: `true` }, { press: `extra` }],
			extra: `string`,
		}, { trimExtraFields: true })).toEqual({
			name: [{ stile: `true` }],
		});
	});

	test(`Send in Extra input without trim.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: [{ stile: { type: String } }],
		});
		expect(await validator({
			name: [{ stile: `true` }, { press: `extra` }],
			extra: `string`,
		})).toEqual({
			name: [{ stile: `true` }, { press: `extra` }],
			extra: `string`,
		});
	});

	test(`Send in Complex Extra Inputs. expect Success`, async () => {
		const validator = await BuildValidator({
			name: [{ stile: { type: String } }],
			complicated: {
				deep: {
					object: Number,
				},
				witha: [{ finarray: Boolean }],
			},
		});
		expect(await validator({
			name: [{ stile: `true` }, { press: `extra` }],
			extra: `string`,
			complicated: {
				deep: {
					object: 4433,
					andAnExtra: true,
				},
				witha: [{ finarray: true }, { finarray: true }, { somethingElse: true }, { finarray: true }],
			},
		})).toEqual({
			name: [{ stile: `true` }, { press: `extra` }],
			extra: `string`,
			complicated: {
				deep: {
					object: 4433,
					andAnExtra: true,
				},
				witha: [{ finarray: true }, { finarray: true }, { somethingElse: true }, { finarray: true }],
			},
		});
	});

	test(`Send in Complex Extra Inputs with Trim. expect Success`, async () => {
		const validator = await BuildValidator({
			name: [{ stile: { type: String } }],
			complicated: {
				deep: {
					object: Number,
				},
				witha: [{ finarray: Boolean }],
			},
		});
		expect(await validator({
			name: [{ stile: `true` }, { press: `extra` }],
			extra: `string`,
			complicated: {
				deep: {
					object: 4433,
					andAnExtra: true,
				},
				witha: [{ finarray: true }, { finarray: true }, { somethingElse: true }, { finarray: true }],
			},
		}, { trimExtraFields: true })).toEqual({
			name: [{ stile: `true` }],
			complicated: {
				deep: {
					object: 4433,
				},
				witha: [{ finarray: true }, { finarray: true }, { finarray: true }],
			},
		});
	});

});


describe(`Number Input Testing`, () => {

	test(`Send in Number input where Number is expected (same layer).  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: Number,
		});
		expect(await validator({
			name: 321,
		}, {})).toEqual({
			name: 321,
		});
	});

	test(`Send in Number input where Number is expected.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: Number },
		});
		expect(await validator({
			name: 44312,
		}, {})).toEqual({
			name: 44312,
		});
	});

	test(`Send in convertable to Number input where Number is expected but convert not flagged.  Expect Failure`, async () => {
		try {
			const validator = await BuildValidator({
				name: { type: Number },
			});
			console.log(await validator({
				name: `123`,
			}, {}));
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input for "name" is not a number`,
					},
				],
			});
		}
	});

	test(`Send in convertable input where Number is expected and convert is flagged globally.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: Number },
		});
		expect(await validator({
			name: `123`,
		}, { convert: true })).toEqual({
			name: 123,
		});
	});

	test(`Send in convertable input where Number is expected and convert is not flagged globally but is locally.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: Number, MSV_Options: { convert: true } },
		});
		expect(await validator({
			name: `123`,
		}, {})).toEqual({
			name: 123,
		});
	});

	test(`Send in convertable input where Number is expected and is flagged locally but local is disabled.  Expect Failure`, async () => {
		try {
			const validator = await BuildValidator({
				name: { type: Number, MSV_Options: { convert: true } },
			});
			await validator({
				name: `123`,
			}, { disableLocalOptions: true });
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input for "name" is not a number`,
					},
				],
			});
		}
	});

	test(`Send in object nested input.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: {
				type: {
					deep: Number,
				},
			},
		});
		expect(await validator({ name: { type: { deep: 572 } } }, {}))
			.toEqual({ name: { type: { deep: 572 } } });
	});

	test(`Send in convertable input where Number is expected and is flagged globally and locally but local is disabled.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: Number, MSV_Options: { convert: true } },
		});
		expect(await validator({
			name: `57823`,
		}, { disableLocalOptions: true, convert: true })).toEqual({
			name: 57823,
		});
	});

	test(`Send in convertable to Number input where Number is expected and convert is flagged globally but overridden locally.  Expect Failure`, async () => {
		try {
			const validator = await BuildValidator({
				name: { type: Number, MSV_Options: { convert: false } },
			});
			await validator({
				name: true,
			}, { convert: true });
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input for "name" is not a number`,
					},
				],
			});
		}
	});

	test(`Send in correct Number within min and max.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: Number, min: 5, max: 50 },
		});
		expect(await validator({
			name: 10,
		}, { disableLocalOptions: true, convert: true })).toEqual({
			name: 10,
		});
	});

	test(`Send in Number where input is smaller than minimum.  Expect Failure`, async () => {
		try {
			const validator = await BuildValidator({
				name: { type: Number, min: 5, max: 50 },
			});
			await validator({
				name: 2,
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input for "name" is smaller than the minimum "5"`,
					},
				],
			});
		}
	});

	test(`Send in Number where input is larger than maximum.  Expect Failure`, async () => {
		try {
			const validator = await BuildValidator({
				name: { type: Number, min: 5, max: 50 },
			});
			await validator({
				name: 88,
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input for "name" is larger than the maximum "50"`,
					},
				],
			});
		}
	});

});

describe(`Boolean Input Testing`, () => {

	test(`Send in Boolean input where Boolean is expected (same layer).  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: Boolean,
		});
		expect(await validator({
			name: true,
		}, {})).toEqual({
			name: true,
		});
	});

	test(`Send in Boolean input where Boolean is expected.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: Boolean },
		});
		expect(await validator({
			name: false,
		}, {})).toEqual({
			name: false,
		});
	});

	test(`Send in convertable to Boolean input where Boolean is expected but convert not flagged.  Expect Failure`, async () => {
		try {
			const validator = await BuildValidator({
				name: { type: Boolean },
			});
			console.log(await validator({
				name: `123`,
			}, {}));
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input for "name" is not a boolean`,
					},
				],
			});
		}
	});

	test(`Send in convertable input where Boolean is expected and convert is flagged globally.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: Boolean },
		});
		expect(await validator({
			name: `true`,
		}, { convert: true })).toEqual({
			name: true,
		});
	});

	test(`Send in convertable input where Boolean is expected and convert is flagged globally.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: Boolean },
		});
		expect(await validator({
			name: `1`,
		}, { convert: true })).toEqual({
			name: true,
		});
	});

	test(`Send in convertable input where Boolean is expected and convert is flagged globally.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: Boolean },
		});
		expect(await validator({
			name: `yes`,
		}, { convert: true })).toEqual({
			name: true,
		});
	});

	test(`Send in convertable input where Boolean is expected and convert is not flagged globally but is locally.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: Boolean, MSV_Options: { convert: true } },
		});
		expect(await validator({
			name: `true`,
		}, {})).toEqual({
			name: true,
		});
	});

	test(`Send in convertable input where Boolean is expected and convert is flagged globally.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: Boolean },
		});
		expect(await validator({
			name: `false`,
		}, { convert: true })).toEqual({
			name: false,
		});
	});

	test(`Send in convertable input where Boolean is expected and convert is flagged globally.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: Boolean },
		});
		expect(await validator({
			name: `0`,
		}, { convert: true })).toEqual({
			name: false,
		});
	});

	test(`Send in convertable input where Boolean is expected and convert is flagged globally.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: Boolean },
		});
		expect(await validator({
			name: `no`,
		}, { convert: true })).toEqual({
			name: false,
		});
	});

	test(`Send in convertable input where Boolean is expected and convert is not flagged globally but is locally.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: Boolean, MSV_Options: { convert: true } },
		});
		expect(await validator({
			name: `true`,
		}, {})).toEqual({
			name: true,
		});
	});

	test(`Send in convertable input where Boolean is expected and is flagged locally but local is disabled.  Expect Failure`, async () => {
		try {
			const validator = await BuildValidator({
				name: { type: Boolean, MSV_Options: { convert: true } },
			});
			await validator({
				name: `true`,
			}, { disableLocalOptions: true });
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input for "name" is not a boolean`,
					},
				],
			});
		}
	});

});

describe(`Date Input Testing`, () => {

	test(`Send in Date input where Date is expected (same layer).  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: Date,
		});
		const currDate = new Date();
		expect(await validator({
			name: currDate,
		}, {})).toEqual({
			name: currDate,
		});
	});

	test(`Send in Date input where Date is expected.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: Date },
		});
		const currDate = new Date();
		expect(await validator({
			name: currDate,
		}, {})).toEqual({
			name: currDate,
		});
	});

	test(`Send in non-Date input where Date is expected.  Expect Failure`, async () => {
		try {
			const validator = await BuildValidator({
				name: { type: Date },
			});
			await validator({
				name: `hello`,
			}, {});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input for "name" is not a date`,
					},
				],
			});
		}
	});

	test(`Send in convertable to Date input where Date is expected but convert not flagged.  Expect Failure`, async () => {
		try {
			const validator = await BuildValidator({
				name: { type: Date },
			});
			const currDate = new Date();
			await validator({
				name: currDate.toUTCString(),
			}, {});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input for "name" is not a date`,
					},
				],
			});
		}
	});

	test(`Send in convertable input where Date is expected and convert is flagged globally.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: Date },
		});
		const currDate = Date.now();
		expect(await validator({
			name: currDate,
		}, { convert: true })).toEqual({
			name: new Date(currDate),
		});
	});

	test(`Send in convertable input where Date is expected and convert is not flagged globally but is locally.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: Date, MSV_Options: { convert: true } },
		});
		const currDate = Date.now();
		expect(await validator({
			name: currDate,
		}, {})).toEqual({
			name: new Date(currDate),
		});
	});

	test(`Send in Date that is within the min and max.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: Date, min: new Date(`January 2007`), max: new Date(`December 2020`) },
		});
		const currDate = new Date(`Feb 2017`);
		expect(await validator({
			name: currDate,
		})).toEqual({
			name: currDate,
		});
	});

	test(`Send in a Date that is below the Minimum Date.  Expect Failure`, async () => {
		try {
			const validator = await BuildValidator({
				name: { type: Date, min: new Date(`January 2018`), max: new Date(`December 2020`) },
			});
			const currDate = new Date(`Feb 2017`);
			expect(await validator({
				name: currDate,
			}));
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input for "name" is smaller than the minimum "2018-01-01T00:00:00.000Z"`,
					},
				],
			});
		}
	});

	test(`Send in a Date that is above the Maximum Date.  Expect Failure`, async () => {
		try {
			const validator = await BuildValidator({
				name: { type: Date, min: new Date(`January 2018`), max: new Date(`December 2020`) },
			});
			const currDate = new Date(`Feb 2021`);
			expect(await validator({
				name: currDate,
			}));
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input for "name" is larger than the maximum "2020-12-01T00:00:00.000Z"`,
					},
				],
			});
		}
	});

});

describe(`Mongoose Id Input Testing`, () => {

	test(`Send in Mongoose Id input where Mongoose Id is expected (same layer).  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: Schema.Types.ObjectId,
		});
		const objectId = Types.ObjectId();
		expect(await validator({
			name: objectId,
		}, {})).toEqual({
			name: objectId,
		});
	});

	test(`Send in Mongoose Id input where Mongoose Id is expected (same layer).  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: Schema.Types.ObjectId,
		});
		expect(await validator({
			name: `5cf8c9103ab4c607bc830d7a`,
		}, {})).toEqual({
			name: `5cf8c9103ab4c607bc830d7a`,
		});
	});

	test(`Send in Date input where Date is expected.  Expect Success`, async () => {
		const validator = await BuildValidator({
			name: { type: Schema.Types.ObjectId },
		});
		expect(await validator({
			name: `5cf8c9103ab4c607bc830d7a`,
		}, {})).toEqual({
			name: `5cf8c9103ab4c607bc830d7a`,
		});
	});

	test(`Send in non-MongooseId input where MongooseId is expected.  Expect Failure`, async () => {
		try {
			const validator = await BuildValidator({
				name: { type: Schema.Types.ObjectId },
			});
			await validator({
				name: `AAAA`,
			}, {});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input for "name" is not a MongooseId`,
					},
				],
			});
		}
	});

});

// TODO: ADD IN BUFFER, DECIMAL128 and MAP TYPES AND SUPPORT THEM
