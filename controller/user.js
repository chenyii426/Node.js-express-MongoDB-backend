var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");


/* GET users listing. */
router.get('/users', function(req, res, next) {
  var token = getToken(req.headers);
  if(token) {
    if (checkAccess(token,"admin")) {
      User.find(function (err, users) {
        if (err) {
          return res.json({success: false, msg: 'Get all users failed.'});
        };
        res.json(users);
      });
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.delete('/user/:id', function(req, res, next) {
  var token = getToken(req.headers);
  if(token) {
    if (checkAccess(token,"admin")) {
      console.log(req.param.id)
      User.findByIdAndDelete(req.params.id, {$set:{name:req.body.name}}, err => {
        if (err) {
          return res.json({success: false, msg: 'Delete Program failed.'});
        } 
        res.json({success: true, msg: 'Successfully deleted Program.'});
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
