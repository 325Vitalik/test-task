const fs = require("fs");

module.exports = {
	save: saveInFile,
};

function saveInFile(fileName, obj) {
	fs.writeFileSync(fileName, JSON.stringify(obj, undefined, 2), (err) => {
		if (err) {
			throw err;
		}
	});
}
