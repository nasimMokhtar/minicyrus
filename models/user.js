const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

// TODO Email must be verified
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    personalNumber: String,
    birthDate: {type: Date, required: true},
    mobileNumber: {
        type: String,
        required: true
    },
    address: String,
    zipCode: Number,
    city: String,
    municipality: String,
    country: {
        type: String,
        required: true,
        enum: ['Sweden', 'Denmark', 'Norway', 'Finland', 'UK', 'US']
    },
    role: {
        type: String,
        enum: ['admin', 'insurance', 'municipality', 'manager', 'teacher', 'parent', 'parentReplace', 'police']
    },
    language: {
        type: String,
        enum: ['english', 'swedish', 'persian', 'arabic']
    },
    created: {
        type: Date,
        default: Date.now()
    }
});
userSchema.methods.generateAuthToken= function () {
    return jwt.sign({ _id: this._id, role: this.role }, config.get('jwtPrivateKey'));
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(50).required(),
        lastName: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        personalNumber: Joi.string().min(11).max(13),
        birthDate: Joi.date().required(),
        mobileNumber: Joi.string().min(8).max(20),
        address: Joi.string().min(5).max(255),
        zipCode: Joi.number(),
        city: Joi.string().min(3).max(100),
        municipality: Joi.string().min(3).max(100),
        country: Joi.string().min(3).max(100).required().valid('Sweden', 'Denmark', 'Norway', 'Finland', 'UK', 'US'),
        role: Joi.string().min(3).max(20).valid('admin', 'insurance', 'municipality', 'manager', 'teacher', 'parent', 'parentReplace', 'police'),
        language: Joi.string().min(3).max(50).valid('english', 'swedish', 'persian', 'arabic'),
        created: Joi.date()
    });
    return schema.validate(user)
}

exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;
