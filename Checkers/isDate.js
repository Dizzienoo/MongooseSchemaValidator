const isNOE = require (`../Utilities/isNOE`);

module.exports = function (input, convert, errmessage) {
	let error = {};
	if (isNOE(errmessage)) {errmessage = `Error, not a Date`;}
	if (convert) {
		test = new Date(input);
		if (test instanceof Date && !isNaN(test)) {input = new Date(input);}
	}
	if (!(input instanceof Date)) {error = errmessage;}
	return {
		error,
		input
	};
};
