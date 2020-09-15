import { Schema } from "mongoose";
import * as mongoose from "mongoose";
import { buildValidator } from "..";


describe(`Test Schema Validator`, () => {

	test(`Check that just string into the schema field fails`, async () => {
		try {
			// @ts-ignore
			await buildValidator(`string`);
			throw Error(`Failed To Receive Expected Error`);
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
			throw Error(`Failed To Receive Expected Error`);
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
			throw Error(`Failed To Receive Expected Error`);
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
			throw Error(`Failed To Receive Expected Error`);
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
			throw Error(`Failed To Receive Expected Error`);
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
			throw Error(`Failed To Receive Expected Error`);
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
			error: false,
			errors: {},
			data: {
				name: [{ stile: `true` }],
			},
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
			error: false,
			errors: {},
			data: {
				name: [{ stile: `true` }],
			},
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
			error: false,
			errors: {},
			data: {
				name: [{ stile: `true` }, { press: `extra` }],
				extra: `string`,
			},
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
			error: false,
			errors: {},
			data: {
				name: [{ stile: `true` }, { press: `extra` }],
				extra: `string`,
				complicated: {
					deep: {
						object: 4433,
						andAnExtra: true,
					},
					witha: [{ finarray: true }, { finarray: true }, { somethingElse: true }, { finarray: true }],
				},
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
			error: false,
			errors: {},
			data: {
				name: [{ stile: `true` }],
				complicated: {
					deep: {
						object: 4433,
					},
					witha: [{ finarray: true }, { finarray: true }, { finarray: true }],
				},
			},
		});
	});

});

describe('Test the Mixed Input Option', () => {
	
	test('Send in a Mixed Field, expect Success', async () => {
		expect(await buildValidator({
			mixedField: {type: Schema.Types.Mixed}
		})).not.toThrow();
	})
	
	test('Send in an Object Type, expect Success', async () => {
		expect(await buildValidator({
		mixedField: {type: Object}
		})).not.toThrow();
	})

	test('Send in another Mixed Type, expect Success', async () => {
		expect(await buildValidator({
			//@ts-expect-error
		mixedField: {type: mongoose.Mixed}
		})).not.toThrow();
	})

	test('Send in a mixed type as part of a bigger Schema, expect Success', async () => {
		expect(await buildValidator({
			title: { type: String, required: true, minlength: 3, maxlength: 100, text: true },
			stuff: { type: String, maxlength: 1000 },
			another: { type: Schema.Types.ObjectId, ref: `image` },
			startDate: { type: Number, required: true },
			endDate: { type: Number, required: true },
			mixedFD: { type: Schema.Types.Mixed },
		})).not.toThrow();
	})
	
	
})
