const {User, validate} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const auth = require('./../middleware/auth');

router.post('/', async (req, res) => {
    console.log(req.body);
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = new User(req.body);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    try {
        const result = await user.save();
        console.log("result");
        console.log(result);
        req.body.id = result._id;
    }
    catch(ex) {
        console.log(ex.message);
        for (field in ex.errors)
            console.log(ex.errors[field]);
    }
    res.header('x-auth-token', user.generateAuthToken()).send(req.body);
});

router.get('/', auth, async(req, res) => {
    let users = await User.find().select("-password").sort('firstName');
    res.send(users);
});

router.get('/:id', auth, async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('The user with the given ID was not found.');
    res.send(user);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const user = await User.findByIdAndUpdate(req.params.id,
        _.pick(req.body,['firstName','lastName','email','password','personalNumber','birthDate','mobileNumber','address','zipCode','city','municipality','country','role','language']),
        { new: true });
    if (!user) return res.status(404).send('The user with the given ID was not found.');

    res.send(user);
});

router.delete('/:id', auth, async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).send('The user with the given ID was not found.');
    res.send(user);
});

module.exports = router;
