//const bcrypt = require('bcrypt');

let documents;

class Document {
	static async injectDB(conn) {
		documents = await conn.db("OfficeMS").collection("Document_Server");
	}
	/**
	 * @remarks
	 * This method is not implemented yet. To register a new user, you need to call this method.
	 * 
	 * @param {*} username 
	 * @param {*} password 
	 * @param {*} phone 
	 */
	static async register(id, FileName) {
		// TODO: Check if username exists
		const duplicate = await documents.findOne({ id: id });
		
		if (duplicate) {
			return { status: "duplicate id" }
		}

		// TODO: Save user to database
		return await documents.insertOne({
			id: id,
			FileName: FileName,
		});
	};

	static async delete(id) {
		return documents.deleteOne({id: id})
	}

	static async find(id) {
		return documents.findOne({id: id})
	}
}
module.exports = Document;