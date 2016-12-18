var mongoose = require ( 'mongoose' );

var projectSchema = new mongoose.Schema({
  ownerID: {
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
    collaborators: [{
       type: String,
       required: false
    }],
});

mongoose.model( 'Project', projectSchema );