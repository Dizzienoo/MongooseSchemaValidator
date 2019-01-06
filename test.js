const mongoose = require (`mongoose`);

let testobject = {
	name: {type: String, required: true},
	type: {type: String, uppercase: true, required: true},
	key: {type: Number, uppercase: true, required: true},
	profiles: {type: mongoose.Schema.Types.ObjectId, ref: `logicProfile`},
	result: {type: Object, ref: `contactCard`},
	error: {type: `unknown`},
	error2: `nothing`
};


function testf (input) {
	let keys = Object.keys(input);
	let systemErrors = [];
	keys.map(key => {
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
		// console.log(input[key].type || input[key][0].type);
	});
}

testf(testobject);