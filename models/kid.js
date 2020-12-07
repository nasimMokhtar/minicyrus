const mongoose = require('mongoose');
const Joi = require('joi');

const kidSchema = new mongoose.Schema({
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
    personalNumber: String,
    birthDate: {type: Date, required: true},
    address: String,
    zipCode: Number,
    city: String,
    municipality: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Municipality'
    },
    classRoom:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClassRoom'
    },
    country: {
        type: String,
        required: true,
        enum: ['Sweden', 'Denmark', 'Norway', 'Finland', 'UK', 'US']
    },
    gender:{
        type: String,
        enum: ['girl','boy']
    },
    disability:{
        type: Boolean,
        default: false
    },
    parentId1: {
        type: String,
        required: true
    },
    parentId2: String,
    parentReplace1: {
        firstName: String,
        lastName: String,
        mobileNumber: String,
        email: String
    },
    parentReplace2: {
        firstName: String,
        lastName: String,
        mobileNumber: String,
        email: String
    },
    note: String
});

const Kid = mongoose.model('Kid', kidSchema);

function validateKid(kid) {
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(50).required(),
        lastName: Joi.string().min(3).max(50).required(),
        personalNumber: Joi.string(),
        birthDate: Joi.date(),
        address: Joi.string().min(5).max(255),
        zipCode: Joi.number(),
        city: Joi.string().min(3).max(100),
        municipality: Joi.string(),
        country: Joi.string().min(3).max(100).valid('Sweden', 'Denmark', 'Norway', 'Finland', 'UK', 'US'),
        gender: Joi.string().valid('girl', 'boy'),
        disability: Joi.boolean(),
        parentId1: Joi.string().required(),
        parentId2: Joi.string(),
        parentReplace1: {
            firstName: Joi.string().min(3).max(50).required(),
            lastName: Joi.string().min(3).max(50).required(),
            mobileNumber: Joi.string().min(8).max(20),
            email: Joi.string().min(5).max(255).email(),
        },
        parentReplace2: {
            firstName: Joi.string().min(3).max(50).required(),
            lastName: Joi.string().min(3).max(50).required(),
            mobileNumber: Joi.string().min(8).max(20),
            email: Joi.string().min(5).max(255).email(),
        },
        note:Joi.string()
    });
    return schema.validate(kid)
}

exports.kidSchema = kidSchema;
exports.Kid = Kid;
exports.validate = validateKid;
