import { buildValidator } from "..";


describe(`Test the Require Option inputs`, () => {

	test(`Send in an invalid Field. Expect Success`, async () => {
		try {
			await buildValidator({
				name: { type: String, MSV_Options: { KEY: true } },
			});
			throw Error(`Failed To Recieve Error`);
		}
		catch (err) {
			expect(err).toEqual(Error(`Failed To Recieve Error`));
		}
	});

	test(`Send in required Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, required: `fail` },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.required.value": `Value provided in the Schema Option "required" should be a boolean`,
					},
				],
			});
		}
	});

	test(`Send in required Key, with an invalid value, expect failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, required: [`fly`] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.required.value": `Value provided in the Schema Option "required" should be a boolean`,
					},
				],
			});
		}
	});

	test(`Send in required Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, required: { value: `fail` } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.required.value": `Value provided in the Schema Option "required" should be a boolean`,
					},
				],
			});
		}
	});

	test(`Send in required Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, required: { value: true, message: true } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.required.message": `Message provided in the Schema Option "required" should be a string`,
					},
				],
			});
		}
	});

	test(`Send in required Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, required: [true, true] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.required.message": `Message provided in the Schema Option "required" should be a string`,
					},
				],
			});
		}
	});

	test(`Send in required Key with a valid value and message. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, required: { value: true, message: `This field is required` } },
		});
		expect(await validator({ name: `Adam` })).toEqual({
			name: `Adam`,
		});
	});

	test(`Send in required Key with a valid value and message. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, required: [true, `This field is required`] },
		});
		expect(await validator({ name: `Adam` })).toEqual({
			name: `Adam`,
		});
	});

	test(`Send in correct required option but incorrect parameters. Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
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

	test(`Send in correct required option and message but incorrect parameters. Expect Custom Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: String, required: { value: true, message: `This field is required` } },
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
						name: `This field is required`,
					},
				],
			});
		}
	});


	test(`Send in correct required option and message but incorrect parameters. Expect Custom Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: String, required: [true, `This field is required`] },
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
						name: `This field is required`,
					},
				],
			});
		}
	});


	test(`Send in Schema with required field and Input, expect Success`, async () => {
		const validator = await buildValidator({
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


	test(`Send in Schema with required field but missing in Input but ignoring Required option, expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, required: true },
			name2: { type: String },
		});
		expect(await validator({
			name2: `123`,
		}, { ignoreRequired: true })).toEqual({
			name2: `123`,
		});
	});

	test(`Send in invalid Global Options. Expect failure`, async () => {
		try {
			const validate = await buildValidator({
				name: { type: String },
			});
			await validate({ name: `My Name` }, {
				// @ts-ignore
				convertValues: `trr`,
				// @ts-ignore
				trimExtraFields: `false`,
				// @ts-ignore
				ignoreRequired: `true`,
				// @ts-ignore
				disableLocalOptions: `trr`,
				// @ts-ignore
				doNotThrow: 123,
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Options Provided have errors`,
				errors: [
					{
						'globalOptions.convertValues': `Option provided in the global Options, "convertValues", needs to be be a boolean`,
					},
					{
						'globalOptions.trimExtraFields': `Option provided in the global Options, "trimExtraFields", needs to be be a boolean`,
					},
					{
						'globalOptions.ignoreRequired': `Option provided in the global Options, "ignoreRequired", needs to be be a boolean`,
					},
					{
						'globalOptions.disableLocalOptions': `Option provided in the global Options, "disableLocalOptions", needs to be be a boolean`,
					},
					{
						'globalOptions.doNotThrow': `Option provided in the global Options, "doNotThrow", needs to be be a boolean`,
					},
				],
			});
		}
	});

});

