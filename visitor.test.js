const MongoClient = require("mongodb").MongoClient;
const Visitor = require("./visitor")

describe("User Account Management", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://anis:yAs8O9sckieZkYeg@cluster0.glzpa13.mongodb.net/?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		Visitor.injectDB(client);
	})

	afterAll(async () => {
		await Visitor.delete("test");
		await client.close();
	})

	test("New user registration", async () => {
		const res = await Visitor.register("test", "password", "+010-1234-5678");
		expect(res.insertedId).not.toBeUndefined();
	})

	test("Duplicate id", async () => {
		const res = await Visitor.register("test", "password")
		expect(res).toEqual({ "status": "duplicate id" })
	})

	test("Visitor login invalid id", async () => {
		const res = await Visitor.login("test-fail", "password")
		expect(res).toEqual({ "status": "invalid id" })
	})

	test("Visitor login invalid password", async () => {
		const res = await Visitor.login("test", "password-fail")
		expect(res).toEqual({ "status": "invalid password" })
	})

	test("Visitor login successfully", async () => {
		const res = await Visitor.login("test", "password")
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