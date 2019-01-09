const isNOE = require (`../Utilities/isNOE`);

module.exports = function (input, convert, errmessage) {
	let error;
	if (isNOE(errmessage)) {errmessage = `Error, not a Boolean`;}
	if (convert) {
		input = Boolean(input);
	}
	if (typeof input !== `boolean`){error = errmessage;}
	return {
		error,
		input
	};
};