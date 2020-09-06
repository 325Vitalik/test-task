const assert = require("assert");
const rewire = require("rewire");
const convertion = rewire("../src/helpers/convertionHelper.js");
const fileHelper = require("../src/helpers/fileHelper");
const fs = require("fs");

describe("convertionHelper", () => {
    describe("convert simple types", () => {
        it('should return {type: "string"} when type is text', async () => {
            const res = await convertion.__get__("convertType")("text");
            assert.equal(res.type, "string");
        });
        it('should return {type: "string"} when type is blob', async () => {
            const res = await convertion.__get__("convertType")("blob");
            assert.equal(res.type, "string");
        });
        it('should return {type: "string"} when type is date', async () => {
            const res = await convertion.__get__("convertType")("date");
            assert.equal(res.type, "string");
        });
        it('should return {type: "string"} when type is inet', async () => {
            const res = await convertion.__get__("convertType")("inet");
            assert.equal(res.type, "string");
        });
        it('should return {type: "string"} when type is time', async () => {
            const res = await convertion.__get__("convertType")("time");
            assert.equal(res.type, "string");
        });
        it('should return {type: "string"} when type is timestamp', async () => {
            const res = await convertion.__get__("convertType")("timestamp");
            assert.equal(res.type, "string");
        });
        it('should return {type: "string"} when type is timeuuid', async () => {
            const res = await convertion.__get__("convertType")("timeuuid");
            assert.equal(res.type, "string");
        });
        it('should return {type: "string"} when type is uuid', async () => {
            const res = await convertion.__get__("convertType")("uuid");
            assert.equal(res.type, "string");
        });
        it('should return {type: "string"} when type is varchar', async () => {
            const res = await convertion.__get__("convertType")("varchar");
            assert.equal(res.type, "string");
        });
        it('should return {type: "integer"} when type is bigint', async () => {
            const res = await convertion.__get__("convertType")("bigint");
            assert.equal(res.type, "integer");
        });
        it('should return {type: "integer"} when type is int', async () => {
            const res = await convertion.__get__("convertType")("int");
            assert.equal(res.type, "integer");
        });
        it('should return {type: "integer"} when type is smallint', async () => {
            const res = await convertion.__get__("convertType")("smallint");
            assert.equal(res.type, "integer");
        });
        it('should return {type: "integer"} when type is tinyint', async () => {
            const res = await convertion.__get__("convertType")("tinyint");
            assert.equal(res.type, "integer");
        });
        it('should return {type: "integer"} when type is varint', async () => {
            const res = await convertion.__get__("convertType")("varint");
            assert.equal(res.type, "integer");
        });
        it('should return {type: "number"} when type is decimal', async () => {
            const res = await convertion.__get__("convertType")("decimal");
            assert.equal(res.type, "number");
        });
        it('should return {type: "number"} when type is double', async () => {
            const res = await convertion.__get__("convertType")("double");
            assert.equal(res.type, "number");
        });
        it('should return {type: "number"} when type is float', async () => {
            const res = await convertion.__get__("convertType")("float");
            assert.equal(res.type, "number");
        });
        it('should return {type: "boolean"} when type is float', async () => {
            const res = await convertion.__get__("convertType")("boolean");
            assert.equal(res.type, "boolean");
        });
    });

    describe("convert arrays", () => {
        it('should return {type: "array", "items": { "type": "string"}} when type is "list<text>"', async () => {
            const res = await convertion.__get__("convertType")("list<text>");
            assert.equal(res.type, "array");
            assert.equal(res.items.type, "string");
        });
        it('should return {type: "array", "items": { "type": "string"}} when type is "set<text>"', async () => {
            const res = await convertion.__get__("convertType")("set<text>");
            assert.equal(res.type, "array");
            assert.equal(res.items.type, "string");
        });
        it('should return {type: "array", "items": { "type": "integer"}} when type is "list<int>"', async () => {
            const res = await convertion.__get__("convertType")("list<int>");
            assert.equal(res.type, "array");
            assert.equal(res.items.type, "integer");
        });
        it('should return {type: "array", "items": { "type": "string"}} when type is "list<boolean>"', async () => {
            const res = await convertion.__get__("convertType")("list<boolean>");
            assert.equal(res.type, "array");
            assert.equal(res.items.type, "boolean");
        });
    });

    describe("getInnerValue", () => {
        it('should return "text" when type is "set<text>"', async () => {
            assert.equal(await convertion.__get__("getInnerValue")("set<text>"), "text")
        });
        it('should return "frozen<text>" when type is "set<frozen<text>>"', async () => {
            assert.equal(await convertion.__get__("getInnerValue")("set<frozen<text>>"), "frozen<text>")
        });
    });
});

describe("fileHelper", () => {
    it("serialize and save data in result.json", () => {
        const obj = {
            one: 1,
            two: "two",
            three: ["one", "two", "tree"],
            four: {
                innerOne: 'one',
                innerTwo: 2
            }
        }
        fileHelper.save('./result.json', obj);
        const data = fs.readFileSync('./result.json');
        const deserializedObj = JSON.parse(data);
        assert.equal(obj.one, deserializedObj.one);
        assert.equal(obj.two, deserializedObj.two);
        for(let i = 0; i < 3; i++){
            assert.equal(obj.three[i], deserializedObj.three[i]);
        }
        assert.equal(obj.four.innerOne, deserializedObj.four.innerOne);
        assert.equal(obj.four.innerTwo, deserializedObj.four.innerTwo);
    })
})