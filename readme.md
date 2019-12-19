# Mongoose Schema Validator

The Mongoose Schema Validator provides functionality to validate the input and output of a system through mongoose schema objects, allowing for data trimming, conversion and checking before or after the data is processed.  This project comes out of two specific use cases for myself.  Firstly I wanted to use my already written Mongoose Schema as / in my validator when inputs came into the system though potentially before I was saving data.  Secondly, I wanted a system that could easily handle trimming the ammount of data that was being returned to the User, again tied to my already built schemas.  The first use case is demonstrated in the Usage section of this page and there is an example of how to run the second use case in the Examples section.

Please note, any of the extra options provided to the MSV_Options do not effect the actual processing handled by mongoose.

Currently the project is in Beta and probably not suitable for production use.

## Installation

npm i mongoose-schema-validator
yarn add mongoose-schema-validator

Package has been built using Typescript and has type definitions in the package.

## Usage

### JavaScript

const MSV = require("mongoose-schema-validator")

### TypeScript

import {} from "mongoose-schema-validator"

### Do Not Throw Option
The Do not throw option will return the errors the validator has found but without the throwing an error, saving a try, catch block

async function validatorFunction () {
	let validate = await MSV.buildValidator({
		name: String,
		age: Number,
		DOB: Date
	})
	let valid = await validate({
		name: "Dizzienoo",
		age: "15",
		DOB: Date.now(),
	}{ convert: true, doNotThrow: true }) // Full list of the options to send is below
	if (valid.errors.length) {
		//Handle Errors
		throw Error(valid.errors)
	}
	//Otherwise, we have our validated code
	console.log(response.data)
}

### Without Do Not Throw Option
This setup will require that the Error is caught or handled

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
	}{ convert: true }) // Full list of the options to send is below
	//Process and use our validated code
	}
	catch (err) {
		// If there are errors in the input they are caught here
		console.error(err.errors) // The array of errors to process
		console.error(err.message) // Generic Message alerting that there have been errors
	}
}


### Applying an MSV_Option before execution

Depending on the use case, you may wish to tell the system to handle specific fields of the schema differently to the rest of the Schema.  For example, on an Update Request you may not want to validate a sub-document.  This can be handled by adding MSV_Options on the fly.  DO REMEMBER: MSV OPTIONS CANNOT BE ADDED TO "SHALLOW" CONFIGURATIONS, THEY CAN ONLY BE ADDED TO SCHEMA FIELDS THAT USE AN OBJECT AND "TYPE" FIELD.

async function validatorFunction () {
	// This schema object would probably be hosted elsewhere
	const schema = {
		name: {type: String},
		DOB: Date // Could not add MSV_Options to this without converting the schema declaration to {type: Date}
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
	}{ convert: true }) // Full list of the options to send is below
	//Process and use our validated code
	}
	catch (err) {
		// If there are errors in the input they are caught here
		console.error(err.errors) // The array of errors to process
		console.error(err.message) // Generic Message alerting that there have been errors
	}
}

## Options

### Mongoose Schema Options
These options are defined as normal in the schema object and are handled by the application.  The systme will process and complete these validation tasks just as mongoose would.  Optional messages can be added in the same way as mongoose, by using {value: "" , message: ""}

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
!! Currently Match is not supported!

Number Validators:

	max: number;
	min: number;

Date Validators:

	max: Date;
	min: Date;


### MSV_Options
By adding the MSV_Options field to a line in the schema you can add some more granular control to certain incoming or outgoing fields on the fly.
All these field are optional and are false by default.  All fields either expect a value related to the value types below or, if you wish to include a custom message, a {value: "", message: ""} object

{
	convert: boolean; //Do we want to attempt to convert this line into its desired type
	skip: boolean; //Do we want to skip this line when processing the schema.  This will override all other validators for this field, including the mongoose ones.

}

### Global Options
The following validator options are able to be sent with the input to determine how the application functions.
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
		* Use this option to disable any local options set at the schema level.  This will not disable the mongoose options or the custom Error messages provided, only the MSV_Options
		*/
	disableLocalOptions?: boolean;
	doNotThrow?: boolean;
}


### Custom Error Messages

Custom Error Messages can be passed to the Mongoose and MSV checks for each 


## Examples

// TODO: ADD IN OUTGOING TRIMMER EXAMPLE HERE


## Issues

Currently the project is in Beta and probably not suitable for production use.

Please report and bugs or issues to:
https://github.com/Dizzienoo/MongooseSchemaValidator/issues




## Future Plans

// TODO: SORT OUT MSV_Options
// TODO: CUSTOM ERROR MESSAGES