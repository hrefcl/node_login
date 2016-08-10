var express = require('express');
module.exports = function(app) {
    'use strict';
    var viewsRoute = express.Router();

    viewsRoute.get('/', function(req, res) {
        //res.render('index');
        res.render('index')
    });

    viewsRoute.get('/account', function(req, res) {
        res.redirect('/#/account');
    });

    viewsRoute.get('/login', function(req, res) {
        res.redirect('/#/login');
    });


    viewsRoute.get('/recover', function(req, res) {
        res.redirect('/#/recover');
    });

    viewsRoute.get('/register', function(req, res) {
        res.redirect('/#/register');
    });


    return viewsRoute;
}
