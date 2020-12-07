const mongoose = require('mongoose');
const Joi = require('joi');

const daycareSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    capacity: {
        type: Number,
        required: true
    },
    address: String,
    zipCode: Number,
    city: String,
    municipality: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Municipality'
    },
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

const Daycare = mongoose.model('Daycare', daycareSchema);

function validateDaycare(daycare) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        capacity: Joi.number().required(),
        address: Joi.string().min(5).max(255),
        zipCode: Joi.number(),
        city: Joi.string().min(3).max(100),
        municipality: Joi.string(),
        country: Joi.string().min(3).max(100).valid('Sweden', 'Denmark', 'Norway', 'Finland', 'UK', 'US'),
        created: Joi.date()
    });
    return schema.validate(daycare)
}

exports.daycareSchema = daycareSchema;
exports.Daycare = Daycare;
exports.validate = validateDaycare;