describe(`Test the Skip Option inputs`, () => {

	test(`Send in skip Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, skip: `fail` },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.skip.value": `Value provided in the Schema Option "skip" should be a boolean`,
					},
				],
			});
		}
	});

	test(`Send in skip Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, skip: { value: `fail` } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.skip.value": `Value provided in the Schema Option "skip" should be a boolean`,
					},
				],
			});
		}
	});

	test(`Send in skip Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, skip: [`fail`] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.skip.value": `Value provided in the Schema Option "skip" should be a boolean`,
					},
				],
			});
		}
	});

	test(`Send in skip Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, skip: { value: true, message: true } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.skip.message": `Message provided in the Schema Option "skip" should be a string`,
					},
				],
			});
		}
	});

	test(`Send in skip Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, skip: [true, true] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.skip.message": `Message provided in the Schema Option "skip" should be a string`,
					},
				],
			});
		}
	});

	test(`Send in skip Key with a valid value and message. Expect Success`, async () => {
		// try {
		const validator = await buildValidator({
			name: { type: String, skip: { value: true, message: `This field is skip` } },
		});
		expect(await validator({ name: `Adam` })).toEqual({
			name: `Adam`,
		});
	});

	test(`Send in skip Key with a valid value and message. Expect Success`, async () => {
		// try {
		const validator = await buildValidator({
			name: { type: String, skip: [true, `This field is skip`] },
		});
		expect(await validator({ name: `Adam` })).toEqual({
			name: `Adam`,
		});
	});

	test(`Send in skip Key with a invalid value and message. Expect Success`, async () => {
		// try {
		const validator = await buildValidator({
			name: { type: String, skip: [true] },
		});
		expect(await validator({ name: true })).toEqual({
			name: true,
		});
	});

	test(`Send in skip Key with a invalid value and message. Expect Success`, async () => {
		// try {
		const validator = await buildValidator({
			name: [String],
		});
		expect(await validator({ name: [true] }, { convertValues: true })).toEqual({
			name: [`true`],
		});
	});

});

describe(`Test the Convert Option Inputs`, () => {

	test(`Send in convert Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, convert: `fail` },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.convert.value": `Value provided in the Schema Option "convert" should be a boolean`,
					},
				],
			});
		}
	});

	test(`Send in convert Key, with an invalid value, expect failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, convert: [`fly`] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.convert.value": `Value provided in the Schema Option "convert" should be a boolean`,
					},
				],
			});
		}
	});

	test(`Send in convert Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, convert: { value: `fail` } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.convert.value": `Value provided in the Schema Option "convert" should be a boolean`,
					},
				],
			});
		}
	});

	test(`Send in convert Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, convert: { value: true, message: true } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.convert.message": `Message provided in the Schema Option "convert" should be a string`,
					},
				],
			});
		}
	});

	test(`Send in convert Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, convert: [true, true] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.convert.message": `Message provided in the Schema Option "convert" should be a string`,
					},
				],
			});
		}
	});

	test(`Send in convert Key with a valid value and message. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, convert: { value: true, message: `This field is convert` } },
		});
		expect(await validator({ name: `Adam` })).toEqual({
			name: `Adam`,
		});
	});

	test(`Send in convert Key with a valid value and message. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, convert: [true, `This field is convert`] },
		});
		expect(await validator({ name: `Adam` })).toEqual({
			name: `Adam`,
		});
	});

	test(`Send in convert Key with a valid value and message with convertable input. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, convert: [true] },
		});
		expect(await validator({ name: true })).toEqual({
			name: `true`,
		});
	});

});

describe(`Test the Min Length Option`, () => {

	test(`Send in minLength Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, minLength: `fail` },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.minLength.value": `Value provided in the Schema Option "minLength" should be a number`,
					},
				],
			});
		}
	});

	test(`Send in minLength Key, with an invalid value, expect failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, minLength: [`fly`] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.minLength.value": `Value provided in the Schema Option "minLength" should be a number`,
					},
				],
			});
		}
	});

	test(`Send in minLength Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, minLength: { value: `fail` } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.minLength.value": `Value provided in the Schema Option "minLength" should be a number`,
					},
				],
			});
		}
	});

	test(`Send in minLength Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, minLength: { value: 123, message: true } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.minLength.message": `Message provided in the Schema Option "minLength" should be a string`,
					},
				],
			});
		}
	});

	test(`Send in minLength Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, minLength: [123, true] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.minLength.message": `Message provided in the Schema Option "minLength" should be a string`,
					},
				],
			});
		}
	});

	test(`Send in minLength Key with a valid value and message. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, minLength: { value: 2, message: `This field is minLength` } },
		});
		expect(await validator({ name: `Adam` })).toEqual({
			name: `Adam`,
		});
	});

	test(`Send in minLength Key with a valid value and message. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, minLength: [2, `This field is minLength`] },
		});
		expect(await validator({ name: `Adam` })).toEqual({
			name: `Adam`,
		});
	});

	test(`Send in correct minLength option but incorrect parameters. Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: String, minLength: 12 },
				name2: { type: String },
			});
			await validator({
				name: `Special`,
				name2: `123`,
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input for "name" is shorter than the allowed minimum, "12"`,
					},
				],
			});
		}
	});

	test(`Send in correct minLength option and message but incorrect parameters. Expect Custom Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: String, minLength: { value: 12, message: `This field is minLength` } },
				name2: { type: String },
			});
			await validator({
				name: `special`,
				name2: `123`,
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `This field is minLength`,
					},
				],
			});
		}
	});

	test(`Send in correct minLength option and message but incorrect parameters. Expect Custom Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: String, minLength: [10, `This field is minLength`] },
				name2: { type: String },
			});
			await validator({
				name: `lessthan`,
				name2: `123`,
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `This field is minLength`,
					},
				],
			});
		}
	});

	test(`Send in Schema with minLength field and Input, expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, minLength: 4 },
			name2: { type: String },
		});
		expect(await validator({
			name: `A String`,
			name2: `123`,
		})).toEqual({
			name: `A String`,
			name2: `123`,
		});
	});

	test(`Send in Schema with minLength field but missing in Input but ignoring minLength option, expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, minLength: { value: 9 }, skip: true },
			name2: { type: String },
		});
		expect(await validator({
			name: `Space`,
			name2: `123`,
		})).toEqual({
			name: `Space`,
			name2: `123`,
		});
	});

	test(`Send in Schema with minLength field but missing in Input but ignoring minLength option, expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, minLength: [9], skip: true },
			name2: { type: String },
		});
		expect(await validator({
			name: `Space`,
			name2: `123`,
		})).toEqual({
			name: `Space`,
			name2: `123`,
		});
	});

});

describe(`Test the Max Length Option`, () => {

	test(`Send in maxLength Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, maxLength: `fail` },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.maxLength.value": `Value provided in the Schema Option "maxLength" should be a number`,
					},
				],
			});
		}
	});

	test(`Send in maxLength Key, with an invalid value. Expect failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, maxLength: [`fly`] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.maxLength.value": `Value provided in the Schema Option "maxLength" should be a number`,
					},
				],
			});
		}
	});

	test(`Send in maxLength Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, maxLength: { value: `fail` } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.maxLength.value": `Value provided in the Schema Option "maxLength" should be a number`,
					},
				],
			});
		}
	});

	test(`Send in maxLength Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, maxLength: { value: 123, message: true } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.maxLength.message": `Message provided in the Schema Option "maxLength" should be a string`,
					},
				],
			});
		}
	});

	test(`Send in maxLength Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, maxLength: [123, true] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.maxLength.message": `Message provided in the Schema Option "maxLength" should be a string`,
					},
				],
			});
		}
	});

	test(`Send in maxLength Key with a valid value and message. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, maxLength: { value: 5, message: `This field is maxLength` } },
		});
		expect(await validator({ name: `Adam` })).toEqual({
			name: `Adam`,
		});
	});

	test(`Send in maxLength Key with a valid value and message. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, maxLength: [6, `This field is maxLength`] },
		});
		expect(await validator({ name: `Adam` })).toEqual({
			name: `Adam`,
		});
	});

	test(`Send in correct maxLength option but incorrect parameters. Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: String, maxLength: 4 },
				name2: { type: String },
			});
			await validator({
				name: `Special`,
				name2: `123`,
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input for "name" is longer than the allowed maximum, "4"`,
					},
				],
			});
		}
	});

	test(`Send in correct maxLength option and message but incorrect parameters. Expect Custom Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: String, maxLength: { value: 4, message: `This field is maxLength` } },
				name2: { type: String },
			});
			await validator({
				name: `special`,
				name2: `123`,
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `This field is maxLength`,
					},
				],
			});
		}
	});

	test(`Send in correct maxLength option and message but incorrect parameters. Expect Custom Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: String, maxLength: [6, `This field is maxLength`] },
				name2: { type: String },
			});
			await validator({
				name: `morethan`,
				name2: `123`,
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `This field is maxLength`,
					},
				],
			});
		}
	});

	test(`Send in Schema with maxLength field and Input. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, maxLength: 10 },
			name2: { type: String },
		});
		expect(await validator({
			name: `A String`,
			name2: `123`,
		})).toEqual({
			name: `A String`,
			name2: `123`,
		});
	});

	test(`Send in Schema with maxLength field but missing in Input but ignoring maxLength option. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, maxLength: { value: 2 }, skip: true },
			name2: { type: String },
		});
		expect(await validator({
			name: `Space`,
			name2: `123`,
		})).toEqual({
			name: `Space`,
			name2: `123`,
		});
	});

	test(`Send in Schema with maxLength field but missing in Input but ignoring maxLength option. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, maxLength: [2], skip: true },
			name2: { type: String },
		});
		expect(await validator({
			name: `Space`,
			name2: `123`,
		})).toEqual({
			name: `Space`,
			name2: `123`,
		});
	});

});

describe(`Test the lowercase Option`, () => {

	test(`Send in lowercase Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, lowercase: `fail` },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.lowercase.value": `Value provided in the Schema Option "lowercase" should be a boolean`,
					},
				],
			});
		}
	});

	test(`Send in lowercase Key, with an invalid value. Expect failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, lowercase: [`fly`] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.lowercase.value": `Value provided in the Schema Option "lowercase" should be a boolean`,
					},
				],
			});
		}
	});

	test(`Send in lowercase Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, lowercase: { value: `fail` } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.lowercase.value": `Value provided in the Schema Option "lowercase" should be a boolean`,
					},
				],
			});
		}
	});

	test(`Send in lowercase Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, lowercase: { value: true, message: true } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.lowercase.message": `Message provided in the Schema Option "lowercase" should be a string`,
					},
				],
			});
		}
	});

	test(`Send in lowercase Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, lowercase: [true, true] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.lowercase.message": `Message provided in the Schema Option "lowercase" should be a string`,
					},
				],
			});
		}
	});

	test(`Send in lowercase Key with a valid value and message. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, lowercase: { value: true, message: `This field is lowercase` } },
		});
		expect(await validator({ name: `Adam` })).toEqual({
			name: `adam`,
		});
	});

	test(`Send in lowercase Key with a valid value and message. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, lowercase: [true, `This field is lowercase`] },
		});
		expect(await validator({ name: `Adam` })).toEqual({
			name: `adam`,
		});
	});

	test(`Send in Schema with lowercase field and Input. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, lowercase: true },
			name2: { type: String },
		});
		expect(await validator({
			name: `A String`,
			name2: `123`,
		})).toEqual({
			name: `a string`,
			name2: `123`,
		});
	});

	test(`Send in Schema with lowercase field but missing in Input but ignoring lowercase option. Expect Success`, async () => {
		const validator = await buildValidator({
			name2: { type: String },
			name: { type: String, lowercase: { value: true }, skip: true },
			name3: { type: String },
		});
		expect(await validator({
			name2: `UPPER`,
			name: `Space`,
			name3: `UPPER`,
		})).toEqual({
			name2: `UPPER`,
			name: `Space`,
			name3: `UPPER`,
		});
	});

	test(`Send in Schema with lowercase field but missing in Input but ignoring lowercase option. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, lowercase: [true] },
			name2: { type: String },
		});
		expect(await validator({
			name: `Space`,
			name2: `Fred`,
		})).toEqual({
			name: `space`,
			name2: `Fred`,
		});
	});

});

