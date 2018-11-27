const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RewarSchema = new Schema({
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
  criteria: {
      type:Number,
      required:true
  },
  submitter: {
    type: Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  provider:{
    type: String,
    required:true
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref:'Tag'
  }],
  events : [{
      type: Schema.Types.ObjectId,
      ref:'Event'
  }],
  status:{
    type:Number,
    required:true
  }
});

module.exports = mongoose.model('Reward', RewardSchema);