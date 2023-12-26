const MongoClient = require("mongodb").MongoClient;
const Staff = require("./staff")

describe("Staff Account Management", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb://anis:yAs8O9sckieZkYeg@ac-nlxl7jy-shard-00-00.glzpa13.mongodb.net:27017,ac-nlxl7jy-shard-00-01.glzpa13.mongodb.net:27017,ac-nlxl7jy-shard-00-02.glzpa13.mongodb.net:27017/?replicaSet=atlas-es7nad-shard-0&ssl=true&authSource=admin",
			{ useNewUrlParser: true },
		);
		Staff.injectDB(client);
	})

	afterAll(async () => {
		await Staff.delete("test");
		await client.close();
	})

	test("New user registration", async () => {
		const res = await Staff.register("test", "password", "+010-1234-5678");
		expect(res.insertedId).not.toBeUndefined();
	})

	test("Duplicate id", async () => {
		const res = await Staff.register("test", "password")
		expect(res).toEqual({ "status": "duplicate id" })
	})

	test("User login invalid id", async () => {
		const res = await Staff.login("test-fail", "password")
		expect(res).toEqual({ "status": "invalid id" })
	})

	test("User login invalid password", async () => {
		const res = await Staff.login("test", "password-fail")
		expect(res).toEqual({ "status": "invalid password" })
	})

	test("User login successfully", async () => {
		const res = await Staff.login("test", "password")
		expect(res).not.toEqual(
			expect.objectContaining({
				id: expect.any(String),
				password: expect.any(String),
				name: expect.any(String),
				division: expect.any(String),
				rank: expect.any(String),
				phone: expect.any(String),
			})
		);
	})
});