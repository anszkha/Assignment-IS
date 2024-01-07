const MongoClient = require("mongodb").MongoClient;
const User = require("./user");
const Visitor = require("./visitor");
const Employee = require("./employee");
const Visitorlog = require("./visitorlog")


MongoClient.connect(
	// TODO: Connection bDzg3JhvVvZ59SME
	"mongodb://anis:bDzg3JhvVvZ59SME@ac-tftxgfr-shard-00-00.yyibtgi.mongodb.net:27017,ac-tftxgfr-shard-00-01.yyibtgi.mongodb.net:27017,ac-tftxgfr-shard-00-02.yyibtgi.mongodb.net:27017/?replicaSet=atlas-97k8ff-shard-0&ssl=true&authSource=admin", 
	{ useNewUrlParser: true },
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB');
	User.injectDB(client);
	Visitor.injectDB(client);
	Employee.injectDB(client);
	Visitorlog.injectDB(client);
})

const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const jwt = require ('jsonwebtoken');
function generateAccessToken(payload){
	return jwt.sign(payload, "secretcode", { expiresIn: '7d' });
}

function verifyToken(req, res, next) {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]

	if (token == null) return res.sendStatus(401)

	jwt.verify(token, "secretcode", (err, user) => {
		console.log(err);

		if (err) return res.sendStatus(403)

		req.user = user

		next()
	})
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Office Visitor Management System',
			version: '1.0.0',
		},
		components:{
			securitySchemes:{
				jwt:{
					type: 'http',
					scheme: 'bearer',
					in: "header",
					bearerFormat: 'JWT'
				}
			},
		security:[{
			"jwt": []
		}]
		}
	},
	apis: ['./main.js'], 
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /login/user:
 *   post:
 *     description: User Login
 *     tags:
 *     - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               password: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid username or password
 */

app.post('/login/user', async (req, res) => {
	console.log(req.body);

	let user = await User.login(req.body.username, req.body.password);
	
	if (user.status == ("invalid username" || "invalid password")) {
		res.status(401).send("invalid username or password");
		return
	}


	res.status(200).json({
		username: user.username,
		name: user.Name,
		officerno: user.officerno,
		rank: user.Rank,
		phone: user.Phone,
		token: generateAccessToken({ rank: user.Rank })

	});
})

/**
 * @swagger
 * /login/visitor:
 *   post:
 *     description: Visitor Login
 *     tags:
 *     - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               password: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid username or password
 */

app.post('/login/visitor', async (req, res) => {
	console.log(req.body);

	let user = await Visitor.login(req.body.username, req.body.password);

	if (user.status == ("invalid username" || "invalid password")) {
		res.status(401).send("invalid username or password");
		return
	}

	res.status(200).json({
		username: user.username,
		name: user.Name,
		age: user.Age,
		gender: user.Gender,
		reason: user.Reason,
		token: generateAccessToken({ username: user.username })
	});
})

/**
 * @swagger
 * /register/user:
 *   post:
 *     description: User Registration
 *     tags:
 *     - Registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               password: 
 *                 type: string
 *               name: 
 *                 type: string
 *               officerno:
 *                 type: string
 *               rank:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful registered
 *       401:
 *         description: There is an error during registration , Please try again
 */

app.post('/register/user', async (req, res) => {
	console.log(req.body);
	
	const reg = await User.register(req.body.username, req.body.password, req.body.name, req.body.officerno, req.body.rank, req.body.phone);
	console.log(reg);

	res.json({reg})
})

/**
 * @swagger
 * /register/visitor:
 *   post:
 *     description: Visitor Registration
 *     tags:
 *     - Registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               password: 
 *                 type: string
 *               name: 
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *               reason:
 *                 type: string
 *               telno:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful registered
 *       401:
 *         description: There is an error during registration , Please try again
 */

app.post('/register/visitor', async (req, res) => {
	console.log(req.body);

		const reg = await Visitor.register(req.body.username, req.body.password, req.body.name, req.body.age, req.body.gender, req.body.reason, req.body.telno);
		console.log(reg);
	
	res.json({reg})
})

app.use(verifyToken);

/**
 * @swagger
 * /register/Visitorlog:
 *   post:
 *     security:
 *      - jwt: []
 *     description: Create Visitorlog
 *     tags:
 *     - Registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               logno:
 *                 type: integer
 *               username: 
 *                 type: string
 *               inmateno: 
 *                 type: string
 *               dateofvisit:
 *                 type: string
 *               timein:
 *                 type: string
 *               timeout:
 *                 type: string
 *               purpose:
 *                 type: string
 *               officerno:
 *                 type: string

 *     responses:
 *       200:
 *         description: Successful registered
 *       401:
 *         description: There is an error during registration , Please try again
 */


 app.post('/register/visitorlog', async (req, res) => {
	console.log(req.body);

	if (req.user.rank == "officer" || "security"){
		const reg = await Visitorlog.register(req.body.logno, req.body.username, req.body.employeeno, req.body.dateofvisit, req.body.timein, req.body.timeout, req.body.purpose, req.body.officerno);
		res.status(200).send(reg)
	}
	else{
		res.status(403).send("You are unauthorized")
	}
})

/**
 * @swagger
 * /register/employee:
 *   post:
 *     security:
 *      - jwt: []
 *     description: Employee Registration
 *     tags:
 *     - Registration 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               employeeno: 
 *                 type: string
 *               firstname: 
 *                 type: string
 *               lastname: 
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *               position:
 *                 type: string
 *              
 *     responses:
 *       200:
 *         description: Successful registered
 *       401:
 *         description: There is an error during registration , Please try again
 */

 app.post('/register/employee', async (req,res)=>{
	console.log(req.body)

	if (req.user.rank == "officer"){
		const reg = await Employee.register(req.body.employeeno, req.body.firstname, req.body.lastname, req.body.age, req.body.gender, req.body.position );
		res.status(200).send(reg)
	}
	else{
		res.status(403).send("You are unauthorized")
	}

})

