const inArray = require (`./Utilities/inArray`);
const isNOE = require (`./Utilities/isNOE`);

const mongoose = require (`mongoose`);

module.exports = function (schema) {
	try {
		let errors = checklayer(schema, ``, {});
		if (!isNOE(errors)) {
			throw Error(`Schema has the following errors: ${JSON.stringify(errors)}`);
		}
	}
	catch (err) {
		throw err;
	}
};

const checklayer = function (schema, path, errObj) {
	try {
		if (typeof schema !== `object`) {return false;}
		let schemaKeys = Object.keys(schema);
		schemaKeys.map(key => {
			if (isNOE(path)) {path = ``;}
			let originalpath = path;
			if (!isNOE(schema[key].type)) {
				let valid = isValidType(schema[key].type);
				if (!valid) {
					path = path + `${key}`;
					errObj[path] = `Type provided is Unsupported`;
				}
				return true;
			}
			else if (isNOE(schema[key])) {
				path = path + `${key}`;
				errObj[path] = `No Type has been provided`;
			}
			else {
				path = path + `${key}.`;
				let check = checklayer(schema[key], path, errObj);
				if (check === false) {
					path = path.substring(0, path.lastIndexOf(`.`));
					path = path.substring(0, path.lastIndexOf(`.`));
					errObj[path] = `No Type has been provided`;
				}
			}
			path = originalpath;
		});
		return errObj;
	}
	catch (err) {
		throw err;
	}
};

const isValidType = function (type) {
	try {
		if (inArray(type, [
			String,
			Number,
			Boolean,
			mongoose.Schema.Types.ObjectId,
			Date
		])) {
			return true;
		}
		return false;
	}
	catch (err) {
		return false;
	}
};