describe(`Test the uppercase Option`, () => {

	test(`Send in uppercase Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, uppercase: `fail` },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.uppercase.value": `Value provided in the Schema Option "uppercase" should be a boolean`,
					},
				],
			});
		}
	});

	test(`Send in uppercase Key, with an invalid value. Expect failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, uppercase: [`fly`] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.uppercase.value": `Value provided in the Schema Option "uppercase" should be a boolean`,
					},
				],
			});
		}
	});

	test(`Send in uppercase Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, uppercase: { value: `fail` } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.uppercase.value": `Value provided in the Schema Option "uppercase" should be a boolean`,
					},
				],
			});
		}
	});

	test(`Send in uppercase Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, uppercase: { value: true, message: true } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.uppercase.message": `Message provided in the Schema Option "uppercase" should be a string`,
					},
				],
			});
		}
	});

	test(`Send in uppercase Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, uppercase: [true, true] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.uppercase.message": `Message provided in the Schema Option "uppercase" should be a string`,
					},
				],
			});
		}
	});

	test(`Send in uppercase Key with a valid value and message. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, uppercase: { value: true, message: `This field is uppercase` } },
		});
		expect(await validator({ name: `Adam` })).toEqual({
			name: `ADAM`,
		});
	});

	test(`Send in uppercase Key with a valid value and message. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, uppercase: [true, `This field is uppercase`] },
		});
		expect(await validator({ name: `Adam` })).toEqual({
			name: `ADAM`,
		});
	});

	test(`Send in Schema with uppercase field and Input. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, uppercase: true },
			name2: { type: String },
		});
		expect(await validator({
			name: `A String`,
			name2: `123`,
		})).toEqual({
			name: `A STRING`,
			name2: `123`,
		});
	});

	test(`Send in Schema with uppercase field but missing in Input but ignoring uppercase option. Expect Success`, async () => {
		const validator = await buildValidator({
			name2: { type: String },
			name: { type: String, uppercase: { value: true }, skip: true },
			name3: { type: String },
		});
		expect(await validator({
			name2: `lower`,
			name: `SPACE`,
			name3: `lower`,
		})).toEqual({
			name2: `lower`,
			name: `SPACE`,
			name3: `lower`,
		});
	});

	test(`Send in Schema with uppercase field but missing in Input but ignoring uppercase option. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, uppercase: [true] },
			name2: { type: String },
		});
		expect(await validator({
			name: `SPACE`,
			name2: `Fred`,
		})).toEqual({
			name: `SPACE`,
			name2: `Fred`,
		});
	});

});

describe(`Test the trim Option`, () => {

	test(`Send in trim Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, trim: `fail` },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.trim.value": `Value provided in the Schema Option "trim" should be a boolean`,
					},
				],
			});
		}
	});

	test(`Send in trim Key, with an invalid value. Expect failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, trim: [`fly`] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.trim.value": `Value provided in the Schema Option "trim" should be a boolean`,
					},
				],
			});
		}
	});

	test(`Send in trim Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, trim: { value: `fail` } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.trim.value": `Value provided in the Schema Option "trim" should be a boolean`,
					},
				],
			});
		}
	});

	test(`Send in trim Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, trim: { value: true, message: true } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.trim.message": `Message provided in the Schema Option "trim" should be a string`,
					},
				],
			});
		}
	});

	test(`Send in trim Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: String, trim: [true, true] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.trim.message": `Message provided in the Schema Option "trim" should be a string`,
					},
				],
			});
		}
	});

	test(`Send in trim Key with a valid value and message. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, trim: { value: true, message: `This field is trim` } },
		});
		expect(await validator({ name: `Adam ` })).toEqual({
			name: `Adam`,
		});
	});

	test(`Send in trim Key with a valid value and message. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, trim: [true, `This field is trim`] },
		});
		expect(await validator({ name: ` Adam` })).toEqual({
			name: `Adam`,
		});
	});

	test(`Send in Schema with trim field and Input. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, trim: true },
			name2: { type: String },
		});
		expect(await validator({
			name: `A String    `,
			name2: `123`,
		})).toEqual({
			name: `A String`,
			name2: `123`,
		});
	});

	test(`Send in Schema with trim field but missing in Input but ignoring trim option. Expect Success`, async () => {
		const validator = await buildValidator({
			name2: { type: String },
			name: { type: String, trim: { value: true }, skip: true },
			name3: { type: String },
		});
		expect(await validator({
			name2: `lower`,
			name: ` Space `,
			name3: `lower`,
		})).toEqual({
			name2: `lower`,
			name: ` Space `,
			name3: `lower`,
		});
	});

	test(`Send in Schema with trim field but missing in Input but ignoring trim option. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: String, trim: [true] },
			name2: { type: String },
		});
		expect(await validator({
			name: `Space   `,
			name2: `Fred`,
		})).toEqual({
			name: `Space`,
			name2: `Fred`,
		});
	});

});

