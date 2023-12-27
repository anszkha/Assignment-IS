const MongoClient = require("mongodb").MongoClient;
const Document = require("./document")

describe("Document Management", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb://anis:yAs8O9sckieZkYeg@ac-nlxl7jy-shard-00-00.glzpa13.mongodb.net:27017,ac-nlxl7jy-shard-00-01.glzpa13.mongodb.net:27017,ac-nlxl7jy-shard-00-02.glzpa13.mongodb.net:27017/?replicaSet=atlas-es7nad-shard-0&ssl=true&authSource=admin",
			{ useNewUrlParser: true },
		);
		Document.injectDB(client);
	})

	afterAll(async () => {
		await Document.delete("test");
		await client.close();
	})

	test("New document registration", async () => {
		const res = await Document.register("test", "FileName");
		expect(res.insertedId).not.toBeUndefined();
	})

	test("Duplicate id", async () => {
		const res = await Document.register("test", "FileName")
		expect(res).toEqual({ "status": "duplicate id" })
	})

});