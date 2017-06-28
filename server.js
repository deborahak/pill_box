const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

let verifyToken = require('./middlewares/verifyToken');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


const {router: usersRouter} = require('./users');

const {User} = require('./users/models');

mongoose.Promise = global.Promise;

const{PORT, DATABASE_URL, jwt_secret} = require('./config');


app.set('view engine', 'ejs');


/// TEMPLATE VIEWS!
app.get('/', (req, res) => {
	res.render('index')
});

app.get('/signup', (req,res) => {
	res.render('signup')
});

app.get('/login', (req, res) => {
	res.render('login')
});
app.get('/medications', (req, res) => res.render('medications'))

app.get('/add_meds', (req, res) =>{
	res.render('add_meds')
});
// app.get('/edit_meds/:id', (req,res)=> {
// 	// res.render('edit_meds', {
// 	// 	id: req.params.id
// 	// })
// 	res.render('medications');
// });

/// API Endpoints!!!
app.get('/api/medications', verifyToken, (req, res) => {
	const filters = {};
	console.log(req.query)
	if (req.query.name) {
		filters['name'] = req.query['name'];
	}
	console.log(req.decoded, 'what is this?');
	const {username} = req.decoded;
	User.findOne({username}) // User.find( { username: username })
	.exec()
	.then(user => {
		res.json({error: false, medications: user.medications});
	}).catch(err => res.status(500).json({message: "Internal server error"}));;
	// Medication
	// 	.find(filters)
	// 	.limit(15)
	// 	.exec()
	// 	.then(medications => {
	// 		res.json({error: false,
	// 			medications: medications.map(
	// 				(medication) => medication.apiRepr())
	// 		});
	// 	})
	// 	.catch(err => {
	// 		console.error(err);
	// 		res.status(500).json({message: 'Internal server error'})
	// 	});
});

app.post('/api/medications', verifyToken, (req, res) => {
	const requiredFields = ['name', 'dose', 'timing', 'description'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	/*
	Notes: When dealing with a subdoc
	- get the parent (user)first.
	- we push the new information into the user.
	- we save the parent (user)
	*/

	console.log(req.decoded, 'What is this?');

	const {username} = req.decoded;
	User.findOne({username})
	.exec()
	.then(user => {
		// user -> parent
		// parent.children.push
		user.medications.push({
			name:req.body.name,
			dose:req.body.dose,
			timing:req.body.timing,
			description:req.body.description});
		// pick out the last medication
		const medication = user.medications[user.medications.length-1];

		/* aside, hypothetical */
		// var arr = [1,2,3,8];
		 // where the last thing is "located"?
		 // arr[3] -> 
		 // tips: arr.length -> the size of the array (counts the items)
		 // length not position/index.
		 // Position: 3 ==> eight!!
		 // length: 4 - 1

		 // LENGHT - 1;
		 // arr[arr.length-1];


		user.save(function(err){
			if(err) return res.status(500).json({message:"Medication already listed."})
			res.status(201).json(medication)			

		})
		// res.json({error: false, medications: user.medications});
	})
	.catch(err => res.status(500).json({message:"Internal server error"}))


	// Medication
	// 	.create({
	// 		name: req.body.name,
	// 		dose: req.body.dose,
	// 		timing: req.body.timing,
	// 		description: req.body.description})
	// 	.then(
	// 		medication => res.status(201).json(medication))
	// 	.catch(err => {
	// 		console.error(err);
	// 		res.status(500).json({message: "Entry already exists"})
	// 	})
});


app.put('/api/medications/:id', verifyToken, (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		const message = (
			`Request path id (${req.params.id}) and request body id` + 
			`(${req.body.id}) must match`);
		console.error(message);
		res.status(400).json({message: message});
	}

	const toUpdate = {};
	const updateableFields = ['name', 'dose', 'timing', 'description'];

	updateableFields.forEach(field => {
		if (field in req.body) {
			toUpdate[field] = req.body[field];
		}
	});

	Medication
		.findByIdAndUpdate(req.params.id, {$set: toUpdate})
		.exec()
		.then(medication => res.status(204).end())
		.catch(err => res.status(500).json({message: 'Internal server error'}))
});

app.delete('/api/medications/:id', verifyToken,(req, res) => {
	const {username} = req.decoded;
	User.findOne({username}) 
	Medication
		.findByIdAndRemove(req.params.id)
		.exec()
		.then(() => res.status(204).end())
		.catch(err => res.status(500).json({message: 'Internal server error'}));
});

app.get('/api/medications/:id', verifyToken, (req, res) => {
	const {username}= req.decoded; // username = req.decoded.username; 
	User.findOne({username}) // {username: username}
	.exec()
	.then((user) => {
		const medication = user.medications.id(req.params.id);
		res.json(medication);
	})
	.catch(err => res.status(500).json({message: 'Internal server error'}))
});

app.post('/api/authenticate',(req, res) => {

	User
	.findOne({username: req.body.username, password: req.body.password})
	.lean()
	.exec()
	.then(user => {
		if(!user){
			return res.status(404).json({'message': 'User not found'})
		}
		let token = jwt.sign(user, jwt_secret, {
			expiresIn: "1440m"
		});

		res.json({error:false, token: token});
	})
	.catch(err => {
		console.log(err)
		res.status(500).json({message: 'Failed misserably'})
	})
});

app.post('/api/signup', (req,res) => {
	let user = new User({
		username: req.body.username, 
		password: req.body.password
	});
	user.save(function(err, data){
		if(err){
			console.log(err);
			return res.json({error: true, message: 'Unsuccessful'})
		}
		res.json({error: false, message: 'New user created'})
	})
});

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if(err) {
				return reject(err);
			}

			server = app.listen(port, () => {
				console.log(`Your app is listening on port ${port}`);
				resolve();
			})
			.on('error', err => {
				mongoose.disconnect();
				reject(err);
			});
		});
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject)=> {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main ===module) {
	runServer().catch(err => console.error(err));
};










