const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const medicationSchema = mongoose.Schema({

	name: {type: String, required: true, default: '', unique: false},
	dose: {type: String, required: false,  default: '', unique: false},
	timing: {type: Array, required: false,  default: '', unique: false},
	description: {type: String, required: false,  default: '', unique: false}
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

const UserSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		trim: true,
		index: true
	},
	password: {
		type: String,
		trim: true,
		required: true,
		index: {
			partialFilterExpression: {passwword: {$type: 'string'}}
		}
	},
	firstName: {type: String, default: ""},
	lastName: {type: String, default: ""},
	medications: [medicationSchema]
});

// UserSchema.post('save', function(error, doc, next) {
// 	if (error.username === 'MongoError') {
// 		next(new Error('Username cannot be blank'));
// 	} else {
// 		next(error);
// 	}
// })

UserSchema.methods.apiRepr = function() {
	return {
		username: this.username || '',
		firstName: this.firstName || '',
		lastName: this.lastName || ''
	};
}

UserSchema.methods.validatePassword = function(password) {
	  return bcrypt.compare(password, this.password);
}
UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
}

const User = mongoose.model('User', UserSchema);

module.exports = {User};

