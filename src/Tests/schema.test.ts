import { Schema } from "mongoose";
import { buildValidator } from "..";


describe(`Test Schema Validator`, () => {

	test(`Check that just string into the schema field fails`, async () => {
		try {
			// @ts-ignore
			await buildValidator(`string`);
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: { Schema: `The Schema provided is not an object` },
			});
		}
	});

	test(`Check that just an array into the schema field fails`, async () => {
		try {
			// @ts-ignore
			await buildValidator([]);
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: { Schema: `The Schema provided is not an object` },
			});
		}
	});

	test(`Check that empty object into the schema field fails`, async () => {
		try {
			// @ts-ignore
			await buildValidator({});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: { Schema: `The Schema provided is not an object` },
			});
		}
	});

	test(`Check that just a number into the schema field fails`, async () => {
		try {
			// @ts-ignore
			await buildValidator(1);
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: { Schema: `The Schema provided is not an object` },
			});
		}
	});

	test(`Check that just a boolean into the schema field fails`, async () => {
		try {
			// @ts-ignore
			await buildValidator(true);
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: { Schema: `The Schema provided is not an object` },
			});
		}
	});

	test(`Check that a schema with no type fails`, async () => {
		try {
			// @ts-ignore
			await buildValidator({
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
				errors: {
					month: `Type Provided "Date" is not an allowed type`,
					object: { flag2: `Type Provided "Date" is not an allowed type` },
					invalidShallowArray: `The provided array does not contain deeper object fields or a valid input type`,
					toobigArray: `Provided Section has more than one object in the array, this is not valid for a schema`,
					invalidType: { type: `Type Provided "WRONG" is not an allowed type"` },
				},
			});
		}
	});

});

describe(`Test the do not throw option`, () => {

	test(`Send in input that should Error but with doNotThrow Option. Expect Success`, async () => {
		const validate = await buildValidator({
			input: String,
		});
		expect(await validate({
			input: true,
		}, { throwOnError: false })).toEqual({
			data: {},
			error: true,
			errors: { input: `The input for "input" is not a string` },
		});
	});

	test(`Send in input that shouldn't Error but with doNotThrow Option. Expect Success`, async () => {
		const validate = await buildValidator({
			input: String,
		});
		expect(await validate({
			input: `true`,
		}, { throwOnError: false })).toEqual({
			error: false,
			data: { input: `true` },
			errors: {},
		});
	});
});

describe(`Test sending in extra input and it being trimmed or not`, () => {

	test(`Send in Extra input with trim to true.  Expect Success`, async () => {
		const validator = await buildValidator({
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
		const validator = await buildValidator({
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
		const validator = await buildValidator({
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
		const validator = await buildValidator({
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
		const validator = await buildValidator({
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
