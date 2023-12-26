let project;
class Project {
	static async injectDB(conn) {
		project = await conn.db("OfficeMS").collection("Project")
	}

	static async register(id, ProjectName, staff) {
		// TODO: Check if username exists
		const duplicate = await project.findOne({ id: id })
		
		if (duplicate) {
			return { status: "duplicate id" }
		}

		// TODO: Save user to database
		return await project.insertOne({
			id: id,
			ProjectName: ProjectName,
			staff: staff,
		});
	}
	static async find(id) {
		return project.findOne({id: id})
	}

	static async delete(id) {
		return project.deleteOne({id: id})
	}
}
module.exports = Project;