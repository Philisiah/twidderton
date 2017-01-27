//load required packages
var mongoose = require('mongoose');
var crypto = require('crypto');
var secrets = require('../config/secrets');

//define user schema
var UserSchema = new mongoose.Schema({
	twitterId: { type: String, unique: true, required: true},
	username: { type: String, unique: true, lowercase: true, required: true},
	email: { type: String, lowercase:true},
	name: { type: String, default: ''},
	created: { type: Date, default: new Date()},
	accessToken: { type: String, required: true},
	tokenSecret: { type: String, required: true }
});

UserSchema.methods.encrypt = function(text){
	var algorithmn = secrets.cryptos.algorithmn;
	var key = secrets.cryptos.key;

	var cipher = crypto.createCipher(algorithmn, key);
	return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
};

UserSchema.methods.decrypt = function(text){
	var algorithmn = secrets.cryptos.algorithmn;
	var key = secrets.cryptos.key;

	var decipher = crypto.createDecipher(algorithmn, key);
	return decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
};

//Export the mongoose model
module.exports = mongoose.model('User', UserSchema);