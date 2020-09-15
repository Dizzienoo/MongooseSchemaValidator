import { Schema, Types } from "mongoose";
import { buildValidator } from "..";

describe(`String Input Testing`, () => {

	test(`Send in string input where string is expected (same layer).  Expect Success`, async () => {
		const validator = await buildValidator({
			name: String,
		});
		expect(await validator({
			name: `hello`,
		}, {})).toEqual({
			error: false,
			errors: {},
			data: {
				name: `hello`,
			},
		});
	});

	test(`Send in string input where string is expected.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String },
		});
		expect(await validator({
			name: `hello`,
		}, {})).toEqual({
			error: false,
			errors: {},
			data: {
				name: `hello`,
			},
		});
	});

	test(`Send in convertible to string input where string is expected but convert not flagged.  Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: String },
			});
			await validator({
				name: 123,
			}, {});
			throw Error(`Failed To Receive Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors:
				{
					name: `The input for "name" is not a string`,
				},
			});
		}
	});

	test(`Send in convertible input where string is expected and convert is flagged globally.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String },
		});
		expect(await validator({
			name: 123,
		}, { convertValues: true })).toEqual({
			error: false,
			errors: {},
			data: {
				name: `123`,
			},
		});
	});

	test(`Send in convertible input where string is expected and convert is not flagged globally but is locally.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, convert: true },
		});
		expect(await validator({
			name: 123,
		}, {})).toEqual({
			error: false,
			errors: {},
			data: {
				name: `123`,
			},
		});
	});

	test(`Send in convertible input where string is expected and is flagged locally but local is disabled.  Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: String, convert: true },
			});
			await validator({
				name: 123,
			}, { disableLocalOptions: true });
			throw Error(`Failed To Receive Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors:
				{
					name: `The input for "name" is not a string`,
				},
			});
		}
	});

	test(`Send in object nested input.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: {
				type: {
					deep: String,
				},
			},
		});
		expect(await validator({ name: { type: { deep: `Hello` } } }, {}))
			.toEqual({
				error: false,
				errors: {},
				data: {
					name: { type: { deep: `Hello` } },
				},
			});
	});

	test(`Send in convertible input where string is expected and is flagged globally and locally but local is disabled.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, convert: true },
		});
		expect(await validator({
			name: true,
		}, { disableLocalOptions: true, convertValues: true })).toEqual({
			error: false,
			errors: {},
			data: {
				name: `true`,
			},
		});
	});

	test(`Send in convertible to string input where string is expected and convert is disabled locally but overridden globally.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, convert: false },
		});
		expect(await validator({
			name: true,
		}, { convertValues: true })).toEqual({
			error: false,
			errors: {},
			data: {
				name: `true`,
			},
		});
	});

	test(`Send in input schema with an array but an input with an object where the array is expected.  Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: [{ type: String }],
			});
			await validator({
				name: `hello`,
			});
			throw Error(`Failed To Receive Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors:
				{
					name: `Expecting an Array of entries but did not receive one`,
				},
			});
		}
	});


	test(`Send in string within minLength and maxLength params.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, minLength: 2, maxLength: 10 },
		});
		expect(await validator({
			name: `123`,
		})).toEqual({
			error: false,
			errors: {},
			data: {
				name: `123`,
			},
		});
	});

	test(`Send in string within minLength and maxLength params with convert.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, minLength: 2, maxLength: 10 },
		});
		expect(await validator({
			name: 123,
		}, { convertValues: true })).toEqual({
			error: false,
			errors: {},
			data: {
				name: `123`,
			},
		});
	});

	test(`Send in string shorter than minLength.  Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: String, minLength: 4, maxLength: 10 },
			});
			await validator({
				name: `hey`,
			});
			throw Error(`Failed To Receive Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors:
				{
					name: `The input for "name" is shorter than the allowed minimum, "4"`,
				},
			});
		}
	});

	test(`Send in string longer than maxLength.  Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: String, minLength: 4, maxLength: 10 },
			});
			await validator({
				name: `hey there how's it going?`,
			});
			throw Error(`Failed To Receive Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors:
				{
					name: `The input for "name" is longer than the allowed maximum, "10"`,
				},
			});
		}
	});

	test(`Send in string within enum params.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, enum: [`One`, `Two`, `Three`] },
		});
		expect(await validator({
			name: `One`,
		})).toEqual({
			error: false,
			errors: {},
			data: {
				name: `One`,
			},
		});
	});

	test(`Send in convertible to string within enum params.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, enum: [`One`, `Two`, `Three`, `true`] },
		});
		expect(await validator({
			name: true,
		}, { convertValues: true })).toEqual({
			error: false,
			errors: {},
			data: {
				name: `true`,
			},
		});
	});

	test(`Send in string not in enum.  Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: String, enum: [`One`, `Two`, `Three`] },
			});
			await validator({
				name: `hey there how's it going?`,
			});
			throw Error(`Failed To Receive Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors:
				{
					name: `The input for "name" is not one of the designated allowed Enums`,
				},
			});
		}
	});

	test(`Send in trimmable string.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, trim: true },
		});
		expect(await validator({
			name: `true `,
		}, { convertValues: true })).toEqual({
			error: false,
			errors: {},
			data: {
				name: `true`,
			},
		});
	});

});

