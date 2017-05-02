const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('index page', function() {
	it('exists', function(done){
	chai.request(app)
		.get('/')
		.end(function(err,res) {
			res.should.have.status(200);
			res.should.be.html;
			done();
		});
	});
});

// describe('Medications', function() {
// 	before(function() {
// 		return runServer();
// 	});

// 	after(function() {
// 		return closeServer();
// 	});

// 	it('should list meds on GET', function() {
// 		return chai.request(app)
// 		.get('/medications')
// 		.then(function(res) {
// 			res.should.have.status(200);
// 			res.should.be.json;
// 			res.body.should.be.a('array');
// 			res.body.should.have.length.of.at.least(1);
// 			res.body.forEach(function(item) {
// 				item.should.be.a('object');
// 				item.should.include.keys('id', 'name', 'dosage');
// 			});
// 		});
// 	});

// })











