const cassandra = require("cassandra-driver");
const fs = require("fs");

const jsonTypes = require("./types");
const config = require("./config");
const queries = require("./queries");

const authProvider = new cassandra.auth.PlainTextAuthProvider(config.username, config.pawssword);
const client = new cassandra.Client({
	contactPoints: [`${config.host}:${config.port}`],
	localDataCenter: "datacenter1",
	authProvider: authProvider,
	keyspace: config.keyspace,
});

client
	.connect()
	.catch((err) => console.error("Error occured while connecting to database:\n", err))
	.then(async () => {
		console.info("Connected successfully");
		var tables = await getAllTables();
		if (tables) {
			const result = [];
			for (table of tables) {
				const columns = await getAllColumns(table);
				if (columns) {
					result.push(await configureTableObject(table.table_name, columns));
				}
			}
			fs.writeFile("./result.json", JSON.stringify(result, undefined, 2), (err) => {
				if (err) {
					console.error("Error occured while saving result:\n", err);
					return;
				}
				console.log("Saved successfully in result.json");
			});
		}
	})
	.catch((err) => console.error("Error:\n", err));

async function getAllTables() {
	try {
		return (await client.execute(queries.getTablesQuery(config.keyspace))).rows;
	} catch (error) {
		console.error("Error occured while getting tables of database:\n", error);
	}
}

async function getAllColumns(table) {
	try {
		return (await client.execute(queries.getColumnsQuery(config.keyspace, table.table_name))).rows;
	} catch (error) {
		console.error(`Error occured while getting columns of table ${table.table_name} of database:\n`, error);
	}
}

async function configureTableObject(tableName, columns) {
	var obj = {
		$schema: "http://json-schema.org/draft-04/schema#",
		title: tableName,
		type: "object",
		properties: {},
	};

	for (let column of columns) {
		obj.properties[column.column_name] = await configureType(column.type, tableName, column.column_name);
	}

	return obj;
}

async function configureType(type, tableName, clolumnName) {
	if (jsonTypes.arrayTypes.includes(type.substring(0, type.indexOf("<")))) {
		return convertArray(type);
	} else if (type === "text") {
		try {
            const str = (await client.execute(queries.getFirstItemQuery(config.keyspace, tableName, clolumnName))).rows[0];
			const obj = JSON.parse(str[clolumnName]);
			const returnObj = {
				type: "object",
				properties: {},
			};
			for (prop in obj) {
				returnObj.properties[prop] = {
					type: typeof obj[prop],
				};
			}
			return returnObj;
		} catch {
			return {
				type: jsonTypes.primitiveTypes.get(type),
			};
		}
	} else {
		return {
			type: jsonTypes.primitiveTypes.get(type),
		};
	}
}

async function convertArray(type) {
	const typeOfItem = type.substring(type.indexOf("<") + 1, type.indexOf(">"));
	const obj = {
		type: "array",
		items: await configureType(typeOfItem),
	};
	return obj;
}
