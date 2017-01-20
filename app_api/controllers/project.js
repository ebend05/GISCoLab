var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var User = mongoose.model('User');

//var _ = require( 'lodash' );

module.exports.createProject = function(req, res){
    var project = new Project();

    User.findOne({'userName': req.body.userName}, function (err, obj){
        if (err){
            alert("something went wrong");
        } else {

            project.projectName = req.body.projectName;
            project.userName = req.body.userName;
            project.uniqueKey = req.body.uniqueKey;
            project.ownerID = obj._id;
            project.info = req.body.info;
            project.dateCreated = Date.now();
            project.collaborators = req.body.collaborators;

            project.save(function(err) {
                res.status(200);
                res.json({
                    "status": "everything worked fine"
                });
                obj.ownProjects = project._id;
                obj.save(function(error){
                    if(error){
                        alert("something went wrong");
                    }
                });
            });
            var pid = project._id;
            var coll = req.body.collaborators;
            for(var i = 0; i < coll.length; i++){
                User.findOne({'email': coll[i]}, function (err, collabo){
                    if (err){
                        alert("something went wrong");
                    } else {
                        collabo.coopProjects = pid;
                        collabo.save(function(e){
                            if(e){
                                alert("something went wrong");
                            }
                        })
                    }
                });
            }
        }
    });
};

module.exports.projectRead = function(req, res) {

    /* 
     Important notice:
     for triggering this function,
     req must contain the Projects ID;

     this means, the respective project._id must be provided as JSON to the function (or otherwise attribute of function call, in this case, change attribute formatting).
     */
    Project
        .findOne({'ownerID': req.payload._id}, function(err, obj){
            if(err){
                res.status(401).json("couldnt load the project");
            }else{
                res.status(200).json(obj);
            }
        });
};


// ***********
// ** TODO: **
// ***********

// adapt dependencies and mechanics 
// to project management requirements

// create and handle edit logging

module.exports.projectUpdate = function(req, res) {

    var query = {'ownerID': req.payload._id};

    Project
        .findOneAndUpdate(query, req.body, function(err, obj) {
            if(err){
                res.status(401).json("couldnt update the project");
            } else{
                res.status(200).json(obj);
            }
        });

    /*
     if (!req.payload._id) {
     res.status(401).json({
     "message": "UnauthorizedError: cannot update project without being logged in as a user"
     });
     } else {
     // authorization needed, so not every user can change a project
     // validate user as author or collaborator,
     // otherwise shoot down request
     Project.findById(req.body._id)
     .exec(function (err, project) {
     if (err) {
     res.status(401).json({
     "message": "dbError: Error performing FindById"
     });
     } else if ( req.payload._id === project.ownerID ) {
     // Editor is owner
     Project.findByIdAndUpdate(req.payload._id, req.body, {runValidators: true, upsert: true})
     .exec(function (err, user) {
     res.status(200).json(project);
     })
     } else if ( _.includes( project.collaborators, req.payload._id )) {
     // Editor is collaborator
     Project.findByIdAndUpdate(req.payload._id, req.body, {runValidators: true, upsert: true})
     .exec(function (err, user) {
     res.status(200).json(project);
     })
     } else {
     res.status(401).json({
     "message": "UnauthorizedError: Must be owner or collaborator to edit project"
     })
     }
     });
     }*/
};


module.exports.projectDelete = function (req, res) {

    var query = {'ownerID': req.payload._id};

    Project
        .findOne(query, function(err, obj) {
            if(err){
                res.status(401).json("couldnt delete the project");
            } else{
                obj.remove();
                res.status(200).json("removed the project");
            }
        });

    /*
     if (!req.payload._id) {
     res.status(401).json({
     "message": "UnauthorizedError: cannot delete profile without being logged in to it"
     });
     } else {
     Project.findById(req.payload._id)
     .exec(function (err, value) {
     if (err) {
     res.status(401).json({
     "message": "DeleteError: could not delete feature"
     });
     } else if ( req.payload._id === project.ownerID ) {
     console.log('feature removed (logging just for testing)');
     value.remove();
     res.status(200).send('removed Feature');
     } else {
     res.status(401).json({
     "message": "UnauthorizedError: Must be owner to delete project"
     });
     }
     });
     }*/
};