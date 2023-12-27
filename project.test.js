const MongoClient = require("mongodb").MongoClient;
const Project = require("./project")


describe("Project Management", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb://anis:yAs8O9sckieZkYeg@ac-nlxl7jy-shard-00-00.glzpa13.mongodb.net:27017,ac-nlxl7jy-shard-00-01.glzpa13.mongodb.net:27017,ac-nlxl7jy-shard-00-02.glzpa13.mongodb.net:27017/?replicaSet=atlas-es7nad-shard-0&ssl=true&authSource=admin",
			{ useNewUrlParser: true },
		);
		Project.injectDB(client);
	})
	
	afterAll(async () => {
		await Project.delete("test");
		await client.close();

	})
	
	test("New project registration", async () => {
		const res = await Project.register("test", "ProjectName", "Husna");
		expect(res.insertedId).not.toBeUndefined();

	})
	

	test("Duplicate id", async () => {
		const res = await Project.register("test", "ProjectName", "Husna")
		expect(res).toEqual({ "status": "duplicate id" })
		
	})

});
