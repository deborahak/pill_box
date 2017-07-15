const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const { app, runServer, closeServer } = require('../server');

const should = chai.should();
const { User } = require ('../users/models');

chai.use(chaiHttp);

describe('Medications', function() {
            before(function() {
                return runServer(databaseUrl = "mongodb://localhost/pill_box_test");
            });

            before(function(){
            	// User.create({})
            	// const blah = new User({})
            	const user = new User({username: 'Holly', password: 'hdhdhd'});
            	user.save((err) => {
            		if(err) throw err;
            		user.medications.push({name: 'Claritin', dose: 'one', timing: 'once a day', description: 'white rectangle'});
            		user.save();
            	});
            })
            after(function() {
                mongoose.connection.db.dropDatabase(); /// delete the database
                return closeServer();
            });
            it('should create a new user on POST', function() {
                const newUser = { username: 'deborah', password: 'lplplp' }
                return chai.request(app)
                    .post('/api/signup')
                    .send(newUser)
                    .then(function(res) {
                        res.should.have.status(201);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.include.keys('error', 'message');
                        return chai.request(app)
                        	.post('/api/authenticate')
                        	.send({ username: 'deborah', password: 'lplplp' })
                        	.then((res)=> {
                        		token = res.body.token;
                        	});
                    });
            });

            it('should create a new medication on POST', function() {
                /// how do we get the token?

                return chai.request(app)
                    .post('/api/authenticate')
                    .send({ username: 'deborah', password: 'lplplp' })
                    .then(function(res) {
                        return chai.request(app)
                            .post('/api/medications?token=' + res.body.token)
                            .send({ name: 'asprin', dose: 'one', timing: 'day', description: 'red' })
                            .then(function(res) {
                                res.should.have.status(201);
                                res.should.be.json;
                                res.body.should.be.a('object');
                                res.body.should.include.keys('name', 'dose', 'timing', 'description');
                                res.body.name.should.equal('asprin');
                            })
                            .catch(function(err) {
                                throw err;
                            })
                    })
                    .catch(function(err) {
                        throw err;
                    })
            });

            it('should delete medications on DELETE', function() {
                return chai.request(app)
                    .post('/api/authenticate')
                    .send({ username: 'deborah', password: 'lplplp' })
                    .then(function(res) {
                        const { token } = res.body; // const token = res.body.token.
                        return chai.request(app)
                            .get(`/api/medications?token=${token}`)
                            .then(function(res) {
                                return chai.request(app)
                                    .delete(`/api/medications/${res.body.medications[0]._id}?token=${token}`)
                                    .then(function(res) {
                                        res.should.have.status(200)
                                    })
                            })
                    });
            });
            it('should update medications on PUT', function() {
                return chai.request(app)
                    .post('/api/authenticate')
                    .send({ username: 'Holly', password: 'hdhdhd' })
                    .then(function(res) {
                        const { token } = res.body;
                        return chai.request(app)
                            .get(`/api/medications?token=${token}`)
                            .then(function(res) {
                                return chai.request(app)
                                    .put(`/api/medications/${res.body.medications[0]._id}?token=${token}`)
                                    .send({ name: 'tylenol', dose: 'two', timing: 'morning', description: 'orange' })
                                })
                                    .then(function(res) {
                                        res.should.have.status(200)
                                        res.should.be.json;
                                        res.body.should.be.a('object');
                                        res.body.should.include.keys('name', 'dose', 'timing', 'description');

                                    })
                                    .catch(function(err) {
                                        throw (err);
                                    })
                            });

                    });
            });
        
