const config = require("../../config");
const queries = require("../queries");
const jsonTypes = require("../types");

let dbService;

module.exports = {
	setDbService: function (service) {
		dbService = service;
	},
	convertTable: configureTableObject,
};

async function configureTableObject(tableName, columns) {
	var obj = {
		$schema: "http://json-schema.org/draft-04/schema#",
		title: tableName,
		type: "object",
		properties: {},
	};

	for (let column of columns) {
		obj.properties[column.column_name] = await convertType(column.type, tableName, column.column_name);
	}

	return obj;
}

async function convertType(type, tableName, clolumnName) {
	if (type.substring(0, type.indexOf("<")) === "frozen") {
		const itemType = getInnerValue(type);
		return await convertType(itemType, tableName, clolumnName);
	}

	if (jsonTypes.arrayTypes.includes(type.substring(0, type.indexOf("<")))) {
		return convertArray(type);
	} else if (type === "text") {
		try {
			return await convertTextIfJsonObject(tableName, clolumnName);
		} catch (err) {
			return {
				type: jsonTypes.primitiveTypes.get(type),
			};
		}
	} else if (jsonTypes.checkIfMap(type)) {
		return convertMap(type);
	} else if (jsonTypes.primitiveTypes.get(type)) {
		return {
			type: jsonTypes.primitiveTypes.get(type),
		};
	} else {
		const typeData = await dbService.getUDTDefinition(type);
		if (typeData.length === 0) {
			console.error(`user defined type ${type} not found`);
			return;
		}
		return await convertUDT(typeData[0]);
	}
}

async function convertArray(type) {
	const typeOfItem = getInnerValue(type);
	const obj = {
		type: "array",
		items: await convertType(typeOfItem),
	};
	return obj;
}

function getInnerValue(type) {
	const firstIndex = type.indexOf("<") + 1;
	let lastIndex = type.indexOf(">");
	while (type[lastIndex + 1] === ">") {
		lastIndex++;
	}
	return type.substring(firstIndex, lastIndex);
}

async function convertTextIfJsonObject(tableName, clolumnName) {
	const str = await dbService.getFirstItemOfTable(tableName, clolumnName);
	const obj = JSON.parse(str[clolumnName]);
	return configureObject(obj);
}

function configureObject(obj) {
	const returnObj = {
		type: "object",
		properties: {},
	};
	for (prop in obj) {
		if (obj[prop] instanceof Array) {
			returnObj.properties[prop] = {
				type: "array",
				items: {
					type: typeof obj[prop][0],
				},
			};
		} else if (typeof obj[prop] === "object") {
			returnObj.properties[prop] = configureObject(obj[prop]);
		} else {
			returnObj.properties[prop] = {
				type: typeof obj[prop],
			};
		}
	}
	return returnObj;
}

async function convertMap(type) {
	const keyValue = type
		.substring(type.indexOf("<") + 1, type.indexOf(">"))
		.split(",")
		.map((t) => t.trim());
	const obj = {
		type: "object",
		additionalProperties: {},
	};
	obj.additionalProperties = await convertType(keyValue[1]);
	return obj;
}

async function convertUDT(udt) {
	const resultObj = {
		type: "object",
		properties: {},
	};
	for (let i = 0; i < udt.field_names.length; i++) {
		resultObj.properties[udt.field_names[i]] = await convertType(udt.field_types[i]);
	}
	return resultObj;
}
