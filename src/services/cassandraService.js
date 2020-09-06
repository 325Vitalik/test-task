const cassandra = require("cassandra-driver");

const config = require("../../config");
const queries = require("../queries");

module.exports = {
	client: {},
	connect: async function () {
		const authProvider = new cassandra.auth.PlainTextAuthProvider(config.username, config.pawssword);
		this.client = new cassandra.Client({
			contactPoints: [`${config.host}:${config.port}`],
			localDataCenter: config.localDataCenter,
			authProvider: authProvider,
			keyspace: config.keyspace,
		});
		await this.client.connect();
	},
	getAllTables: async function () {
		return (await this.client.execute(queries.getTablesQuery(config.keyspace))).rows;
	},
	getAllColumns: async function (tableName) {
		return (await this.client.execute(queries.getColumnsQuery(config.keyspace, tableName))).rows;
	},
	getFirstItemOfTable: async function (tableName, clolumnName) {
		return (await this.client.execute(queries.getFirstItemQuery(config.keyspace, tableName, clolumnName))).rows[0];
	},
	getUDTDefinition: async function (type) {
		return (await this.client.execute(queries.getUDTQuery(config.keyspace, type))).rows;
	},
};
