var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var User = mongoose.model('User');
var bodyParser = require("body-parser");
var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
var archiver = require('archiver');

//var _ = require( 'lodash' );

module.exports.createProject = function(req, res){
    var project = new Project();

	var coll = req.body.collaborators;

    User.findOne({'userName': req.body.userName}, function (err, obj){
        if (err || obj.id === null || obj.id === undefined){
            console.log("something went wrong");
        } else {

            project.projectName = req.body.projectName;
            project.uniqueKey = req.body.uniqueKey;
            project.ownerID = obj._id;
            project.info = req.body.info;
            project.dateCreated = Date.now();

			for(var zaehl = 0; zaehl < coll.length; zaehl++){
				console.log(coll[zaehl]);
				User.findOne({'email': coll[zaehl]}, {'email': 1}, function (err, collabo) {
					if (err) {
						console.log("something went wrong");
					} else if (collabo === null) {
						console.log("Passed email address is not a registered user; collaborator was not added");
					} else {
						console.log(collabo);
						project.collaborators.push(collabo.email);
					}
				});
			}

            setTimeout( function () {
				project.save(function(err) {
					res.status(200);
					res.json({
						"status": "everything worked fine"
					});
					setTimeout( function ()
					{
						obj.ownProjects.push({projectName: req.body.projectName, projectID: project._id});
						obj.save(function(error){
							if(error){
								console.log("something went wrong");
							}
						});
					}, 50);
				});
			}, 50);

            for(var i = 0; i < coll.length; i++){
                User.findOne({'email': coll[i]}, function (err, collabo){
                    if (err){
                        console.log("something went wrong");
                    } else if (collabo === null) {
                        console.log(coll[i] + " is not a registered user; collaborator was not added");
                    } else {
                        collabo.coopProjects.push({projectName: project.projectName, projectID: project._id});
                        collabo.save(function(e){
                            if(e){
                                console.log("something went wrong");
                            }
                        })
                    }
                });
            }
        }
    });
    for(var j=0; j < req.body.collaborators.length; j++){
        User.findOne({'email': req.body.collaborators[j]}, function (e, col){
            if(e) {
                console.log("something went wrong");
            } else if (col === null)
            {
                console.log(req.body.collaborators[j] + " is not a valid collaborator")

            } else {
                project.collaboratorID.push(col._id);
                project.update();
            }
        });
    }
    var exec = require('child_process').exec;
    function puts(error, stdout, stderr) { if(error){ console.log(error)}else{console.log(stdout)} };
	var projDirName = req.body.uniqueKey;
	projDirName = projDirName.replace(/(\s)/g, "__");
	console.log(projDirName);
    exec("cd projectData && mkdir "+projDirName+"", puts);
    setTimeout(function () {
        exec("cd projectData/"+projDirName+" && mkdir rScripts", puts);
        exec("cd projectData/"+projDirName+" && mkdir txtFiles", puts);
        exec("cd projectData/"+projDirName+" && mkdir geoTiffs", puts);
        exec("cd projectData/"+projDirName+" && echo {} > datatxt.json", puts);
        exec("cd projectData/"+projDirName+" && echo {} > datarScripts.json", puts);
        project.filePath.push("projectData", "projectData/"+req.body.uniqueKey, "projectData/"+req.body.uniqueKey+"/rScripts", "projectData/"+req.body.uniqueKey+"/txtFiles", "projectData/"+req.body.uniqueKey+"/geoTiffs", "projectData/"+req.body.uniqueKey+"/datatxt.json", "projectData/"+req.body.uniqueKey+"/datarScript.json");

    }, 40);

    setTimeout(function () {
		console.log("read datatxt.json");
        fs.readFile('projectData/' + projDirName + '/datatxt.json', function (err, data) {
            if (err) throw err;
            var newData = JSON.parse(data);
            newData.id = "../../projectData/" + projDirName + "/txtFiles/";
            newData.value = "txtFiles";
            newData.data = [];
            console.log(newData);
            newData = JSON.stringify(newData);
            console.log(newData);

            var fileName = path.join(__dirname, '../../projectData/' + projDirName + '/datatxt') + '.json';

            fs.writeFile(fileName, newData, function(err) {
                if (err) {
                    console.error('Something when wrong when saving the temp file' + err);
                    res.send('Something when wrong when saving the temp file');
                }
            });

        });
    }, 120);

    setTimeout(function () {
		console.log("read datarScripts.json");
        fs.readFile('projectData/' + projDirName + '/datarScripts.json', function (err, data) {
            if (err) throw err;
            var newData = JSON.parse(data);
            newData.id = "../../projectData/" + projDirName + "/rScripts/";
            newData.value = "rScripts";
            newData.data = [];
            console.log(newData);
            newData = JSON.stringify(newData);
            console.log(newData);

            var fileName = path.join(__dirname, '../../projectData/' + projDirName + '/datarScripts') + '.json';

            fs.writeFile(fileName, newData, function(err) {
                if (err) {
                    console.error('Something when wrong when saving the temp file' + err);
                    res.send('Something when wrong when saving the temp file');
                }
            });

        });
    }, 120);



};

