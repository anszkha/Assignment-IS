const MongoClient = require("mongodb").MongoClient;
const User = require("./user");
const Document = require("./document");
const Project = require("./project");
const Staff = require("./staff");
const Visitor = require("./visitor");


const MongoURI = process.env.MONGODB_URI;

MongoClient.connect(
	// TODO: Connection yAs8O9sckieZkYeg
	"mongodb+srv://anis:enishawn0609@anszkha.yyibtgi.mongodb.net/?retryWrites=true&w=majority",
	{ useNewUrlParser: true },
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB');
	User.injectDB(client);
	Document.injectDB(client);
	Project.injectDB(client);
	Staff.injectDB(client);
	Visitor.injectDB(client);
})

const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

const jwt = require('jsonwebtoken');
function generateAccessToken(payload){
	return jwt.sign(payload, "my-super-secret",{expiresIn: '60s'});
}
function verifyToken(req,res, next){
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]

	console.log('Received token:', token);

	if(token == null) return res.sendStatus(401)

	jwt.verify(token, "my-super-secret",(err, user) => {
		console.log('Error during verification:', err);
		if(err) return res.sendStatus(403)
		req.user = user;
		console.log('Verified user:', req.user);
	

		next();
	});
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
//const { Router } = require("express");
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Office Management System',
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
	apis: ['./main.js'], // files containing annotations as above
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         id: 
 *           type: string
 *         phone: 
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Admin
 */

/**
 * @swagger
 * tags:
 *   name: Staff
 */

/**
 * @swagger
 * tags:
 *   name: Document Server
 */

/**
 * @swagger
 * tags:
 *   name: Project
 */

/**
 * @swagger
 * /register/document:
 *   post:
 *     description: File Register
 *     tags: [Document Server]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               id: 
 *                 type: string
 *               FileName: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful Register new user
 *       401:
 *         description: Invalid username or password
 */
 app.post('/register/document', async (req, res) => {
	console.log(req.body);
	const reg = await Document.register(
		req.body.id, 
		req.body.FileName, 
	);
	console.log(reg);
	res.json({reg})
})

/**
 * @swagger
 * /document/{id}:
 *   get:
 *     description: Get document by id
 *     tags: [Document Server]
 *     parameters:
 *       - in: path
 *         name: id 
 *         schema: 
 *           type: string
 *         required: true
 *         description: Document id
 *     responses:
 *       200:
 *         description: Search successful
 *       401:
 *         description: Invalid id 
 */

 app.get('/document/:id', async (req, res) => {
	console.log(req.documents);
	const cari = await Document.find(req.params.id);
	if (cari)
		res.status(200).json(cari)
	else 
		res.status(404).send("Invalid File Id")
});

/**
 * @swagger
 * /register/project:
 *   post:
 *     description: Project Register
 *     tags: [Project]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               id: 
 *                 type: string
 *               ProjectName: 
 *                 type: string
 *               staff:
 *                 type: string
 *     responses:
 *       200:
 *         description: Search successful
 *       401:
 *         description: Invalid id 
 */
 app.post('/register/project', async (req, res) => {
	console.log(req.body);
	const reg = await Project.register(
		req.body.id, 
		req.body.ProjectName,
		req.body.staff, 
	);
	console.log(reg);
	res.json({reg})
})

/**
 * @swagger
 * /project/{id}:
 *   get:
 *     description: Get project by id
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id 
 *         schema: 
 *           type: string
 *         required: true
 *         description: Project id
 *     responses:
 *       200:
 *         description: Search successful
 *       401:
 *         description: Invalid id
 */

 app.get('/project/:id', async (req, res) => {
	console.log(req.project);
	const cari = await Project.find(req.params.id);
	if (cari)
		res.status(200).json(cari)
	else 
		res.status(404).send("Invalid Project Id")
});

/**
 * @swagger
 * /login/admin:
 *   post:
 *     description: User Login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               id: 
 *                 type: string
 *               password: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid id or password
 */
