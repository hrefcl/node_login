module.exports = function(app) {
    'use strict';
    var express = require('express');
    var authenticate = express.Router();

    app.attributesUser = ['id', 'status', 'dni', 'firstname', 'lastname', 'email', 'birthday', 'gender', 'token', 'hits', 'unit_system', 'credits', 'pushToken', 'userId', 'lang', 'currency', 'average_rate', 'facebook_id', 'role', 'profile_pic', 'setup', 'preferences', 'personal_information', 'device_information', 'transport_information', 'createdAt', 'updatedAt', 'geoposition', 'id_country', 'id_address'];

    var LocalStrategy = require("passport-local").Strategy;
    var BearerStrategy = require('passport-http-bearer').Strategy;
    var bcrypt = require('bcrypt');
    app.auth = {};

    var createToken = function() {
        return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    };

    app.auth.createToken = createToken;

    app.passport.use(new BearerStrategy({},
        function(token, done) {
            process.nextTick(function() {
                if (!token) return done(null, false);
                app.db.user.findOne({ 'token': token }).exec(function(err, user) {
                    if (err) {
                        return done(null, false);
                    }
                    if (user) {
                        return done(null, user);
                    }
                });
            });
        }
    ));

    // Local Auth (For user/pass auth)
    app.passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(username, password, done) {
            app.db.user.findOne({ 'email': username }).exec(function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: username + " no existe"
                    })
                } else {
                    if (user.password === password || bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false, {
                            message: "Password incorrecto"
                        });
                    }
                }
            })
        }
    ));

    app.passport.serializeUser(function(user, done) {
        return done(null, user);
    });

    app.passport.deserializeUser(function(user, done) {
        return done(null, user);
    });

    var tokenAuth = function(req, res, next) {
        if (!req.query.access_token || req.query.access_token == "null") {
            return res.json({
                success: false,
                msg: "Missing auth token"
            });
        }
        app.passport.authenticate('bearer', {
            session: false
        }, function(err, user, info) {
            if (err) {
                return res.json({
                    success: false,
                    msg: "Invalid auth token",
                    err: err
                });
            }

            if (!user) {
                return res.json({
                    success: false,
                    msg: "User not found"
                });
            }
            if (user.status == 'locked') {
                return res.json({
                    success: false,
                    status: user.status,
                    msg: "Tu cuenta se encuentra bloqueada, para más información comunícate con nosotros a contacto@haawi.cl"
                });
            }
            if (user.status == 'delete') {
                return res.json({
                    success: false,
                    status: user.status,
                    msg: "Te informamos que tu cuenta ha sido eliminada. Puedes volver a activarla ingresando tus datos nuevamente en la aplicación."
                });
            }
            if (user.status == 'suspended') {
                return res.json({
                    success: false,
                    status: user.status,
                    msg: "Lamentablemente tu cuenta ha sido suspendida. Posiblemente has infringido algunas de las normas y reglar de Haawi. Para conocer tu estado, comunícate con nosotros a: contacto@haawi.cl"
                });
            }

            user.status = 'active';
            req.user = user;
            next();
        })(req, res, next);

    }

    var passThroughAuth = function(req, res, next) {
        if (!req.query.access_token) return next();

        app.passport.authenticate('bearer', {
            session: false
        }, function(err, user, info) {
            if (err) {
                return next();
            }
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })(req, res, next);
    };
    var invitation_code = function(invitation_code) {
        console.log(invitation_code);
        return 0;
    };
    app.auth.invitation_code = invitation_code;

    authenticate.get('/checkToken', tokenAuth, function(req, res) {
        if (!req.user) {
            return res.json({
                success: false,
                msg: "User session not found"
            });
        }
        res.json(req.user);
    });



    authenticate.post('/login', function(req, res, next) {
        req.body.email = req.body.email.toLowerCase();
        app.passport.authenticate('local', function(err, user, info) {
            console.log(user)
            if (err) {
                return res.json({
                    success: false,
                    user: null,
                    msg: "Server error. Please try again.",
                    err: JSON.stringify(err)
                });
            } else if (!user) {
                return res.json({
                    success: false,
                    user: user,
                    msg: info.message
                });
            } else {
                req.logIn(user, function(err) {
                    if (err) {
                        return res.json({
                            success: false,
                            user: null,
                            msg: err
                        });
                    } else {

                        return res.json({
                            success: true,
                            user: user,
                            token: req.user.token
                        });
                    }
                });
            }
        })(req, res, next);
    });


    authenticate.post('/linkdinlogin', function(req, res, next) {
        req.body.id_linkedin = req.body.id;
        app.db.user.findOne({ 'id_linkedin': req.body.id }).exec(function(err, user) {
            if (err) {
                return res.json({
                    success: false,
                    user: err
                });
            }
            if (user) {
                return res.json({
                    success: true,
                    user: user
                });
            } else {
                req.body.token = app.auth.createToken();
                app.db.user.create(req.body, function(err, user) {
                    if (err) {
                        res.send(err);
                    }
                    return res.json({
                        success: true,
                        user: user
                    });
                });
            }
        });
    });




    authenticate.post('/signup', function(req, res) {
        console.log(req.body);
        if (!req.body.email || typeof req.body.email != "string" || req.body.email == "") {
            return res.json({
                success: false,
                msg: "Email vacio"
            });
        };
        if (!req.body.password) {
            return res.json({
                success: false,
                msg: "password vacio"
            });
        };


        req.body.email = req.body.email.toLowerCase();

        app.db.user.findOne({ 'email': req.body.email }).exec(function(err, user) {
            if (err) {
                return res.json({
                    success: false,
                    user: err
                });
            }
            if (user) {
                return res.json({
                    success: false,
                    msg: "Email '" + req.body.email + "' ya existe!"
                });
            } else {
                app.utils.hashPassword(req.body.password, function(err, pass) {
                    if (err) {
                        return res.json({
                            success: false,
                            user: err
                        });
                    }
                    app.db.user.create({
                            firstName: req.body.firstName,
                            id_linkedin: req.body.id_linkedin,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            password: pass,
                            pictureUrl: null,
                            about: req.body.about,
                            publicProfileUrl: null,
                            address: req.body.address,
                            company: req.body.company,
                            token : app.auth.createToken()
                        },
                        function(err, user) {
                            if (err) {
                                return res.json({
                                    success: false,
                                    user: err
                                });
                            }
                            return res.json({
                                success: true,
                                user: user
                            });
                        });
                });
            }
        });
    });



    app.auth.tokenAuth = tokenAuth;
    app.auth.passThroughAuth = passThroughAuth;
    return authenticate;
};