module.exports.projectRead = function(req, res) {

    /* 
     Important notice:
     for triggering this function,
     req must contain the Projects ID;

     this means, the respective project._id must be provided as JSON to the function (or otherwise attribute of function call, in this case, change attribute formatting).
     */
    /*
    Project
        .findOne({'ownerID': req.payload._id}, function(err, obj){
            if(err){
                res.status(401).json("couldnt load the project");
            }else{
                res.status(200).json(obj);
            }
        });
        */

    Project
        .findById(req.params.id, function(err, obj){
            if(err){
                res.status(401).json("could not load the project");
            } else {
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

    //var query = {'ownerID': req.payload._id};

    Project
        .findByIdAndUpdate(req.params.id, req.body, function(err, obj) {
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

    //var query = {'ownerID': req.payload._id};

    Project
        .findById(req.params.id, function(err, obj) {
            if(err){
                res.status(401).json("couldnt delete the project");
            } else{
                User.findOneAndUpdate({_id: obj.ownerID}, {$pull: {ownProjects: {projectID: obj._id}}}, function(err, data){
                    if(err){
                        console.log("something went wrong");
                    } else {
                        console.log("perfect");
                    }
                });

                for(var i = 0; i < obj.collaborators.length; i++){
                    User.findOneAndUpdate({email: obj.collaborators[i]}, {$pull: {coopProjects: {projectID: obj._id}}}, function(err, data){
                        if(err){
                            console.log("something went wrong");
                        } else {
                            console.log("nice");
                        }
                    });
                }

                var exec = require('child_process').exec;
                function puts(error, stdout, stderr) { if(error){ console.log(error)}else{console.log(stdout)} };

				/**
				 * Geht kürzer!!
				exec("cd projectData/"+obj.uniqueKey+" && rd geoTiffs", puts);
                exec("cd projectData/"+obj.uniqueKey+" && rd txtFiles", puts);
                exec("cd projectData/"+obj.uniqueKey+" && rd rScripts", puts);
                exec("cd projectData && rd "+obj.uniqueKey+"", puts);
				 * rm -r löscht rekursiv sämtliche Unterstrukturen eines Directory's, und dann den Ordner selbst!
				 */
				var projDirName = obj.uniqueKey.replace(/(\s)/g, "__");
				exec("cd projectData && rm -r " +projDirName +"", puts);

				obj.remove();
				res.status(200).json("removed the project");
                /*
                User
                    .findById(obj.ownerID, function (e, owner){
                        if(e){
                            console.log("something went wrong");
                        }else {
                            //owner.ownProjects.pull({projectName: obj.projectName, projectID: obj._id});
                            //for(var j=0; j < owner.ownProjects.length; j++){
                            //if (owner.ownProjects[j].projectID === obj._id) {
                                //delete owner.ownProjects[{projectName: obj.projectName, projectID:obj._id}];
                            //}
                        //}
                        }});
*/

                /*
                var coll = obj.collaborators;
                for(var i = 0; i < coll.length; i++){
                    User.findOne({'email': coll[i]}, function (error, collabo) {
                        if (error) {
                            console.log("something went wrong");
                        } else {
                            //collabo.coopProjects.pull({projectName: obj.projectName, projectID: obj._id});
                            //for(var m=0; m < collabo.coopProjects.length; m++){
                            //if (collabo.coopProjects[m].projectID === obj._id) {
                                //delete collabo.coopProjects[{projectName: obj.projectName, projectID:obj._id}];
                            //}}
                        }
                    });
            }
            */
        }});

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

module.exports.uploadFile = function(req, res) {

    var form = new formidable.IncomingForm();

    form.multiples = false;

    // TODO: Abfrage ob Dateiendung r oder txt ist und dann Error werfen, damit kein Datenmüll hochgeladen wird

    form.uploadDir = path.join(__dirname, '../../projectData');

    console.log(path.join(__dirname, '../../projectData'));

	var projDirName = req.params.key.replace(/(\s)/g, "__");
// every time a file has been uploaded successfully,
// rename it to it's original name
    form.on('file', function (field, file) {
        if(file.type === 'text/plain'){
            fs.rename(file.path, path.join(form.uploadDir+'/'+projDirName+'/txtFiles', file.name));

            fs.readFile('projectData/' + projDirName + '/datatxt.json', function (err, jsondata) {
                if (err) throw err;
                var newData = JSON.parse(jsondata);
                newData.data.push({id: "../../projectData/" + projDirName + "/txtFiles/" + file.name , value: file.name});
                newData = JSON.stringify(newData);
                console.log(JSON.parse(newData))

                var fileName = path.join(__dirname, '../../projectData/' + projDirName + '/datatxt') + '.json';

                fs.writeFile(fileName, newData, function(err) {
                    if (err) {
                        console.error('Something when wrong when saving the temp file' + err);
                        res.send('Something when wrong when saving the temp file');
                    }
                });

            });
        }
        if(file.type === 'text/x-r-source'){
            fs.rename(file.path, path.join(form.uploadDir+'/'+projDirName+'/rScripts', file.name));

            fs.readFile('projectData/' + projDirName + '/datarScripts.json', function (err, data) {
                if (err) throw err;
                var newData = JSON.parse(data);
                newData.data.push({id: "../../projectData/" + projDirName + "/rScripts/" + file.name , value: file.name});
                newData = JSON.stringify(newData);

                var fileName = path.join(__dirname, '../../projectData/' + projDirName + '/datarScripts') + '.json';

                fs.writeFile(fileName, newData, function (err) {
                    if (err) {
                        console.error('Something when wrong when saving the temp file' + err);
                        res.send('Something when wrong when saving the temp file');
                    }
                });
            });
        }
    });

// log any errors that occur
    form.on('error', function (err) {
        console.log('An error has occured: \n' + err);
    });

// once all the files have been uploaded, send a response to the client
    form.on('end', function () {
        res.end('success');
    });

// parse the incoming request containing the form data
    form.parse(req);
};

module.exports.downloadZip = function(req, res){

	var exec = require('child_process').exec;
	function puts(error, stdout, stderr) { if(error){ console.log(error)}else{console.log(stdout)} };

	var output = fs.createWriteStream('projectData/'+req.params.key+'.zip');

    var archive = archiver('zip', {
        store: false // Sets the compression method to STORE.
    });

    archive.directory('projectData/'+req.params.key+'/');

    archive.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');

        exec('cd projectData && chmod 777 '+req.params.key+'.zip', puts);
        res.status(200).sendfile('projectData/'+req.params.key+'.zip');
    });

    archive.on('error', function(err) {
        if(err) {
            res.status(400).json("could not zip the file");
        }
    });
    archive.finalize();

    setTimeout( function(){
        exec("cd projectData && del "+req.params.key+".zip", puts);
    }, 100);
};


module.exports.saveRCode = function (req, res)
{
	var projDirName = req.params.key.replace(/(\s)/g, "__");
	var code = req.body.code;
	var fName = req.body.fName;
	var fileName = path.join(__dirname, '../../projectData/'
			+ projDirName + '/rScripts/'
			+ fName +'') + '.R';

	fs.writeFile(fileName, code, function(err) {
		if (err) {
			console.log("Something went wrong when saving the RScript file: " + err);
			res.send('Something went wrong when saving the RScript file!');
		}
	});

	res.status(200).send("R File successfully saved!");
};


module.exports.runRCode = function (req, res)
{
	console.log("wuuhuuu, got this far!");
	var projDirName = req.payload._id;
	var fName = req.body.fName;
	var pkg = req.body.pkg;
	var code = req.body.code;

	console.log("vor mkdir");
	var exec = require('child_process').exec;
	exec("mkdir "+ projDirName +"");

	var date = Date.now();

	var fileName = path.join(__dirname, '../../userTemps/'
			+ projDirName +'/temp_' + date +'') + '.R';

	var fillR = pkg+ "\n SCIDB_HOST = \"128.176.148.9\" \n " +
		"SCIDB_PORT = \"30021\" \n " +
		"SCIDB_USER = \"giscolab\" \n " +
		"SCIDB_PW   =  \"BxLQmZVL2qqzUhU93usYYdxT\" \n" +
		" \n " +
		"Sys.setenv(http_proxy=\"\") \n" +
		"Sys.setenv(https_proxy=\"\") \n" +
		"Sys.setenv(HTTP_PROXY=\"\") \n" +
		"Sys.setenv(HTTPS_PROXY=\"\") \n" +
		code + "\n" +
		"firstimage = slice(x = scidbst(\"SENTINEL2_MS\"), \"t\", 0) # extrahiere erstes Bild \n" +
		"as_PNG_layer(firstimage,TMS = TRUE, bands = 4, layername=\"S2_NIR_T0\", min=300, max=5000, rm.scidb = TRUE)";

	fs.writeFile(fileName, fillR, function(err) {
		if (err) {
			console.log("Something went wrong when saving the RScript file: " + err);
			res.send('Something went wrong when saving the RScript file!');
		}
	});


	res.status(200).send("R File successfully saved!");
};