// Placed After String Testing as it uses string inputs and string validation to complete
describe(`Shallow Array Input Testing`, () => {

	test(`Send in shallow array with correct input.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: [String],
		});
		expect(await validator({
			name: [`true`],
		})).toEqual({
			error: false,
			errors: {},
			data: {
				name: [`true`],
			},
		});
	});

	test(`Send in shallow array with multiple correct inputs.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: [String],
		});
		expect(await validator({
			name: [`true`, `red`, `blue`],
		})).toEqual({
			error: false,
			errors: {},
			data: {
				name: [`true`, `red`, `blue`],
			},
		});
	});

	test(`Send in shallow array with multiple incorrect inputs.  Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: [String],
			});
			await validator({
				name: [true, false],
			});
			throw Error(`Failed To Receive Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: {
					name: [
						{ 0: `The input for \"name\" is not a string` },
						{ 1: `The input for \"name\" is not a string` },
					],
				},
			});
		}
	});

	test(`Send in shallow array with multiple incorrect inputs.  Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: [String],
			});
			await validator({
				name: [`true`, false],
			});
			throw Error(`Failed To Receive Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: {
					name: [
						{ 1: `The input for \"name\" is not a string` },
					],
				},
			});
		}
	});

});

// Placed After String Testing as it uses string inputs and string validation to complete
describe(`Deep Array Input Testing`, () => {

	test(`Send in deep array with correct input.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: [{ type: String }],
		});
		expect(await validator({
			name: [`true`],
		})).toEqual({
			error: false,
			errors: {},
			data: {
				name: [`true`],
			},
		});
	});

	test(`Send in a deeper array with correct input.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: [{ stile: { type: String } }],
		});
		expect(await validator({
			name: [{ stile: `true` }],
		})).toEqual({
			error: false,
			errors: {},
			data: {
				name: [{ stile: `true` }],
			},
		});
	});

	test(`Send in the deepest array with correct input.  Expect Success`, async () => {
		const validator = await buildValidator({
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
		}, { convertValues: true })).toEqual({
			error: false,
			errors: {},
			data: {
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
			},
		});
	});

	test(`Send in the deepest array with correct input.  Expect Success`, async () => {
		const validator = await buildValidator({
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
		}, { convertValues: true, trimExtraFields: true })).toEqual({
			error: false,
			errors: {},
			data: {
				name: [{
					stile: {
						underneath: {
							deeper: `true`,
						},
					},
				}],
			},
		});
	});

	test(`Send in the deepest array with a missing input.  Expect Failure`, async () => {
		const validator = await buildValidator({
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
			}, { convertValues: true });
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: {
					name: [
						{ stile: { infront: { lotsofDepth: `The input for "lotsofDepth" is required but empty` } } },
					],
				},
			});
		}
	});

	test(`Send in the deepest array with missing inputs.  Expect Failure`, async () => {
		const validator = await buildValidator({
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
			}, { convertValues: true });
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: {
					stile: {
						infront: { lotsofDepth: `The input for "lotsofDepth" is required but empty` },
						underneath: { deeper: `The input for "deeper" is marked as required but no value has been provided` },
					},
				},
			});
		}
	});

});

