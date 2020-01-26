# Mongoose Schema Validator

The Mongoose Schema Validator provides functionality to validate the input and output of a system through mongoose schema objects, allowing for data trimming, conversion and checking before or after the data is processed.  This project comes out of two specific use cases for myself.  Firstly I wanted to use my already written Mongoose Schema in my validator when inputs came into the system though potentially before I was saving data.  Secondly, I wanted a system that could easily handle trimming the ammount of data that was being returned to the User, again tied to my already built schemas.  The first use case is demonstrated in the Usage section of this page and there is an example of how to run the second use case in the Examples section.

Please note, any of the extra options provided to the MSV_Options do not effect the actual processing handled by mongoose.

Currently the project is in Beta and probably not suitable for production use.

## Installation

npm i mongoose-schema-validator

yarn add mongoose-schema-validator

Package has been built using Typescript and has type definitions in the package.

## Usage

### JavaScript

```javascript
const MSV = require("mongoose-schema-validator")
```
### TypeScript
```javascript
import { buildValidator,	buildNonThrowValidator } from "mongoose-schema-validator"
```
### Do Not Throw Option
The Do not throw option will return the errors the validator has found but without the throwing an error, saving a try, catch block.  This needs to be declared with the "buildNonThrowValidator" setup as previously having this as a simple option was throwing TS Typing Errors

```javascript
async function validatorFunction () {
	let validate = await MSV.buildNonThrowValidator({
		name: String,
		age: Number,
		DOB: Date
	})
	let valid = await validate({
		name: "Dizzienoo",
		age: "15",
		DOB: Date.now(),
	}, { convert: true) // Full list of the options to send is below
	if (valid.errors.length) {
		//Handle Errors
		throw Error(valid.errors);
	}
	//Otherwise, we have our validated code
	console.log(response.data);
}
```

### Without Do Not Throw Option
This setup will require that the Error is caught or handled

```javascript
async function validatorFunction () {
	let validate = await MSV.buildValidator({
		name: String,
		age: Number,
		DOB: Date
	})
	try {
	let valid = await validate({
		name: "Dizzienoo",
		age: "15",
		DOB: Date.now(),
	}, { convert: true }) // Full list of the options to send is below
	//Process and use our validated code
	console.log(valid);
	}
	catch (err) {
		// If there are errors in the input they are caught here
		console.error(err.errors) // The array of errors to process
		console.error(err.message) // Generic Message alerting that there have been errors
	}
}
```

### Applying an MSV_Option before execution

Depending on the use case, you may wish to tell the system to handle specific fields of the schema differently to the rest of the Schema.  For example, on an Update Request you may not want to validate a sub-document.  This can be handled by adding MSV_Options on the fly.  
DO REMEMBER: MSV OPTIONS CANNOT BE ADDED TO "SHALLOW" CONFIGURATIONS, THEY CAN ONLY BE ADDED TO SCHEMA FIELDS THAT USE AN OBJECT AND "TYPE" FIELD.

```javascript
async function validatorFunction () {
	// This schema object would probably be hosted elsewhere
	const schema = {
		name: {type: String},
		DOB: Date // Could not add MSV_Option to this needs to be {type: Date}
	}
	//Creating a close on the object amd adding extra options before processing
	const outgoingSchema = Object.assign({}, schema)
	schema.name.MSV_Options = {skip: true}
	let validate = await MSV.buildValidator()
	try {
	let valid = await validate({
		name: "Dizzienoo",
		age: "15",
		DOB: Date.now(),
	}, { convert: true }) // Full list of the options to send is below
	//Process and use our validated code
	}
	catch (err) {
		// If there are errors in the input they are caught here
		console.error(err.errors) // The array of errors to process
		console.error(err.message) // Generic Message alerting that there have been errors
	}
}
```
## Options

### Mongoose Schema Options
These options are defined as normal in the schema object and are handled by the application.  The system will process and complete these validation tasks just as mongoose would.  Optional messages can be added in the same way as mongoose, by using {value: "" , message: ""}

General Validators:

	required: boolean;
	skip: boolean; Overrides Required
	convert: true

String Validators:

	enum: string[]; 
	minLength: number;
	maxLength: number;
	lowercase: boolean;
	uppercase: boolean;
	trim: boolean;
	match: RegExp;

Number Validators:

	max: number;
	min: number;

Date Validators:

	max: Date;
	min: Date;

### MSV_Options
Two extra fields can be added to schema lines that will be processed by MSV.  These fields can be provided in the same ways as mongoose, as either simply a value, an array with value and message or an object with valuer and message.

```javascript
{
	// Do we want to attempt to convert this line into its desired type
	convert: boolean;
	// Do we want to skip this line when processing the input?  
	// This option is intended to be added only in specific use cases and 
	// shouldn't be placed in the main schema as it even overrides 
	// "disableLocalOptions" for the fields upon which it is placed
	skip: boolean;

}
```

### Global Options
The following validator options are able to be sent with the input to determine how the application functions.

```javascript
{
	/**
		* Do we want to attempt to convert the inputs to their desired type?
		*/
	convert?: boolean; // This could be local or global
	/**
		* Remove any fields that are not defined in the schema?
		*/
	trimExtraFields?: boolean;
	/**
		* Don't throw errors for fields marked as required in the schema but missing
		*/
	ignoreRequired?: boolean;
	/**
		* Use this option to disable any local options set at the schema level.  
		* This will not disable the mongoose options or the custom 
		* Error messages provided, only the MSV_Options
		*/
	disableLocalOptions?: boolean;
	/**
		* If the validator finds errors do we want it to throw an error.  
		* Only works on the validator, the schema creation will throw regardless.
		*/
	doNotThrow?: boolean;
}
```

### Custom Error Messages

Custom Error Messages can be provided for all of the schema defined Inputs.

Via array input:
```javascript
{
	name: {
		type: String,
		required: [true, "You need to provide a name, even if its just a mononym!"]
	}
}
```

Via Object input
```javascript
{
	name: {
		type: String, required: { 
			value: true,
			message: "You need to provide a name, even if its just a mononym!"
		}
	}
}
```

Due to the enum option's value being an array the only way to add a message would be to pass in the value and message in object format
```javascript
{
	name: {
		type: String, enum: {
			value: ["Dene", "Doc", "Hank", "The Monarch"],
			message: "You're not a Venture!"
		}
	}
}
```

## Examples

### Example of Data control using Trim function and combined Schemas

```javascript
let userObject = {
	name: {type: String, required: true},
	age: {type: Number, required: true},
}

let adminObject = Object.assign({}, userObject, {
	dateRegistered: {type: Date, default: Date.now()},
	lastLogin: {type: Date, default: Date.now()},
})
// The full database schema may have even more fields, or more "layers" of information to return

async function processResponse(userProfile, role) {
 if (role === "USER") {
	 let validate = await buildValidator(userObject)
	 return await validate(userProfile, {trimExtraFields: true})
 }
 else {
	 let validate = await buildValidator(adminObject)
	 return await validate(userProfile, {trimExtraFields: true})
 }
}
```

## Change Log

1.0.7 - Fixed Error thrown when converting string to Object Id

## Issues

Currently the project is in Beta and probably not suitable for production use.

Please report and bugs or issues to:
https://github.com/Dizzienoo/MongooseSchemaValidator/issues



## Future Plans

Support for Buffer, Decimal128, and Map Types