/**
 * @swagger
 * /user/update:
 *   patch:
 *     security:
 *      - jwt: []
 *     description: User Update
 *     tags:
 *     - Modification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               name: 
 *                 type: string
 *               officerno:
 *                 type: string
 *               rank:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful updated
 *       401:
 *         description: There is an error during updating , Please try again
 */

app.patch('/user/update', async (req, res) => {
	console.log(req.body);

	if (req.user.rank == "officer"){
		const update = await User.update(req.body.username, req.body.name, req.body.officerno, req.body.rank, req.body.phone);
		res.status(200).send(update)
	}
	else{
		res.status(403).send("You are unauthorized")
	}

})

/**
 * @swagger
 * /visitor/update:
 *   patch:
 *     security:
 *      - jwt: []
 *     description: Visitor Update
 *     tags:
 *     - Modification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               password: 
 *                 type: string
 *               name: 
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *               reason:
 *                 type: string
 *               telno:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful updated
 *       401:
 *         description: There is an error during updating , Please try again
 */

app.patch('/visitor/update', async (req, res) => {
	console.log(req.body);

	if (req.user.rank == "officer"){
		const update = await Visitor.update(req.body.username, req.body.name, req.body.age, req.body.gender, req.body.reason, req.body.telno);
		res.status(200).send(update)
	}
	else{
		res.status(403).send("You are unauthorized")
	}
})

/**
 * @swagger
 * /employee/update:
 *   patch:
 *     security:
 *      - jwt: []
 *     description: Employee Update
 *     tags:
 *     - Modification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               employeeno: 
 *                 type: string
 *               firstname: 
 *                 type: string
 *               lastname: 
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful updated
 *       401:
 *         description: There is an error during updating , Please try again
 */

 app.patch('/employee/update', async (req, res) => {
	console.log(req.body);
	if (req.user.rank == "officer"){
		const update = await Employee.update( req.body.employeeno, req.body.firstname, req.body.lastname, req.body.age, req.body.gender, req.body.reason);
		res.status(200).send(update)
	}
	else{
		res.status(403).send("You are unauthorized")
	}
})

/**
 * @swagger
 * /visitorlog/update:
 *   patch:
 *     security:
 *      - jwt: []
 *     description: Visitorlog Update
 *     tags:
 *     - Modification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               logno:
 *                 type: integer
 *               inmateno: 
 *                 type: string
 *               dateofvisit:
 *                 type: string
 *               timein:
 *                 type: string
 *               timeout:
 *                 type: string
 *               purpose:
 *                 type: string
 *               officerno:
 *                 type: string

 *     responses:
 *       200:
 *         description: Successful updated
 *       401:
 *         description: There is an error during updating , Please try again
 */

 app.patch('/visitorlog/update', async (req, res) => {
	console.log(req.body);

	if (req.user.username == req.body.username){
		const update = await Visitorlog.update(req.body.logno, req.body.employeeno, req.body.dateofvisit, req.body.timein, req.body.timeout, req.body.purpose, req.body.officerno);
		res.status(200).send(update)
	}
	else{
		res.status(403).send("You are unauthorized")
	}
})

/**
 * @swagger
 * /delete/user:
 *   delete:
 *     security:
 *      - jwt: []
 *     description: Delete User
 *     tags:
 *     - Remove(delete)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               
 *     responses:
 *       200:
 *         description: Successful delete
 *       401:
 *         description: There is an error during deleting , Please try again
 */

app.delete('/delete/user', async (req, res) => {
	if (req.user.rank == "officer"){
		const del = await User.delete(req.body.username)
		res.status(200).send(del)
	}
	else{
		res.status(403).send("You are unauthorized")
	}
})

/**
 * @swagger
 * /delete/visitor:
 *   delete:
 *     security:
 *      - jwt: []
 *     description: Delete Visitor
 *     tags:
 *     - Remove(delete)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               
 *     responses:
 *       200:
 *         description: Successful deleted
 *       401:
 *         description: There is an error during deleting , Please try again
 */

app.delete('/delete/visitor', async (req, res) => {
	if (req.user.rank == "officer"){
		const del = await Visitor.delete(req.body.username)
		res.status(200).send(del)
	}
	else{
		res.status(403).send("You are unauthorized")
	}
})

/**
 * @swagger
 * /delete/employee:
 *   delete:
 *     security:
 *      - jwt: []
 *     description: Delete Employee
 *     tags:
 *     - Remove(delete)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               employeeno: 
 *                 type: string
 *               
 *     responses:
 *       200:
 *         description: Successful deleted
 *       401:
 *         description: There is an error during deleting , Please try again
 */

 app.delete('/delete/employee', async (req, res) => {
	if (req.user.rank == "officer"){
		const del = await Employee.delete(req.body.employeeno)
		res.status(200).send(del)
	}
	else{
		res.status(403).send("You are unauthorized")
	}
})

/**
 * @swagger
 * /delete/visitorlog:
 *   delete:
 *     security:
 *      - jwt: []
 *     description: Delete Visitorlog
 *     tags:
 *     - Remove(delete)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               logno: 
 *                 type: integer
 *               
 *     responses:
 *       200:
 *         description: Successful delete
 *       401:
 *         description: There is an error during deleting , Please try again
 */

 app.delete('/delete/visitorlog', async (req, res) => {
	if (req.user.rank == "officer" || "security"){
		const del = await Visitorlog.delete(req.body.logno)
		res.status(200).send(del)
	}
	else{
		res.status(403).send("You are unauthorized")
	}
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:3000`)
})