describe(`Number Input Testing`, () => {

	test(`Send in Number input where Number is expected (same layer).  Expect Success`, async () => {
		const validator = await buildValidator({
			name: Number,
		});
		expect(await validator({
			name: 321,
		}, {})).toEqual({
			error: false,
			errors: {},
			data: {
				name: 321,
			},
		});
	});

	test(`Send in Number input where Number is expected.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Number },
		});
		expect(await validator({
			name: 44312,
		}, {})).toEqual({
			error: false,
			errors: {},
			data: {
				name: 44312,
			},
		});
	});

	test(`Send in convertible to Number input where Number is expected but convert not flagged.  Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: Number },
			});
			await validator({
				name: `123`,
			}, {});
			throw Error(`Failed To Receive Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors:
				{
					name: `The input for "name" is not a number`,
				},
			});
		}
	});

	test(`Send in convertible input where Number is expected and convert is flagged globally.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Number },
		});
		expect(await validator({
			name: `123`,
		}, { convertValues: true })).toEqual({
			error: false,
			errors: {},
			data: {
				name: 123,
			},
		});
	});

	test(`Send in convertible input where Number is expected and convert is not flagged globally but is locally.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Number, convert: true },
		});
		expect(await validator({
			name: `123`,
		}, {})).toEqual({
			error: false,
			errors: {},
			data: {
				name: 123,
			},
		});
	});

	test(`Send in convertible input where Number is expected and is flagged locally but local is disabled.  Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: Number, convert: true },
			});
			await validator({
				name: `123`,
			}, { disableLocalOptions: true });
			throw Error(`Failed To Receive Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors:
				{
					name: `The input for "name" is not a number`,
				},
			});
		}
	});

	test(`Send in object nested input.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: {
				type: {
					deep: Number,
				},
			},
		});
		expect(await validator({ name: { type: { deep: 572 } } }, {}))
			.toEqual({
				error: false,
				errors: {},
				data: {
					name: { type: { deep: 572 } },
				},
			});
	});

	test(`Send in convertible input where Number is expected and is flagged globally and locally but local is disabled.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Number, convert: true },
		});
		expect(await validator({
			name: `57823`,
		}, { disableLocalOptions: true, convertValues: true })).toEqual({
			error: false,
			errors: {},
			data: {
				name: 57823,
			},
		});
	});

	test(`Send in convertible to Number input where Number is expected and convert is flagged locally but overridden globally.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Number, convert: false },
		});
		expect(await validator({
			name: `57823`,
		}, { disableLocalOptions: true, convertValues: true })).toEqual({
			error: false,
			errors: {},
			data: {
				name: 57823,
			},
		});
	});

	test(`Send in correct Number within min and max.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Number, min: 5, max: 50 },
		});
		expect(await validator({
			name: 10,
		}, { disableLocalOptions: true, convertValues: true })).toEqual({
			error: false,
			errors: {},
			data: {
				name: 10,
			},
		});
	});

	test(`Send in Number where input is smaller than minimum.  Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: Number, min: 5, max: 50 },
			});
			await validator({
				name: 2,
			});
			throw Error(`Failed To Receive Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors:
				{
					name: `The input for "name" is smaller than the minimum "5"`,
				},
			});
		}
	});

	test(`Send in Number where input is larger than maximum.  Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: Number, min: 5, max: 50 },
			});
			await validator({
				name: 88,
			});
			throw Error(`Failed To Receive Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors:
				{
					name: `The input for "name" is larger than the maximum "50"`,
				},
			});
		}
	});

});

describe(`Boolean Input Testing`, () => {

	test(`Send in Boolean input where Boolean is expected (same layer).  Expect Success`, async () => {
		const validator = await buildValidator({
			name: Boolean,
		});
		expect(await validator({
			name: true,
		}, {})).toEqual({
			error: false,
			errors: {},
			data: {
				name: true,
			},
		});
	});

	test(`Send in Boolean input where Boolean is expected.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Boolean },
		});
		expect(await validator({
			name: false,
		}, {})).toEqual({
			error: false,
			errors: {},
			data: {
				name: false,
			},
		});
	});

	test(`Send in convertible to Boolean input where Boolean is expected but convert not flagged.  Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: Boolean },
			});
			await validator({
				name: `123`,
			}, {});
			throw Error(`Failed To Receive Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors:
				{
					name: `The input for "name" is not a boolean`,
				},
			});
		}
	});

	test(`Send in convertible input where Boolean is expected and convert is flagged globally.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Boolean },
		});
		expect(await validator({
			name: `true`,
		}, { convertValues: true })).toEqual({
			error: false,
			errors: {},
			data: {
				name: true,
			},
		});
	});

	test(`Send in convertible input where Boolean is expected and convert is flagged globally.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Boolean },
		});
		expect(await validator({
			name: `1`,
		}, { convertValues: true })).toEqual({
			error: false,
			errors: {},
			data: {
				name: true,
			},
		});
	});

	test(`Send in convertible input where Boolean is expected and convert is flagged globally.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Boolean },
		});
		expect(await validator({
			name: `yes`,
		}, { convertValues: true })).toEqual({
			error: false,
			errors: {},
			data: {
				name: true,
			},
		});
	});

	test(`Send in convertible input where Boolean is expected and convert is not flagged globally but is locally.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Boolean, convert: true },
		});
		expect(await validator({
			name: `true`,
		}, {})).toEqual({
			error: false,
			errors: {},
			data: {
				name: true,
			},
		});
	});

	test(`Send in convertible input where Boolean is expected and convert is flagged globally.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Boolean },
		});
		expect(await validator({
			name: `false`,
		}, { convertValues: true })).toEqual({
			error: false,
			errors: {},
			data: {
				name: false,
			},
		});
	});

	test(`Send in convertible input where Boolean is expected and convert is flagged globally.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Boolean },
		});
		expect(await validator({
			name: `0`,
		}, { convertValues: true })).toEqual({
			error: false,
			errors: {},
			data: {
				name: false,
			},
		});
	});

	test(`Send in convertible input where Boolean is expected and convert is flagged globally.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Boolean },
		});
		expect(await validator({
			name: `no`,
		}, { convertValues: true })).toEqual({
			error: false,
			errors: {},
			data: {
				name: false,
			},
		});
	});

	test(`Send in convertible input where Boolean is expected and convert is not flagged globally but is locally.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Boolean, convert: true },
		});
		expect(await validator({
			name: `true`,
		}, {})).toEqual({
			error: false,
			errors: {},
			data: {
				name: true,
			},
		});
	});

	test(`Send in convertible input where Boolean is expected and is flagged locally but local is disabled.  Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: Boolean, convert: true },
			});
			await validator({
				name: `true`,
			}, { disableLocalOptions: true });
			throw Error(`Failed To Receive Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors:
				{
					name: `The input for "name" is not a boolean`,
				},
			});
		}
	});

});

