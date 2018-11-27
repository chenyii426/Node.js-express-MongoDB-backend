var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var Program = require("../models/program");

router.get('/program', function(req, res, next) {
  Program.find(function (err, programs) {
    if (err) {
      return res.json({success: false, msg: 'Get Programs failed.'});
    };
    res.json(programs);
  });
});

router.get('/program/:id', function(req, res, next) {
  Program.findById(req.params.id, (err, program) => {
    if (err) {
      return res.json({success: false, msg: 'Get Program failed.'});
    };
    res.json(program);
  });
});

router.post('/program', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if(token) {
    if (checkAccess(token,"admin")) {
      var newProgram = new Program({
        name: req.body.name
      });
  
      newProgram.save(function(err) {
        if (err) {
          return res.json({success: false, msg: 'Create Program failed.'});
        }
        res.json({success: true, msg: 'Successful created new Program.'});
      });
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.patch('/program/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if(token) {
    if (checkAccess(token,"admin")) {
      console.log(req.param.id)
      Program.findByIdAndUpdate(req.params.id, {$set:{name:req.body.name}}, err => {
        if (err) {
          return res.json({success: false, msg: 'Edit Program failed.'});
        } 
        res.json({success: true, msg: 'Successful edited Program.'});
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