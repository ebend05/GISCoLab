var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res) {

  // if(!req.body.name || !req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }

  var user = new User();

  user.userName = req.body.userName;
  user.email = req.body.email;
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.registrDate = req.body.registrDate;
  user.birthday = req.body.birthday; //is not required, how is this implemented?
  user.info = req.body.info; //is not required, ...

  user.setPassword(req.body.password);

  /*
  var project = new Project();

  project.userName = req.body.userName;
  project.projectName = req.body.projectName;
  project.dateCreated = req.body.dateCreated;
  project.dateEdited = req.body.dateEdited;
  project.collaboration = req.body.collaboration;
  */

  user.save(function(err) {
    var token;
    token = user.generateJwt();
    res.status(200);
    res.json({
      "token" : token
    });
  });

};

module.exports.login = function(req, res) {

  // if(!req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }

  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
      console.log(token);
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};
