var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');
var ctrlProject = require('../controllers/project');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);
router.post('/profileUpdate', auth, ctrlProfile.profileUpdate);
router.post('/profileDelete', auth, ctrlProfile.profileDelete);

// project
router.get('/project', ctrlProject.projectRead);
router.post('/projectUpdate', auth, ctrlProject.projectUpdate);
router.post('/projectDelete', auth, ctrlProject.projectDelete);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;