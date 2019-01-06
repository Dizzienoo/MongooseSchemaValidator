module.exports = obj => {
	try {
		if (obj == null || (Object.keys(obj).length <= 0 && typeof obj === `object`) || obj == undefined || obj === `` || obj === `undefined`) {
			return true;
		}
		return false;
	}
	catch (err) {
		console.log(err);
		return true;
	}
};