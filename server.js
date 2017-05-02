const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

const mongoose = require('mongoose');

const{PORT, DATABASE_URL} = require('./config');

const medicationSchema = mongoose.Schema({

	name: {type: String, required: true, unique: true},
	dose: {type: String, required: true},
	timing: {type: String, required: true},
	description: {
		color: String,
		shape: String,
		markings: String
	}
})

medicationSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		name: this.name,
		dose: this.dose,
		timing: this.timing,
		description: this.description
	};
}

const Medication = mongoose.model('Medication', medicationSchema);

app.post('/medications', (req, res) => {
	const requiredFields = ['name', 'dose', 'timing'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
console.log('here we are');
	Medication
		.create({
			name: req.body.name,
			dose: req.body.dose,
			timing: req.body.timing,
			description: req.body.description})
		.then(
			medication => res.status(201).json(medication))
		.catch(err => {
			console.error(err);
			res.status(500).json({message: "Entry already exists"})
		})
});

app.get('/medications', (req, res) => {
	const filters = {};
	console.log(req.query)
	if (req.query.name) {
		filters['name'] = req.query['name'];
	}
	console.log(filters)
	Medication
		.find(filters)
		.limit(15)
		.exec()
		.then(medications => {
			res.json({
				medications: medications.map(
					(medication) => medication.apiRepr())
			});
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'})
		});
});

app.put('/medications/:id', (req, res) => {
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

app.delete('/medications/:id', (req, res) => {
	Medication
		.findByIdAndRemove(req.params.id)
		.exec()
		.then(() => res.status(204).end())
		.catch(err => res.status(500).json({message: 'Internal server error'}));
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










