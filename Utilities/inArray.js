module.exports = function (needle, haystack) {
	try {
		if (!Array.isArray(haystack)) {
			haystack = [haystack];
		}
		let length = haystack.length;
		for(let i = 0; i < length; i++) {
			if(haystack[i].toString() == needle.toString()) {return true;}
		}
		return false;
	}
	catch (err) {
		return false;
	}
};