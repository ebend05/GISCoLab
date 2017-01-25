var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});
/*
var proID = {
  projectProperty: 'payload'
};
*/

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');
var ctrlProject = require('../controllers/project');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);
router.get('/profile/:id', ctrlProfile.profileRead2);
router.post('/profileUpdate', auth, ctrlProfile.profileUpdate);
router.post('/profileDelete', auth, ctrlProfile.profileDelete);

// project
router.post('/projectCreate', ctrlProject.createProject);
router.get('/project/:id', ctrlProject.projectRead);
router.post('/projectUpdate/:id', auth, ctrlProject.projectUpdate);
router.post('/projectDelete/:id', auth, ctrlProject.projectDelete);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;