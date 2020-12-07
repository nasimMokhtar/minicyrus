const {Kid, validate} = require('../models/kid');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const auth = require('./../middleware/auth');

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let municipality = await User.findOne({ name: req.body.name });
    if (municipality) return res.status(400).send('The municipality already registered.');

    municipality = new Kid(req.body);
    try {
        const result = await municipality.save();
        console.log(result);
    }
    catch(ex) {
        console.log(ex.message);
        for (field in ex.errors)
            console.log(ex.errors[field]);
    }
    res.send(req.body);
});

router.get('/', async(req, res) => {
    try {
        const municipalities = await Municipality.find().sort('name');
        res.send(municipalities);
    }
    catch (ex) {
        console.log(ex.message);
        res.send(ex.message);
    }
});

router.get('/:id', async (req, res) => {
    const municipality = await Municipality.findById(req.params.id);
    if (!municipality) return res.status(404).send('The municipality with the given ID was not found.');
    res.send(municipality);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const municipality = await Municipality.findByIdAndUpdate(req.params.id,
        _.pick(req.body, ['name','address','zipCode','city','country']),
        { new: true });

    if (!municipality) return res.status(404).send('The municipality with the given ID was not found.');

    res.send(municipality);
});

router.delete('/:id', auth, async (req, res) => {
    const municipality = await Municipality.findByIdAndRemove(req.params.id);
    if (!municipality) return res.status(404).send('The municipality with the given ID was not found.');
    res.send(municipality);
});

module.exports = router;
