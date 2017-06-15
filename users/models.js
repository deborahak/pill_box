const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

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

// const Medication = mongoose.model('Medication', medicationSchema);


const UserSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	firstName: {type: String, default: ""},
	lastName: {type: String, default: ""},
	medications: [medicationSchema]
});

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










