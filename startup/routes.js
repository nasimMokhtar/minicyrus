const express = require('express');
const cors = require('cors');
const auth = require('./../routes/auth');
const users = require('./../routes/users');
const municipalities = require('./../routes/municipalities');
const daycares = require('./../routes/daycares');
const kids = require('./../routes/kids');
const error = require('./../middleware/error');

module.exports = function(app) {

    const corsOptions = {
        origin: 'http://localhost:63342/',
        optionsSuccessStatus: 200, // For legacy browser support
        methods: "GET, POST"
    }

    app.use(express.json());
    app.use(cors());
    app.use('/api/auth', auth);
    app.use('/api/users', users);
    app.use('/api/municipalities', municipalities);
    app.use('/api/daycares', daycares);
    app.use('/api/kids', kids);
    app.use(error);
}
