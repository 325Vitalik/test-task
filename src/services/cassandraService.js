const cassandra = require("cassandra-driver");

const config = require("../../config");
const queries = require("../queries");

module.exports = {
	connect: connect,
	getAllTables: getAllTables,
	getAllColumns: getAllColumns,
};

async function connect() {
	const authProvider = new cassandra.auth.PlainTextAuthProvider(config.username, config.pawssword);
	const client = new cassandra.Client({
		contactPoints: [`${config.host}:${config.port}`],
		localDataCenter: config.localDataCenter,
		authProvider: authProvider,
		keyspace: config.keyspace,
	});
    await client.connect();
    return client;
}

async function getAllTables(client) {
	return (await client.execute(queries.getTablesQuery(config.keyspace))).rows;
}

async function getAllColumns(client, tableName) {
	return (await client.execute(queries.getColumnsQuery(config.keyspace, tableName))).rows;
}
