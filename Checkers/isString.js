const inArray = require (`../Utilities/inArray`);
const isNOE = require (`../Utilities/isNOE`);

module.exports = function (input, convert, uppercase, lowercase, minlength, maxlength, enuminput, match, errmessage) {
	try {
		let error;
		if (isNOE(errmessage)) {errmessage = `Error, not a String`;}
		if (convert) {input = input.toString();}
		if (typeof input !== `string`) {error = errmessage;}
		if (match) {
			let re = new RegExp(match);
			if (!re.test(input)) {error = `Error, String provided does not pass Match test`;}
		}
		if (uppercase) {input = input.toUpperCase();}
		if (lowercase) {input = input.toLowerCase();}
		if (minlength) {if (input.length < minlength) {error = `Error, String provided is shorter than the min length of ${minlength}`;}}
		if (maxlength) {if (input.length > maxlength) {error = `Error, String provided is longer than the max length of ${maxlength}`;}}
		if (!isNOE(enuminput)) {
			if (!Array.isArray(enuminput)) {error = `Enums need to be provided in an Array`;}
			else if(!inArray(input, enuminput)) {error = `Error, String provided is not in the Enum Array`;}
		}
		return {
			error,
			input
		};
	}
	catch (err) {
		throw err;
	}
};