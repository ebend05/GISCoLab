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

    Project
        .findById(req.params.id, function(err, obj){
            if(err){
                res.status(401).json("could not load the project");
            } else {
                res.status(200).json(obj);
            }
        });
};


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


				var projDirName = obj.uniqueKey.replace(/(\s)/g, "__");
				exec("cd projectData && rm -r " +projDirName +"", puts);

				obj.remove();
				res.status(200).json("removed the project");
        }});
};

module.exports.uploadFile = function(req, res) {

    var form = new formidable.IncomingForm();

    form.multiples = false;

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
        } else
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
        } else
		{
			alert("Bitte nur Dateien vom Typ .R oder .txt hochladen!");
			res.send('Bitte nur Dateien vom Typ .R oder .txt hochladen.');
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

module.exports.runExistingRCode = function(req, res){
	var projDirName = req.params.key.replace(/(\s)/g, "__");
	var pathToScript = path.join(__dirname, "../../projectData/" + projDirName + "/rScripts/getCSVwithSciDBData.R");

	var exec = require('child_process').exec;
	function puts(error, stdout, stderr) { if(error){ console.log(error)}else{console.log(stdout)} };
	var child = exec("Rscript " + pathToScript, puts);
	child.on('close', function () {
		res.status(200).send('hubba-bubba');
	});
};


module.exports.runRCode = function (req, res)
{
	var projDirName = req.payload._id;
	var fName = req.body.fName;
	var pkg = req.body.pkg;
	var code = req.body.code;

	var exec = require('child_process').exec;
	exec("mkdir userTemps/" + projDirName +"");

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

	setTimeout( function () {
		fs.writeFile(fileName, fillR, function(err) {
			if (err) {
				console.log("Something went wrong when saving the RScript file: " + err);
				res.send('Something went wrong when saving the RScript file!');
			}
		});

		setTimeout( function () {
			res.status(200).send("R File successfully saved!");
		}, 50);
	}, 50);


};