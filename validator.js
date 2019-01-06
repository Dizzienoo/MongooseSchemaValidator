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
				let value = input[key];
				let {type} = value;
				console.log(type);
				switch (type) {
				case String:
					console.log(`String`);
					break;
				case Number:
					console.log(`Number`);
					break;
				case Object:
					console.log(`Object`);
					break;
				case mongoose.Schema.Types.ObjectId:
					console.log(`Mongoose ID`);
					break;
				default: 
					console.log(`Error`);
				}
			}
		});
	}
	catch (err) {
		throw err;
	}
};