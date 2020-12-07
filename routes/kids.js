const {Kid, validate} = require('../models/kid');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const auth = require('./../middleware/auth');

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let kid = await Kid.findOne({ name: req.body.name });
    if (kid) return res.status(400).send('The kid already registered.');

    kid = new Kid(req.body);
    try {
        const result = await kid.save();
        console.log(result);
    }
    catch(ex) {
        console.log(ex.message);
        for (field in ex.errors)
            console.log(ex.errors[field]);
    }
    res.send(req.body);
});

router.get('/', auth, async(req, res) => {
    try {
        const kids = await Kid.find().populate('parentId1').sort('firstName');
        res.send(kids);
    }
    catch (ex) {
        console.log(ex.message);
        res.send(ex.message);
    }
});

router.get('/:id', auth, async (req, res) => {
    const kid = await Kid.findById(req.params.id);
    if (!kid) return res.status(404).send('The kid with the given ID was not found.');
    res.send(kid);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const parentId = await User.findById(req.body.id);
    if (!parentId) return res.status(400).send('Invalid parentId.');

    const kid = await Kid.findByIdAndUpdate(req.params.id,{
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            personalNumber: req.body.personalNumber,
            birthDate: req.body.birthDate,
            address: req.body.address,
            zipCode: req.body.zipCode,
            city: req.body.city,
            municipality: req.body.municipality,
            country: req.body.country,
            gender: req.body.gender,
            disability: req.body.disability,
            parentId1: {
                _id: User._id
            },
            parentId2: {
                _id: User._id
            },
            parentReplace1: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                mobileNumber: req.body.mobileNumber,
                email: req.body.email
            },
            parentReplace2: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                mobileNumber: req.body.mobileNumber,
                email: req.body.email
            },
            note: req.body.note
        }, { new: true });

    if (!kid) return res.status(404).send('The kid with the given ID was not found.');

    res.send(kid);
});

router.delete('/:id', auth, async (req, res) => {
    const kid = await Kid.findByIdAndRemove(req.params.id);
    if (!kid) return res.status(404).send('The kid with the given ID was not found.');
    res.send(kid);
});

module.exports = router;
