var express = require('express');
module.exports = function(app) {
    'use strict';


    var api = express.Router();

    var tokenAuth = app.auth.tokenAuth;

    api.get('/', function(req, res) {
        res.json({ 'key': 'value' });
    });


    api.post('/updateUser', tokenAuth, function(req, res) {
        //console.log(req.body);
        app.db.user.findOneAndUpdate({ token: req.body.token }, req.body, function(err) {
            if (err) {
                return res.json({
                    success: false,
                    user: err
                });
            } else {
                return res.json({
                    success: true,
                    user: req.user
                });
            }
        });
    });


    return api;
};