describe(`Test the trim Option on non-trim type`, () => {

	test(`Send in trim Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: Number, trim: `fail` },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.trim": `Option "trim" is not an accepted key on "NUMBER_TYPE"`,
					},
				],
			});
		}
	});

	test(`Send in trim Key, with an invalid value. Expect failure`, async () => {
		try {
			await buildValidator({
				name: { type: Number, trim: [`fly`] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.trim": `Option "trim" is not an accepted key on "NUMBER_TYPE"`,
					},
				],
			});
		}
	});

	test(`Send in trim Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: Number, trim: { value: `fail` } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.trim": `Option "trim" is not an accepted key on "NUMBER_TYPE"`,
					},
				],
			});
		}
	});

	test(`Send in trim Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: Number, trim: { value: true, message: true } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.trim": `Option "trim" is not an accepted key on "NUMBER_TYPE"`,
					},
				],
			});
		}
	});

	test(`Send in trim Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: Number, trim: [true, true] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.trim": `Option "trim" is not an accepted key on "NUMBER_TYPE"`,
					},
				],
			});
		}
	});

});

describe(`Test the Min Option`, () => {

	test(`Send in min Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: Number, min: `fail` },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.min.value": `Value provided in the Schema Option "min" should be a number`,
					},
				],
			});
		}
	});

	test(`Send in min Key, with an invalid value. Expect failure`, async () => {
		try {
			await buildValidator({
				name: { type: Number, min: [`fly`] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.min.value": `Value provided in the Schema Option "min" should be a number`,
					},
				],
			});
		}
	});

	test(`Send in min Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: Number, min: { value: `fail` } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.min.value": `Value provided in the Schema Option "min" should be a number`,
					},
				],
			});
		}
	});

	test(`Send in min Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: Number, min: { value: 123, message: true } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.min.message": `Message provided in the Schema Option "min" should be a string`,
					},
				],
			});
		}
	});

	test(`Send in min Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: Number, min: [123, true] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.min.message": `Message provided in the Schema Option "min" should be a string`,
					},
				],
			});
		}
	});

	test(`Send in min Key with a valid value and message. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Number, min: { value: 2, message: `This field is min` } },
		});
		expect(await validator({ name: 3 })).toEqual({
			name: 3,
		});
	});

	test(`Send in min Key with a valid value and message. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Number, min: [2, `This field is min`] },
		});
		expect(await validator({ name: 3 })).toEqual({
			name: 3,
		});
	});

	test(`Send in correct min option but incorrect parameters. Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: Number, min: 40 },
				name2: { type: Number },
			});
			await validator({
				name: 15,
				name2: 123,
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input for "name" is smaller than the minimum "40"`,
					},
				],
			});
		}
	});

	test(`Send in correct min option and message but incorrect parameters. Expect Custom Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: Number, min: { value: 40, message: `This field is min` } },
				name2: { type: Number },
			});
			await validator({
				name: 15,
				name2: 123,
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `This field is min`,
					},
				],
			});
		}
	});

	test(`Send in correct min option and message but incorrect parameters. Expect Custom Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: Number, min: [60, `This field is min`] },
				name2: { type: Number },
			});
			await validator({
				name: 8,
				name2: 123,
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `This field is min`,
					},
				],
			});
		}
	});

	test(`Send in Schema with min field and Input. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Number, min: 10 },
			name2: { type: Number },
		});
		expect(await validator({
			name: 20,
			name2: 123,
		})).toEqual({
			name: 20,
			name2: 123,
		});
	});

	test(`Send in Schema with min field but missing in Input but ignoring min option. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Number, min: { value: 6 }, skip: true },
			name2: { type: Number },
		});
		expect(await validator({
			name: 4,
			name2: 123,
		})).toEqual({
			name: 4,
			name2: 123,
		});
	});

	test(`Send in Schema with min field but missing in Input but ignoring min option. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Number, min: [6], skip: true },
			name2: { type: Number },
		});
		expect(await validator({
			name: 4,
			name2: 123,
		})).toEqual({
			name: 4,
			name2: 123,
		});
	});

});

describe(`Test the Max Option`, () => {

	test(`Send in max Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: Number, max: `fail` },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.max.value": `Value provided in the Schema Option "max" should be a number`,
					},
				],
			});
		}
	});

	test(`Send in max Key, with an invalid value. Expect failure`, async () => {
		try {
			await buildValidator({
				name: { type: Number, max: [`fly`] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.max.value": `Value provided in the Schema Option "max" should be a number`,
					},
				],
			});
		}
	});

	test(`Send in max Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: Number, max: { value: `fail` } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.max.value": `Value provided in the Schema Option "max" should be a number`,
					},
				],
			});
		}
	});

	test(`Send in max Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: Number, max: { value: 123, message: true } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.max.message": `Message provided in the Schema Option "max" should be a string`,
					},
				],
			});
		}
	});

	test(`Send in max Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: Number, max: [123, true] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.max.message": `Message provided in the Schema Option "max" should be a string`,
					},
				],
			});
		}
	});

	test(`Send in max Key with a valid value and message. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Number, max: { value: 5, message: `This field is max` } },
		});
		expect(await validator({ name: 3 })).toEqual({
			name: 3,
		});
	});

	test(`Send in max Key with a valid value and message. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Number, max: [6, `This field is max`] },
		});
		expect(await validator({ name: 3 })).toEqual({
			name: 3,
		});
	});

	test(`Send in correct max option but incorrect parameters. Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: Number, max: 4 },
				name2: { type: Number },
			});
			await validator({
				name: 15,
				name2: 123,
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input for "name" is larger than the maximum "4"`,
					},
				],
			});
		}
	});

	test(`Send in correct max option and message but incorrect parameters. Expect Custom Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: Number, max: { value: 4, message: `This field is max` } },
				name2: { type: Number },
			});
			await validator({
				name: 15,
				name2: 123,
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `This field is max`,
					},
				],
			});
		}
	});

	test(`Send in correct max option and message but incorrect parameters. Expect Custom Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: Number, max: [6, `This field is max`] },
				name2: { type: Number },
			});
			await validator({
				name: 8,
				name2: 123,
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `This field is max`,
					},
				],
			});
		}
	});

	test(`Send in Schema with max field and Input. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Number, max: 10 },
			name2: { type: Number },
		});
		expect(await validator({
			name: 2,
			name2: 123,
		})).toEqual({
			name: 2,
			name2: 123,
		});
	});

	test(`Send in Schema with max field but missing in Input but ignoring max option. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Number, max: { value: 2 }, skip: true },
			name2: { type: Number },
		});
		expect(await validator({
			name: 4,
			name2: 123,
		})).toEqual({
			name: 4,
			name2: 123,
		});
	});

	test(`Send in Schema with max field but missing in Input but ignoring max option. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Number, max: [2], skip: true },
			name2: { type: Number },
		});
		expect(await validator({
			name: 4,
			name2: 123,
		})).toEqual({
			name: 4,
			name2: 123,
		});
	});

});

