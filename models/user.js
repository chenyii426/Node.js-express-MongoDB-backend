var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
    firstname: {
        type: String,
        require:true
    },
    lastname: {
        type: String,
        required:true
    },
    position: {
        type: String,
        enum: ['faculty', 'staff', 'student'],
        default: 'student',
        required: true
    },
    username: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    title: {
        type: String,
        required:false
    },
    unit: {
        type: String,
        required:true
    },
    role:{
        type: String,
        required: true,
        enum: ['admin', 'student', 'recruiter'],
        default: 'student'
    },
    events:[{
        type: Schema.Types.ObjectId,
        ref:'Event',
        required: false
    }],
    programs:[{
        type: Schema.Types.ObjectId,
        ref:'Program',
        required: false
    }]
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);