app.post('/login/admin', async (req, res) => {
	console.log(req.body);

	let user = await User.login(req.body.id, req.body.password);

	if (user.status == ('invalid id' || 'invalid password')) {
		res.status(401).send("Invalid id or password");
		return
	}
	if (user.status == ('invalid password')) {
		res.status(401).send("Invalid id or password");
		return
	}	
	res.status(200).json({
		_id: user._id,
		id: user.id,
		name: user.name,
		division: user.division,
		token: generateAccessToken({id: user.id,role: user.role}),

	});
})
/**
 * @swagger
 * /login/staff:
 *   post:
 *     description: User Login
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               id: 
 *                 type: string
 *               password: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid id or password
 */
 app.post('/login/staff', async (req, res) => {
	console.log(req.body);

	let staff = await Staff.login(req.body.id, req.body.password);

	if (staff.status == ('invalid id')) {
		res.status(401).send("Invalid id or password");
		return
	}
	if (staff.status == ('invalid password')) {
		res.status(401).send("Invalid id or password");
		return
	}
	res.status(200).json({
		_id: staff._id,
		id: staff.id,
		name: staff.name,
		division: staff.division,
	});
})
/**
 * @swagger
 * /register/admin:
 *   post:
 *     description: User Register
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               id: 
 *                 type: string
 *               password: 
 *                 type: string
 *               name: 
 *                 type: string
 *               division:
 *                 type: string
 *               rank: 
 *                 type: string
 *               phone: 
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful Register New Id
 *       401:
 *         description: Invalid id or password
 */
app.post('/register/admin', async (req, res) => {
	console.log(req.body);
	const reg = await User.register(
		req.body.id, 
		req.body.password, 
		req.body.name, 
		req.body.division, 
		req.body.rank, 
		req.body.phone, 
		req.body.role,
	);
	console.log(reg);
	res.json({reg})
})
/**
 * @swagger
 * /register/staff:
 *   post:
 *     description: User Register
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               id: 
 *                 type: string
 *               password: 
 *                 type: string
 *               name: 
 *                 type: string
 *               division:
 *                 type: string
 *               rank: 
 *                 type: string
 *               phone: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful Register New Id
 *       401:
 *         description: Invalid id or password
 */
 app.post('/register/staff', async (req, res) => {
	console.log(req.body);
	const reg = await Staff.register(
		req.body.id, 
		req.body.password, 
		req.body.name, 
		req.body.division, 
		req.body.rank, 
		req.body.phone,
	);
	console.log(reg);
	res.json({reg})
})

/**
 * @swagger
 * /update/admin:
 *   patch:
 *     description: User Update
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               id: 
 *                 type: string
 *               password: 
 *                 type: string
 *               name: 
 *                 type: string
 *               division:
 *                 type: string
 *               rank: 
 *                 type: string
 *               phone: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful Update user
 *       401:
 *         description: Invalid id or password
 */
app.patch('/update/admin', async (req, res) => {
	console.log(req.body);

	const user = await User.login(req.body.id, req.body.password);

	if (user.status == ('invalid id' || 'invalid password')) {
		res.status(401).send("Invalid id or password");
		return
	}
	const update =await User.update(
		req.body.id,
		req.body.name, 
		req.body.division, 
		req.body.rank, 
		req.body.phone
	);
	res.json({update})
})

/**
 * @swagger
 * /update/staff:
 *   patch:
 *     description: User Update
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               id: 
 *                 type: string
 *               password: 
 *                 type: string
 *               name: 
 *                 type: string
 *               division:
 *                 type: string
 *               rank: 
 *                 type: string
 *               phone: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful Update user
 *       401:
 *         description: Invalid id or password
 */
 app.patch('/update/staff', async (req, res) => {
	console.log(req.body);

	let staff = await Staff.login(req.body.id, req.body.password);

	if (staff.status == ('invalid id' || 'invalid password')) {
		res.status(401).send("Invalid id or password");
		return
	}
	const update =await Staff.update(
		req.body.id,
		req.body.name, 
		req.body.division, 
		req.body.rank, 
		req.body.phone
	);
	res.json({update})
})

