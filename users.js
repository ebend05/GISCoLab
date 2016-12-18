var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    registrDate: {
        type: Date,
        required: true
    },
    birthday: {
        type: Date,
        required: false
    },
    info: {
        type: String,
        required: false
    },
    hash: String,
    salt: String
});

/* Project Schema --> new file?
var projectSchema = new mongoose.Schema({
  userName: {
       type: String,
       required: true
   },
    projectName: {
       type: String,
       required: true
    },
    dateCreated: {
       type: Date,
       required: true
    },
    dateEdited: {
       type: Date,
       required: true
    },
    collaboration: {
       type: String,
       required: true
    },
}); */

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

mongoose.model('User', userSchema);
