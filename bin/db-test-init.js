const mongoose = require('mongoose');
const User = require('../models/user');
const Event = require('../models/event');
const Program = require('../models/program');
var ObjectId = mongoose.Types.ObjectId;

async function insertData() {
  await mongoose.connect('mongodb://localhost/Sci-CAFE');

  await User.deleteMany({
  });

  let user = new User({
    _id:"5bfb64355d353727a12c3140",
    email : "joedoe@csula.edu",
	  password: "1234",
	  firstname: "Joe",
	  lastname: "Doe",
	  role: "student",
	  position: "student",
	  unit: "CS DEPARTMENT",
	  username: "attendee"
  });
  user = await user.save();
  console.log(user+"\n");

  user = new User({
    email : "yichen@csula.edu",
	  password: "1234",
	  firstname: "Yi",
	  lastname: "Chen",
	  role: "admin",
	  position: "student",
	  unit: "CS DEPARTMENT",
	  username: "yichen"
  });
  user = await user.save();
  console.log(user+"\n");
  let userId1 = await user._id; 

  user = new User({
    email : "johndoe@csula.edu",
	  password: "1234",
	  firstname: "John",
	  lastname: "Doe",
	  role: "admin",
	  position: "student",
	  unit: "CS DEPARTMENT",
	  username: "admin"
  });
  user = await user.save();
  console.log(user+"\n");
  let userId2 = await user._id; 

  await Event.deleteMany({
  });
  let event = new Event({
    _id : "0000007b179513121d220d42",
    name : 'third event',
    startTime: new Date(2018, 10, 1),
    endTime: new Date(2018, 10, 1),
    description:"It's third event",
    organizer:{
        _id:userId1
    },
    attendees:[{
      _id:userId1
    },
    {
      _id:userId2
    }],
    status:"approved"
  });
  event = await event.save();
  console.log(event+"\n"); 
  
  event = new Event({
    name : 'first event',
    startTime: new Date(2018, 10, 1),
    endTime: new Date(2018, 10, 1),
    description:"It's first event",
    organizer:{
        _id:userId1
    },
    attendees:[
      {
        _id:userId1
      },
      {
        _id:userId2
      }
    ],
    status:"approved"
  });
  event = await event.save();
  console.log(event+"\n");

  event = new Event({
    name : 'second event',
    startTime: new Date(2018, 10, 1),
    endTime: new Date(2018, 10, 1),
    description:"It's second event",
    organizer:{
      _id:userId2
    },
    attendees:[{
      _id:userId1
    }],
    status:"approved"
  });
  event = await event.save();
  console.log(event+"\n");

  await Program.collection.dropIndexes({});

  await Program.deleteMany({
  });

  let program = new Program({
     name:"First Program" 
  });
  program = await program.save()
  console.log(program+"\n");

  program = new Program({
    name:"Second Program"
  });
  program = await program.save()
  console.log(program+"\n");

  await mongoose.disconnect();
}

insertData();
