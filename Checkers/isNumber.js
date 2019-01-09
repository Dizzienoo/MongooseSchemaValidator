const isNOE = require (`../Utilities/isNOE`);

module.exports = function (input, convert, min, max, errmessage) {
	let error;
	if (isNOE(errmessage)) {errmessage = `Error, not a Number`;}
	if (convert) {
		if (typeof input === `date`) {
			input = Date.parse(input);
		}
		else if(typeof Number(input) === `number`) {
			input = Number(input);
		}
	}
	if (typeof input !== `number` || Number.isNaN(input)){error = errmessage;}
	if (min && input < min) {error = `Error, Number is smaller than ${min}`;}
	if (max && input > max) {error = `Error, Number is larger than ${max}`;}
	return {
		error,
		input
	};
};