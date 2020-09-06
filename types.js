module.exports = {
    arrayTypes: ['list', 'set', 'tuple'],
    primitiveTypes: new Map([
        ['ascii', 'string'],
        ['bigint', 'integer'],
        ['blob', 'string'],
        ['boolean', 'boolean'],
        ['date', 'string'],
        ['decimal', 'number'],
        ['double', 'number'],
        ['float', 'number'],
        ['inet', 'string'],
        ['int', 'integer'],
        //['list', 'array'],
        ['map', 'object'], // * example below
        ['smallint', 'integer'],
        //['set', 'array'],
        ['text', 'string'],
        ['time', 'string'],
        ['timestamp', 'string'],
        ['timeuuid', 'string'],
        ['tinyint', 'integer'],
        //['tuple', 'array'],
        ['UDT', 'object'], // * User-Defined-Type
        ['uuid', 'string'],
        ['varchar', 'string'],
        ['varint', 'integer']
    ])
}