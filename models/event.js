const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let EventSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description : {
    type: String,
    requireed: true
  },
  startTime: {
    type: Date,
    default: new Date(),
    required: true
  },
  endTime: {
    type: Date,
    default: new Date(),
    required:true
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  attendees:[{
    type: Schema.Types.ObjectId,
    ref:'User',
    required:false
  }],
  tags: [{
    type: Schema.Types.ObjectId,
    ref:'Tag',
    required:false
  }],
  status:{
    type:String,
    eum: ['submitted', 'approved', 'rejected','expired'],
    default: 'submitted',
    required:true
  }
});

module.exports = mongoose.model('Event', EventSchema);