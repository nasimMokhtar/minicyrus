const {Daycare, validate} = require('../models/daycare');
const {Municipality} = require('../models/municipality');
const express = require('express');
const router = express.Router();
const auth = require('./../middleware/auth');

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let daycare = await Daycare.findOne({ name: req.body.name });
    if (daycare) return res.status(400).send('The daycare already registered.');

    daycare = new Daycare(req.body);
    try {
        const result = await daycare.save();
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
        const daycares = await Daycare.find().populate('municipality').sort('name');
        res.send(daycares);
    }
    catch (ex) {
        console.log(ex.message);
        res.send(ex.message);
    }
});

router.get('/:id', async (req, res) => {
    const daycare = await Daycare.findById(req.params.id);
    if (!daycare) return res.status(404).send('The daycare with the given ID was not found.');
    res.send(daycare);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const municipality = await Municipality.findById(req.body.id);
    if (!municipality) return res.status(400).send('Invalid daycare.');

    const daycare = await Daycare.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            capacity: req.body.capacity,
            address: req.body.address,
            zipCode: req.body.zipCode,
            city: req.body.city,
            municipality: {
                _id: municipality._id,
                name: municipality.name
            },
            country: req.body.country
        }, { new: true });

    if (!daycare) return res.status(404).send('The daycare with the given ID was not found.');

    res.send(daycare);
});

router.delete('/:id', auth, async (req, res) => {
    const daycare = await Daycare.findByIdAndRemove(req.params.id);
    if (!daycare) return res.status(404).send('The daycare with the given ID was not found.');
    res.send(daycare);
});

module.exports = router;