describe(`Test the Min Option`, () => {

	test(`Send in min Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: Date, min: `fail` },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.min.value": `Value provided in the Schema Option "min" should be a date`,
					},
				],
			});
		}
	});

	test(`Send in min Key, with an invalid value. Expect failure`, async () => {
		try {
			await buildValidator({
				name: { type: Date, min: [`fly`] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.min.value": `Value provided in the Schema Option "min" should be a date`,
					},
				],
			});
		}
	});

	test(`Send in min Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: Date, min: { value: `fail` } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.min.value": `Value provided in the Schema Option "min" should be a date`,
					},
				],
			});
		}
	});

	test(`Send in min Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: Date, min: { value: 123, message: true } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.min.message": `Message provided in the Schema Option "min" should be a string`,
					},
				],
			});
		}
	});

	test(`Send in min Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: Date, min: [123, true] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.min.message": `Message provided in the Schema Option "min" should be a string`,
					},
				],
			});
		}
	});

	test(`Send in min Key with a valid value and message. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Date, min: new Date(`Jan 1980`) },
		});
		const newDate = new Date(Date.now());
		expect(await validator({ name: newDate })).toEqual({
			name: newDate,
		});
	});

	test(`Send in min Key with a valid value and message. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Date, min: [new Date(`Feb 1990`), `This field is min`] },
		});

		const newDate = new Date(Date.now());
		expect(await validator({ name: newDate })).toEqual({
			name: newDate,
		});
	});

	test(`Send in correct min option but incorrect parameters. Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: Date, min: new Date(`Feb 2040`) },
				name2: { type: Date },
			});
			const newDate = new Date(Date.now());
			await validator({
				name: newDate,
				name2: newDate,
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input for "name" is smaller than the minimum "Wed Feb 01 2040 00:00:00 GMT+0000 (Greenwich Mean Time)"`,
					},
				],
			});
		}
	});

	test(`Send in correct min option and message but incorrect parameters. Expect Custom Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: Date, min: { value: new Date(`Feb 2040`), message: `This field is min` } },
				name2: { type: Date },
			});
			const newDate = new Date(Date.now());
			await validator({
				name: newDate,
				name2: newDate,
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `This field is min`,
					},
				],
			});
		}
	});

	test(`Send in correct min option and message but incorrect parameters. Expect Custom Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: Date, min: [new Date(`Feb 2040`), `This field is min`] },
				name2: { type: Date },
			});
			const newDate = new Date(Date.now());
			await validator({
				name: newDate,
				name2: newDate,
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `This field is min`,
					},
				],
			});
		}
	});

	test(`Send in Schema with min field and Input. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Date, min: new Date(`Jan 1980`) },
			name2: { type: Date },
		});
		const newDate = new Date(Date.now());
		expect(await validator({
			name: newDate,
			name2: newDate,
		})).toEqual({
			name: newDate,
			name2: newDate,
		});
	});

	test(`Send in Schema with min field but missing in Input but ignoring min option. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Date, min: { value: new Date(`Jan 2080`) }, skip: true },
			name2: { type: Date },
		});
		const newDate = new Date(Date.now());
		expect(await validator({
			name: newDate,
			name2: newDate,
		})).toEqual({
			name: newDate,
			name2: newDate,
		});
	});

	test(`Send in Schema with min field but missing in Input but ignoring min option. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Date, min: [new Date(`Jan 2080`)], skip: true },
			name2: { type: Date },
		});
		const newDate = new Date(Date.now());
		expect(await validator({
			name: newDate,
			name2: newDate,
		})).toEqual({
			name: newDate,
			name2: newDate,
		});
	});

});

describe(`Test the Max Option`, () => {

	test(`Send in max Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: Date, max: `fail` },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.max.value": `Value provided in the Schema Option "max" should be a date`,
					},
				],
			});
		}
	});

	test(`Send in max Key, with an invalid value. Expect failure`, async () => {
		try {
			await buildValidator({
				name: { type: Date, max: [`fly`] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.max.value": `Value provided in the Schema Option "max" should be a date`,
					},
				],
			});
		}
	});

	test(`Send in max Key with an invalid value. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: Date, max: { value: `fail` } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.max.value": `Value provided in the Schema Option "max" should be a date`,
					},
				],
			});
		}
	});

	test(`Send in max Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: Date, max: { value: 123, message: true } },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.max.message": `Message provided in the Schema Option "max" should be a string`,
					},
				],
			});
		}
	});

	test(`Send in max Key with a valid value but invalid message. Expect Failure`, async () => {
		try {
			await buildValidator({
				name: { type: Date, max: [123, true] },
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `Schema Unable to be parsed due to errors`,
				errors: [
					{
						"schemaOptions.max.message": `Message provided in the Schema Option "max" should be a string`,
					},
				],
			});
		}
	});

	test(`Send in max Key with a valid value and message. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Date, max: new Date(`Jan 2180`) },
		});
		const newDate = new Date(Date.now());
		expect(await validator({ name: newDate })).toEqual({
			name: newDate,
		});
	});

	test(`Send in max Key with a valid value and message. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Date, max: [new Date(`Feb 2190`), `This field is max`] },
		});

		const newDate = new Date(Date.now());
		expect(await validator({ name: newDate })).toEqual({
			name: newDate,
		});
	});

	test(`Send in correct max option but incorrect parameters. Expect Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: Date, max: new Date(`Feb 1940`) },
				name2: { type: Date },
			});
			const newDate = new Date(Date.now());
			await validator({
				name: newDate,
				name2: newDate,
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `The input for "name" is larger than the maximum "Thu Feb 01 1940 00:00:00 GMT+0000 (Greenwich Mean Time)"`,
					},
				],
			});
		}
	});

	test(`Send in correct max option and message but incorrect parameters. Expect Custom Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: Date, max: { value: new Date(`Feb 1940`), message: `This field is max` } },
				name2: { type: Date },
			});
			const newDate = new Date(Date.now());
			await validator({
				name: newDate,
				name2: newDate,
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `This field is max`,
					},
				],
			});
		}
	});

	test(`Send in correct max option and message but incorrect parameters. Expect Custom Failure`, async () => {
		try {
			const validator = await buildValidator({
				name: { type: Date, max: [new Date(`Feb 1940`), `This field is max`] },
				name2: { type: Date },
			});
			const newDate = new Date(Date.now());
			await validator({
				name: newDate,
				name2: newDate,
			});
			throw Error(`Failed To Recieve Expected Error`);
		}
		catch (err) {
			expect(err).toEqual({
				message: `The Input Provided has errors`,
				errors: [
					{
						name: `This field is max`,
					},
				],
			});
		}
	});

	test(`Send in Schema with max field and Input. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Date, max: new Date(`Jan 2080`) },
			name2: { type: Date },
		});
		const newDate = new Date(Date.now());
		expect(await validator({
			name: newDate,
			name2: newDate,
		})).toEqual({
			name: newDate,
			name2: newDate,
		});
	});

	test(`Send in Schema with max field but missing in Input but ignoring max option. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Date, max: { value: new Date(`Jan 1980`) }, skip: true },
			name2: { type: Date },
		});
		const newDate = new Date(Date.now());
		expect(await validator({
			name: newDate,
			name2: newDate,
		})).toEqual({
			name: newDate,
			name2: newDate,
		});
	});

	test(`Send in Schema with max field but missing in Input but ignoring max option. Expect Success`, async () => {
		const validator = await buildValidator({
			name: { type: Date, max: [new Date(`Jan 1980`)], skip: true },
			name2: { type: Date },
		});
		const newDate = new Date(Date.now());
		expect(await validator({
			name: newDate,
			name2: newDate,
		})).toEqual({
			name: newDate,
			name2: newDate,
		});
	});

});