describe(`Date Input Testing`, () => {

	test(`Send in Date input where Date is expected (same layer).  Expect Success`, async () => {
		const validator = await buildValidator({
			name: Date,
		});
		const currDate = new Date();
		expect(await validator({
			name: currDate,
		}, {})).toEqual({
			error: false,
			errors: {},
			data: {
				name: currDate,
			},
		});
	});

	test(`Send in Date input where Date is expected.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Date },
		});
		const currDate = new Date();
		expect(await validator({
			name: currDate,
		}, {})).toEqual({
			error: false,
			errors: {},
			data: {
				name: currDate,
			},
		});
	});

	test(`Send in non-Date input where Date is expected.  Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: Date },
			});
			await validator({
				name: `hello`,
			}, {});
			throw Error(`Failed To Receive Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors:
				{
					name: `The input for "name" is not a date`,
				},
			});
		}
	});

	test(`Send in convertible to Date input where Date is expected but convert not flagged.  Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: Date },
			});
			const currDate = new Date();
			await validator({
				name: currDate.toUTCString(),
			}, {});
			throw Error(`Failed To Receive Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors:
				{
					name: `The input for "name" is not a date`,
				},
			});
		}
	});

	test(`Send in convertible input where Date is expected and convert is flagged globally.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Date },
		});
		const currDate = Date.now();
		expect(await validator({
			name: currDate,
		}, { convertValues: true })).toEqual({
			error: false,
			errors: {},
			data: {
				name: new Date(currDate),
			},
		});
	});

	test(`Send in convertible input where Date is expected and convert is not flagged globally but is locally.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Date, convert: true },
		});
		const currDate = Date.now();
		expect(await validator({
			name: currDate,
		}, {})).toEqual({
			error: false,
			errors: {},
			data: {
				name: new Date(currDate),
			},
		});
	});

	test(`Send in Date that is within the min and max.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Date, min: new Date(`January 2007`), max: new Date(`December 2020`) },
		});
		const currDate = new Date(`Feb 2017`);
		expect(await validator({
			name: currDate,
		})).toEqual({
			error: false,
			errors: {},
			data: {
				name: currDate,
			},
		});
	});

	test(`Send in a Date that is below the Minimum Date.  Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: Date, min: new Date(`January 2018`), max: new Date(`December 2020`) },
			});
			const currDate = new Date(`Feb 2017`);
			expect(await validator({
				name: currDate,
			}));
			throw Error(`Failed To Receive Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors:
				{
					name: `The input for "name" is smaller than the minimum "Mon Jan 01 2018 00:00:00 GMT+0000 (Greenwich Mean Time)"`,
				},
			});
		}
	});

	test(`Send in a Date that is above the Maximum Date.  Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: Date, min: new Date(`January 2018`), max: new Date(`December 2020`) },
			});
			const currDate = new Date(`Feb 2021`);
			expect(await validator({
				name: currDate,
			}));
			throw Error(`Failed To Receive Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors:
				{
					name: `The input for "name" is larger than the maximum "Tue Dec 01 2020 00:00:00 GMT+0000 (Greenwich Mean Time)"`,
				},
			});
		}
	});

});

