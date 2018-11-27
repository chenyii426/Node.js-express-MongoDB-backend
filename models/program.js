var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProgramSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  fullname: {
    type: String,
    required: false,
    unique: true
  },
  description: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Program', ProgramSchema);