const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const { app, runServer, closeServer } = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Medications', function() {
    before(function() {
        return runServer(databaseUrl = "mongodb://localhost/pill_box_test");
    });
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
            });
    });

    it('should create a new medication on POST', function() {
        /// how do we get the token?

       chai.request(app)
            .post('/api/authenticate')
            .send({ username: 'deborah', password: 'lplplp' })
            .then(function(res) {
            	console.log(res.body);
                return chai.request(app)
                    .post('/api/medicationns?token='+ res.body.token)
                    .send({ name: 'asprin', dose: 'one', timing: 'day', description: 'red' })
                    .then(function(res) {
                    	console.log(res.body, 'anything');
                        res.should.have.status(201);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.include.keys('name', 'dose', 'timing', 'description');                        
                        res.body.name.should.equal('asprin');
                    })
                    // .catch(function(err){
                    // 	throw err;
                    // })
            })
            .catch(function(err){
            	throw err;
            })
    });


    // it('should delete medications on DELETE', function() {
    //     return chai.request(app)
    //         .get('/api/medications')
    //         .then(function(res) {
    //             return chai.request(app)
    //                 .delete(`/api/medications/${res.body[0].id}`);
    //         })
    //         .then(function(res) {
    //             res.should.have.status(204);
    //         });
    // });
});
