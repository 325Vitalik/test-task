const convertion = require("./src/helpers/convertionHelper");
const fileHelper = require("./src/helpers/fileHelper");
const cassandraService = require("./src/services/cassandraService");

cassandraService
	.connect()
	.catch((err) => {
		console.error("Error occured while connecting to database:");
		throw err;
	})
	.then(async () => {
		console.info("Connected successfully");

		convertion.setDbService(cassandraService);

		var tables = await getTables();
		if (tables) {
			const result = [];

			for (let table of tables) {
				const columns = await getColumns(table);
				if (columns) {
					result.push(await convertion.convertTable(table.table_name, columns));
				}
			}

			saveResults(result);
		}
	})
	.catch((err) => console.error("Error:\n", err));

function saveResults(obj) {
	try {
		fileHelper.save("./result.json", obj);
		console.log("Saved successfully in result.json");
	} catch {
		console.error("Error occured while saving result:\n", err);
	}
}

async function getTables() {
	try {
		return await cassandraService.getAllTables();
	} catch (error) {
		console.error("Error occured while getting tables");
	}
}

async function getColumns(table) {
	try {
		return await cassandraService.getAllColumns(table.table_name);
	} catch (error) {
		console.log(`Error occured while getting columns of table ${table.table_name}`);
	}
}
