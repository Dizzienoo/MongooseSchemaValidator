const isNOE = require (`../Utilities/isNOE`);

const mongoose = require (`mongoose`);

module.exports = function (input, convert, errmessage) {
	try {
		let error;
		if (isNOE(errmessage)) {errmessage = `Error, not a MongooseId`;}
		if (convert) {input = mongoose.Types.ObjectId(input);}
		if (typeof input !== `object` || !mongoose.Types.ObjectId(input)) {error = errmessage;}
		return {
			error,
			input
		};
	}
	catch (err) {
		return {
			error: errmessage,
			input
		};
	}
};