const isNOE = require (`./isNOE`);
const inArray = require (`./inArray`);

const SupportedTypes = require (`./supportedTypes`);
//Takes in lines of key: {type: }
module.exports = function (input) {
	try {
		let keys = Object.keys(input);
		let systemErrors = [];
		keys.map(key => {
			if (isNOE(object[key].type)) {
				systemErrors.push({[key]: `No Type provided`});
			}
			else if (!inArray(object[key].type.toString(), SupportedTypes)) {
				systemErrors.push({[key]: `Type ${object[key].type} is not supported`});
			}
			else {
				switch (object[key].type) {
					case
				}
			}
		});
	}
	catch (err) {
		throw err;
	}
};