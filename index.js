'use strict'
const cassandra = require("cassandra-driver");
const fs = require("fs");

const convertion = require("./src/helpers/convertionHelper");
const config = require("./config");
const queries = require("./src/queries");

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
        convertion.setClient(client);
		var tables = await getAllTables();
		if (tables) {
			const result = [];
			for (let table of tables) {
				const columns = await getAllColumns(table);
				if (columns) {
					result.push(await convertion.convertTable(table.table_name, columns));
				}
			}
			fs.writeFile("./result.json", JSON.stringify(result, undefined, 2), (err) => {
				if (err) {
					console.error("Error occured while saving result:\n", err);
					return;
				}
				console.log("Saved successfully in result.json");
			});
		} else {
            console.log("There is no tables");
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