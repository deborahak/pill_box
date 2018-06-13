var jwt = require('jsonwebtoken');
let config = require('../config');

module.exports = function(req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
		if (token) {
			jwt.verify(token, config.jwt_secret,function(err, decoded) {
				if (err) {
					return res.json({"error": true, "message": "Token not verified"});
				}
				req.decoded = decoded;
				next();
			});
		} else {
			return res.status(403).send({
				"error": true, "message": "No Token"
			});
		}
}