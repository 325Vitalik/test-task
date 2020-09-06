module.exports = {
	getTablesQuery: function (keyspace) {
		return `SELECT * FROM system_schema.tables WHERE keyspace_name = '${keyspace}'`;
	},
	getColumnsQuery: function (keyspace, tableName) {
		return `SELECT * FROM system_schema.columns WHERE keyspace_name = '${keyspace}' AND table_name = '${tableName}';`;
	},
	getFirstItemQuery: function (keyspace, tableName, columnName) {
		return `SELECT ${columnName} FROM ${keyspace}.${tableName} LIMIT 1`;
	},
	getUDTQuery: function (keyspace, typeName) {
		return `SELECT * FROM system_schema.types WHERE keyspace_name = '${keyspace}' AND type_name = '${typeName}'`;
	},
};
