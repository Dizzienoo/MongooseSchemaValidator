import * as mongoose from "mongoose";
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
				objectID: mongoose.Schema.Types.ObjectId,
				object: {
					nested: String,
					flag2: `Date`,
					mixedArray: [],
				},
				allowedArray: [{ type: String }],
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
					{ toobigArray: `Provided Section has more than one object in the array, this is not valid for a schema` },
					{ 'invalidType.type': `Type Provided "WRONG" is not an allowed type"` },
				],
			});
		}
	});
});

describe(`Test the Option Input as master option`, () => {
	// test(`Send in an invalid Key, expect failure`, async () => {
	// 	try {
	// 		await ValidateInput({
	// 			name: { type: String },
	// 		}, {}, { skip: true });
	// 		throw Error(`Failed To Recieve Expected Error`);
	// 	}
	// 	catch (err) {
	// 		expect(err).toEqual({
	// 			message: `Schema Unable to be parsed due to errors`,
	// 			errors: [
	// 				{
	// 					Options: `The provided option "skip" is not recognised as a valid MSV Option`,
	// 				},
	// 			],
	// 		});
	// 	}
	// });
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

	// test(`Send in all keys, with correct values, expect success`, async () => {
	// 	try {
	// 		const validate = await BuildValidator({
	// 			name: {
	// 				type: String, MSV_Options: {
	// 					skip: true,
	// 					convert: true,
	// 					trim: true,
	// 				},
	// 			},
	// 		});
	// 		await validate({ name: `Adam` }, {});
	// 		// throw Error(`Failed To Recieve Expected Error`);
	// 	}
	// 	catch (err) {
	// 		expect(err).toEqual({
	// 			message: `The Input Provided has errors`,
	// 			errors: [
	// 				{
	// 					Input: `The input provided is not a populated object`,
	// 				},
	// 			],
	// 		});
	// 	}
	// });

	// TODO: Make sure that schema options override normal options
});

describe(`Input Testing`, () => {

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
						name: `The input name is not a string`,
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
			console.log(await validator({
				name: 123,
			}, { disableLocalOptions: true }));
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input name is not a string`,
					},
				],
			});
		}
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

	// test(`Send in convertable to string input where string is expected and convert is flagged globally but not locally.  Expect Failure`, async () => {
	// 	try {
	// 		const validator = await BuildValidator({
	// 			name: [{ type: String }],
	// 		});
	// 		console.log(await validator({
	// 			name: [`hello`],
	// 		}, {}));
	// 		throw Error(`Failed To Recieve Expected Error`);
	// 	}
	// 	catch (err) {
	// 		expect(err).toEqual({
	// 			message: `Schema Unable to be parsed due to errors`,
	// 			errors: [
	// 				{
	// 					'name.MSV_Options': `The provided option "skip" should be a boolean value`,
	// 				},
	// 			],
	// 		});
	// 	}
	// });


	// test(`Send in input schema with an array but an input with an object where the array is expected.  Expect Failure`, async () => {
	// 	try {
	// 		const validator = await BuildValidator({
	// 			name: [{ type: String }],
	// 		});
	// 		console.log(await validator({
	// 			name: [`hello`],
	// 		}, {}));
	// 		throw Error(`Failed To Recieve Expected Error`);
	// 	}
	// 	catch (err) {
	// 		expect(err).toEqual({
	// 			message: `Schema Unable to be parsed due to errors`,
	// 			errors: [
	// 				{
	// 					'name.MSV_Options': `The provided option "skip" should be a boolean value`,
	// 				},
	// 			],
	// 		});
	// 	}
	// });

	// test(`Send in input schema with an array but an input with an object where the array is expected.  Expect Failure`, async () => {
	// 	try {
	// 		const validator = await BuildValidator({
	// 			name: [{ type: String }],
	// 		});
	// 		console.log(await validator({
	// 			name: { type: String },
	// 		}, {}));
	// 		throw Error(`Failed To Recieve Expected Error`);
	// 	}
	// 	catch (err) {
	// 		expect(err).toEqual({
	// 			message: `The Input Provided has errors`,
	// 			errors: [
	// 				{
	// 					name: `The Input field provided does not match the schema; Schema expecting array at name`,
	// 				},
	// 			],
	// 		});
	// 	}
	// });

});
