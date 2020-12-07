const mongoose = require('mongoose');
const Joi = require('joi');

const municipalitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    address: String,
    zipCode: Number,
    city: String,
    country: {
        type: String,
        required: true,
        enum: ['Sweden', 'Denmark', 'Norway', 'Finland', 'UK', 'US']
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

const Municipality = mongoose.model('Municipality', municipalitySchema);

function validateMunicipality(municipality) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        address: Joi.string().min(5).max(255),
        zipCode: Joi.number(),
        city: Joi.string().min(3).max(100),
        country: Joi.string().min(3).max(100).valid('Sweden', 'Denmark', 'Norway', 'Finland', 'UK', 'US'),
        created: Joi.date()
    });
    return schema.validate(municipality)
}

exports.Municipality = Municipality;
exports.validate = validateMunicipality;
