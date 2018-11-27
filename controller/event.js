var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var Event = require("../models/event");


router.get('/event/:id/attendees', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if(token) {
    if (checkAccess(token,"admin")) {
      Event.findById(req.params.id, (err, event) => {
        if (err) {
          return res.json({success: false, msg: 'Approve Event failed.'});
        } 
        console.log(event)
        //res.json({success: true, msg: 'Successful approve an event.'});
        res.json(event.attendees)
      }).populate("attendees");
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.post('/event', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if(token) {
    if (!req.body.name || !req.body.description 
      || !req.body.startTime || !req.body.endTime) {
        res.json({success: false, msg: 'Failure due to missing required field(s)'});
    } else{
      var newEvent = new Event({
        name: req.body.name,
        description: req.body.description,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        status: req.body.status,
        organizer: req.body.organizer,
        tags: req.body.tag,
        attendees: req.body.attendees
      });
      newEvent.save(function(err) {
          if (err) {
            return res.json({success: false, msg: 'Create Event failed.'});
          }
          res.json({success: true, msg: 'Successful created a new Event.'});
      });
    }
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.patch('/event/:id/approve', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if(token) {
    if (checkAccess(token,"admin")) {
      Event.findByIdAndUpdate(req.params.id, {$set:{status:"approved"}}, err => {
        if (err) {
          return res.json({success: false, msg: 'Approve Event failed.'});
        } 
        res.json({success: true, msg: 'Successful approve an event.'});
      });
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.patch('/event/:id/reject', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if(token) {
      if (checkAccess(token,"admin")) {
        Event.findByIdAndUpdate(req.params.id, {$set:{status:"rejected"}}, err => {
          if (err) {
            return res.json({success: false, msg: 'Reject Event failed.'});
          } 
          res.json({success: true, msg: 'Successful reject an event.'});
        });
      } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
      }
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });

  router.patch('/event/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if(token) {
      if (checkAccess(token,"admin")) {
        Event.update({_id:req.params.id},{ '$addToSet': {'attendees':  [req.body.attendees] } },err => {
            if (err) {
              return res.json({success: false, msg: 'Add attendee to Event failed.'});
            } 
            res.json({success: true, msg: 'Successful add an attendee to event.'});
          });
      } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
      }
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

function checkAccess (jsonwebtoken,role){
  decoded = jwt.decode(jsonwebtoken)
  if(decoded['role']==role)
    return true
}

module.exports = router;