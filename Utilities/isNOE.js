module.exports = obj => {
	try {
		if (obj == null || (Object.keys(obj).length <= 0 && typeof obj === `object` && !(obj instanceof Date)) || obj == undefined || obj === `` || obj === `undefined`) {
			return true;
		}
		return false;
	}
	catch (err) {
		console.log(err);
		return true;
	}
};


/**
 * For Debug
 * 	// if (obj == null) {
		// 	console.log(`1`);
		// 	return true;
		// }
		// if (Object.keys(obj).length <= 0 && typeof obj === `object` && !(obj instanceof Date)) {
		// 	console.log(`2`);
		// 	return true;
		// }
		// if (obj == undefined) {
		// 	console.log(`3`);
		// 	return true;
		// } 
		// if (obj === ``) {
		// 	console.log(`4`);
		// 	return true;
		// }
		// if (obj === `undefined`) {
		// 	console.log(`5`);
		// 	return true;
		// }
 */