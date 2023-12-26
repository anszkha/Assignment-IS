const bcrypt = require('bcrypt');

let users;


class User {
	static async injectDB(conn) {
		users = await conn.db("OfficeMS").collection("users")
	}

	/**
	 * @remarks
	 * This method is not implemented yet. To register a new user, you need to call this method.
	 * 
	 * @param {*} username 
	 * @param {*} password 
	 * @param {*} phone 
	 */
	static async register(id, password, name, division, rank, phone, role) {
		// TODO: Check if username exists
		const duplicate = await users.findOne({ id: id })
		
		if (duplicate) {
			return { status: "duplicate id" }
		}

		// TODO: Hash password
		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(password, salt)

		// TODO: Save user to database
		return await users.insertOne({
			id: id,
			password: hashed,
			name: name,
			division: division,
			rank: rank,
			phone: phone,
			role: role,
		});
	}

	static async login(id, password) {
		// TODO: Check if username exists
		const user = await users.findOne({ id: id })

		if(!user) {
			return { status: "invalid id" }
		}

		// TODO: Validate password
		const valid = await bcrypt.compare(password, user.password)
		
		if(!valid) {
			return { status: "invalid password" }
		}

		// TODO: Return user object
		return user;
	}

	static async delete(id) {
		return users.deleteOne({id: id})
	}
	static async update(id, name, division, rank, phone) {
		return users.updateOne({id: id},{$set:{
			name: name,
			division: division,
			rank: rank,
			phone: phone,
		}})
	}
	static async find(id) {
		return users.findOne({id: id})
	}
}
module.exports = User;
