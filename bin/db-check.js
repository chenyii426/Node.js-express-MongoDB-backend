const mongoose = require('mongoose');
const User = require('../models/user');
const Event = require('../models/event');
const Program = require('../models/program');

async function queries() {
    await mongoose.connect('mongodb://localhost/Sci-CAFE');
    
    // Find all events 
    events = await Event.find();
    events.forEach(event => console.log(event));
    console.log("\n");
  
    // Find all users
    users = await User.find();
    users.forEach(user => console.log(user));
    console.log("\n");

    // Find all users
    programs = await Program.find();
    programs.forEach(program => console.log(program));
    console.log("\n");
  
    await mongoose.disconnect();
}

queries() 