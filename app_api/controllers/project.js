var mongoose = require('mongoose');
var project = mongoose.model('Project');

var _ = require( 'lodash' );



module.exports.projectRead = function(req, res) {

    /* 
        Important notice:
            for triggering this function, 
            req must contain the Projects ID;

            this means, the respective project._id must be provided as JSON to the function (or otherwise attribute of function call, in this case, change attribute formatting).
    */
    Project
      .findById(req.payload._id)
        .exec(function(err, user) {
            res.status(200).json(user);
      });
};


// ***********
// ** TODO: **
// ***********

// adapt dependencies and mechanics 
// to project management requirements

// create and handle edit logging

module.exports.projectUpdate = function(req, res) {
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
    }
};


module.exports.projectDelete = function (req, res) {
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
    }
};