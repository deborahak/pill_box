const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

let verifyToken = require('./middlewares/verifyToken');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const { router: usersRouter } = require('./users');

const { User } = require('./users/models');

//app.use('/api/users/', usersRouter);
//app.use('/api/authenticate', authRouter);

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL, jwt_secret } = require('./config');

app.set('view engine', 'ejs');


/// TEMPLATE VIEWS!
app.get('/', (req, res) => {
    res.render('index')
});

app.get('/signup', (req, res) => {
    res.render('signup')
});

app.get('/login', (req, res, next) => {
    res.render('login');
    next();
});

app.get('/medications', (req, res) => {
    res.render('medications')
});

app.get('/add_meds', (req, res) => {
    res.render('add_meds')
});
app.get('/schedule', (req, res) => {
    res.render('schedule')
});

app.get('/learnmore', (req, res) => {
    res.render('learnmore')
});
// app.get('/edit_meds/:id', (req,res)=> {
//  // res.render('edit_meds', {
//  //  id: req.params.id
//  // })
//  res.render('medications');
// });

/// API Endpoints!!!
app.get('/api/medications', verifyToken, (req, res) => {
    const filters = {};
    if (req.query.name) {
        // TODO -> figure out if you need to filter a medication
        filters['name'] = req.query['name'];
    }
    const { username } = req.decoded;
    User.findOne({ username }) // User.find( { username: username })
        .exec()
        .then(user => {
            res.json({ error: false, medications: user.medications });
        }).catch(err => res.status(500).json({ message: "Internal server error" }));;
    // Medication
    //  .find(filters)
    //  .limit(15)
    //  .exec()
    //  .then(medications => {
    //      res.json({error: false,
    //          medications: medications.map(
    //              (medication) => medication.apiRepr())
    //      });
    //  })
    //  .catch(err => {
    //      console.error(err);
    //      res.status(500).json({message: 'Internal server error'})
    //  });
});

app.post('/api/medications', verifyToken, (req, res) => {
    const requiredFields = ['name', 'dose', 'timing[]', 'description'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }

    const { username } = req.decoded;
    User.findOne({ username })
        .exec()
        .then(user => {
            user.medications.push({
                name: req.body.name,
                dose: req.body.dose,
                timing: req.body['timing[]'],
                description: req.body.description
            });
            // pick out the last medication
            const medication = user.medications[user.medications.length - 1];

            user.save(function(err) {

                if (err) {
                    console.log(err, 'error')
                    return res.status(500).json({ message: "Medication already listed." })
                }
                res.status(201).json(medication)

            })
            // res.json({error: false, medications: user.medications});
        })
        .catch(err => {
            res.status(500).json({ message: "Internal server error" })
        })


    // Medication
    //  .create({
    //      name: req.body.name,
    //      dose: req.body.dose,
    //      timing: req.body.timing,
    //      description: req.body.description})
    //  .then(
    //      medication => res.status(201).json(medication))
    //  .catch(err => {
    //      console.error(err);
    //      res.status(500).json({message: "Entry already exists"})
    //  })
});


app.put('/api/medications/:id', verifyToken, (req, res) => {
    // if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    //     const message = (
    //         `Request path id (${req.params.id}) and request body id` +
    //         `(${req.body.id}) must match`);
    //     console.error(message);
    //     res.status(400).json({ message: message });
    // }

    const toUpdate = {};
    const updateableFields = ['name', 'dose', 'timing', 'description'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });
    const { username } = req.decoded;
    User.findOne({ username })
        .exec()
        .then(user => {

            let medication = user.medications.id(req.params.id);
            medication.name = req.body.name;
            medication.dose = req.body.dose;
            medication.timing = req.body['timing[]'];
            medication.description = req.body.description;
            user.save((err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: 'Internal server error' })
                }
                return res.json(medication);
            });

        })
        .catch(err => res.status(500).json({ message: 'Internal server error' }))
    //      .exec()
    //      .then(medication => res.status(204).end())
    //      .catch(err => res.status(500).json({message: 'Internal server error'}))
});

app.delete('/api/medications/:id', verifyToken, (req, res) => {
    const { username } = req.decoded;
    User.update({ username }, { "$pull": { "medications": { "_id": req.params.id } } },
        (err, numAffected) => {
            if (err) {
                return res.status(500).json({ message: 'Internal server error' })
            }
            return res.json({ message: 'You have successfully deleted this medication' })
        }
    )

    // User.findOne({ username })
    // .exec()
    // .then((user) => {

    //  res.status(204).end()
    // })
    // .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

app.get('/api/medications/:id', verifyToken, (req, res) => {
    const { username } = req.decoded; // username = req.decoded.username; 
    User.findOne({ username }) // {username: username}
        .exec()
        .then((user) => {
            const medication = user.medications.id(req.params.id);
            // medication.name = 'ljljasfa'
            // melj
            // user.save()
            res.json(medication);
        })
        .catch(err => res.status(500).json({ message: 'Internal server error' }))
});

app.post('/api/authenticate', (req, res, next) => {

    User
        .findOne({ username: req.body.username, password: req.body.password })
        .lean()
        .exec()
        .then(user => {
            if (!user) {
                // res.status(404).json({ 'message': 'User not found' })
                res.json({'message': '*Required'});
                next();
            }
            let token = jwt.sign(user, jwt_secret, {
                expiresIn: "1440m"
            });

            res.json({ error: false, token: token });
        })
        .catch(err => {
            //res.status(500).json({ message: 'Failed misserably' });
            res.sendStatus(500).send(error);
        })
});

app.post('/api/signup', (req, res, next) => {
    let user = new User({
        username: req.body.username,
        password: req.body.password
    });
    user.save(function(err, data, next) {
        // if (!user) {
        //     res.json({'message': '*Required'});
        //     next();
        // }
        if (err) {
            console.log(err);
            return res.json({ error: true, message: 'Unsuccessful' })
            next();
        }
        res.status(201).json({ error: false, message: 'New user created' })
    })
    // .catch(err => {
    //         //res.status(500).json({ message: 'Failed misserably' });
    //     res.sendStatus(500).send(error);
    // });
});

let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
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
        return new Promise((resolve, reject) => {
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

if (require.main === module) {
    runServer().catch(err => console.error(err));
};

module.exports = { app, runServer, closeServer };