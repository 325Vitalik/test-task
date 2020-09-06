const convertion = require("./src/helpers/convertionHelper");
const saving = require("./src/helpers/fileHelper");
const cassandraService = require("./src/services/cassandraService");

cassandraService
	.connect()
	.catch((err) => console.error("Error occured while connecting to database:\n", err))
	.then(async (client) => {
		console.info("Connected successfully");

		convertion.setClient(client);

		var tables = await getTables(client);
		if (tables) {
			const result = [];

			for (let table of tables) {
				const columns = await getColumns(client, table);
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
		saving.save("./result.json", obj);
		console.log("Saved successfully in result.json");
	} catch {
		console.error("Error occured while saving result:\n", err);
	}
}

async function getTables(client) {
	try {
		return await cassandraService.getAllTables(client);
	} catch (error) {
		console.error("Error occured while getting tables");
	}
}

async function getColumns(client, table) {
	try {
		return await cassandraService.getAllColumns(client, table.table_name);
	} catch (error) {
		console.log(`Error occured while getting columns of table ${table.table_name}`);
	}
}
