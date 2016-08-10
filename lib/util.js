module.exports = function(app, express) {

    app.utils = {};
    app.utils.lang = function(value) {

    }

    app.utils.hashPasswordSync = function(password) {
        var salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    app.utils.hashPassword = function(password, callback) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return callback(err, null);
            } else {
                bcrypt.hash(password, salt, function(err, hash) {
                    if (err) {
                        return callback(err, null);
                    } else {
                        password = hash;
                        return callback(null, password);
                    }
                });
            }
        });
    }

    app.utils.getById = function(id, array) {
        return array.filter(function(obj) {
            if (obj.id == id) return obj;
        })[0];
    };
    app.utils.indexById = function(id, array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] && array[i]['id'] == id) {
                return i;
            }
        }
        return -1;
    };

    function deg2rad(deg) {
        rad = deg * Math.PI / 180; // radians = degrees * pi/180
        return rad;
    }

    function round(x) {
        return Math.round(x * 1000) / 1000;
    }

    app.auth = {};

    var LocalStrategy = require("passport-local").Strategy;
    var BearerStrategy = require('passport-http-bearer').Strategy;
    var bcrypt = require('bcrypt');

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
            /*
            if (user.status == 'unverified') {
                return res.json({
                    success: false,
                    status: user.status,
                    msg: "Tu mail aún no ha sido verificado. Favor de comprobar tu correo para realizar la activación de tu cuenta. "
                });
            }*/

            user.status = 'active';
            req.user = user;
            next();
        })(req, res, next);

    }
    var createToken = function() {
        return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    };

    app.auth.createToken = createToken;

    app.auth.tokenAuth = tokenAuth;
};