describe(`Mongoose Id Input Testing`, () => {

	test(`Send in Mongoose Id input where Mongoose Id is expected (same layer).  Expect Success`, async () => {
		const validator = await buildValidator({
			name: Schema.Types.ObjectId,
		});
		const objectId = Types.ObjectId();
		expect(await validator({
			name: objectId,
		}, {})).toEqual({
			error: false,
			errors: {},
			data: {
				name: objectId,
			},
		});
	});

	test(`Send in Mongoose Id input where Mongoose Id is expected (same layer).  Expect Success`, async () => {
		const validator = await buildValidator({
			name: Schema.Types.ObjectId,
		});
		expect(await validator({
			name: `5cf8c9103ab4c607bc830d7a`,
		}, {})).toEqual({
			error: false,
			errors: {},
			data: {
				name: `5cf8c9103ab4c607bc830d7a`,
			},
		});
	});

	test(`Send in Date input where Date is expected.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Schema.Types.ObjectId },
		});
		expect(await validator({
			name: `5cf8c9103ab4c607bc830d7a`,
		}, {})).toEqual({
			error: false,
			errors: {},
			data: {
				name: `5cf8c9103ab4c607bc830d7a`,
			},
		});
	});

	test(`Send in non-MongooseId input where MongooseId is expected.  Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: Schema.Types.ObjectId },
			});
			await validator({
				name: `AAAA`,
			}, {});
			throw Error(`Failed To Receive Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors:
				{
					name: `The input for "name" is not a MongooseId`,
				},
			});
		}
	});

	test(`Send in non-MongooseId input where MongooseId is expected.  Expect Success`, async () => {
		const validator = await buildValidator({
			name: [{ type: Schema.Types.ObjectId, skip: true }],
			name2: { type: String },
		});
		expect(await validator({
			name: [`AA`],
			name2: `AAAA`,
		}, {})).toEqual({
			error: false,
			errors: {},
			data: {
				name: [`AA`],
				name2: `AAAA`,
			},
		});
	});
});

describe('Mixed input type Testing', () => {
	
	test(`Send in a Object ID input where Mixed is expected (same layer).  Expect Success`, async () => {
		const validator = await buildValidator({
			name: Schema.Types.Mixed,
		});
		const objectId = Types.ObjectId();
		expect(await validator({
			name: objectId,
		}, {})).toEqual({
			error: false,
			errors: {},
			data: {
				name: objectId,
			},
		});
	});

	test(`Send in a Boolean input where Mixed is expected (same layer).  Expect Success`, async () => {
		const validator = await buildValidator({
			name: Schema.Types.Mixed,
		});
		expect(await validator({
			name: true,
		}, {})).toEqual({
			error: false,
			errors: {},
			data: {
				name: true,
			},
		});
	});

	test(`Send in a String input where Mixed is expected (same layer).  Expect Success`, async () => {
		const validator = await buildValidator({
			name: Schema.Types.Mixed,
		});
		expect(await validator({
			name: `stringy`,
		}, {})).toEqual({
			error: false,
			errors: {},
			data: {
				name: `stringy`,
			},
		});
	});

	test(`Send in a Number input where Mixed is expected (same layer).  Expect Success`, async () => {
		const validator = await buildValidator({
			name: Schema.Types.Mixed,
		});
		expect(await validator({
			name: 1234,
		}, {})).toEqual({
			error: false,
			errors: {},
			data: {
				name: 1234,
			},
		});
	});

	test(`Send in a Date input where Mixed is expected (same layer).  Expect Success`, async () => {
		const validator = await buildValidator({
			name: Schema.Types.Mixed,
		});
		const date = new Date(`January 2018`)
		expect(await validator({
			name: date,
		}, {})).toEqual({
			error: false,
			errors: {},
			data: {
				name: date,
			},
		});
	});

})
