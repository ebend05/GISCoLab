var mongoose = require ( 'mongoose' );

var projectSchema = new mongoose.Schema({
  ownerID: {
       type: String,
       required: true
   },
    userName: {
      type: String,
        required: true,
        unique: true
    },
    projectName: {
       type: String,
       required: true
    },
    info: {
      type: String,
        required: true
    },
    dateCreated: {
       type: Date,
       required: true
    },
    dateEdited: {
       type: Date,
       required: false
    },
    collaborators: [{
       type: String,
       required: false
    }]
});

mongoose.model( 'Project', projectSchema );