app.use(verifyToken);

/**
 * @swagger
 * /staff/{id}:
 *   get:
 *     security:
 *      - jwt: []    
 *     description: Get staff by id
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id 
 *         schema: 
 *           type: string
 *         required: true
 *         description: Staff id
 *     responses:
 *       200:
 *         description: Search successful
 *       401:
 *         description: Invalid id
 */

app.get('/staff/:id', async (req, res) => {
	console.log(req.staff);
	const cari = await Staff.find(req.params.id);
	if (cari)
		res.status(200).json(cari)
	else 
		res.status(404).send("Invalid Staff Id")
});
/**
 * @swagger
 * /delete/admin:
 *   delete:
 *     security:
 *      - jwt: []
 *     description: Delete User
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               id: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Delete successful
 *       401:
 *         description: Invalid id
 */
app.delete('/delete/admin',async (req,res) => {
	console.log(req.body);
	let buang = await User.delete(req.body.id);
	res.json({buang})
})

/**
 * @swagger
 * /delete/staff:
 *   delete:
 *     security:
 *      - jwt: []
 *     description: Delete User
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               id: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Delete successful
 *       401:
 *         description: Invalid id
 */
 app.delete('/delete/staff',async (req,res) => {
	console.log(req.body);
	let buang = await Staff.delete(req.body.id);
	res.json({buang})
})

/**
 * @swagger
 * /delete/document:
 *   delete:
 *     security:
 *      - jwt: []
 *     description: Delete File
 *     tags: [Document Server]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               id: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Delete successful
 *       401:
 *         description: Invalid id
 */
 app.delete('/delete/document',async (req,res) => {
	console.log(req.body);
	let buang = await Document.delete(req.body.id);
	res.json({buang})
})

// Visitor Management Endpoints
/**
 * @swagger
 * tags:
 *   name: Visitor
 */

/**
 * @swagger
 * /register/visitor:
 *   post:
 *     description: Register a new visitor
 *     tags: [Visitor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               company:
 *                 type: string
 *               purpose:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful registration
 *       401:
 *         description: Invalid data
 */
app.post('/register/visitor', async (req, res) => {
	console.log(req.body);
	const reg = await Visitor.register(
	  req.body.id,
	  req.body.name,
	  req.body.company,
	  req.body.purpose,
	);
	console.log(reg);
	res.json({ reg });
  });
  
  /**
   * @swagger
   * /visitor/{id}:
   *   get:
   *     description: Get visitor by id
   *     tags: [Visitor]
   *     parameters:
   *       - in: path
   *         name: id 
   *         schema: 
   *           type: string
   *         required: true
   *         description: Visitor id
   *     responses:
   *       200:
   *         description: Search successful
   *       401:
   *         description: Invalid id
   */
  app.get('/visitor/:id', async (req, res) => {
	console.log(req.visitor);
	const findVisitor = await Visitor.find(req.params.id);
	if (findVisitor)
	  res.status(200).json(findVisitor)
	else
	  res.status(404).send("Invalid Visitor Id")
  });
  
  /**
   * @swagger
   * /delete/visitor:
   *   delete:
   *     security:
   *      - jwt: []
   *     description: Delete Visitor
   *     tags: [Visitor]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema: 
   *             type: object
   *             properties:
   *               id: 
   *                 type: string
   *     responses:
   *       200:
   *         description: Delete successful
   *       401:
   *         description: Invalid id
   */
  app.delete('/delete/visitor', async (req, res) => {
	console.log(req.body);
	const deleteVisitor = await Visitor.delete(req.body.id);
	res.json({ deleteVisitor });
  });

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
app.get('/admin/only', async (req, res) => {
	console.log(req.user);

	if (req.user.role == 'admin')
		res.status(200).send('Admin only')
	else
		res.status(403).send('Unauthorized')
})
