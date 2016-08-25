var express = require('express');
var lang = require("i18n");
var http = require("http");
var https = require("https");
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var session = require('express-session');
var multer = require('multer');

app.crypto = require('crypto');


app.expire = {
    high: 1000,
    medium: 500,
    low: 50
};

app.methodOverride = require('method-override')
app.ejs = require('ejs');
app.bcrypt = require('bcrypt');
app.lang = lang;
app.session = session;
app.cookieParser = require('cookie-parser');
app.http = http;
app.bodyParser = bodyParser;
app.https = https;
app.mongoose = mongoose;
app.path = require('path');
app.cors = require('cors');
app.os = require('os');
app.fs = require('fs');
app.passport = require("passport");

require('./lib/util')(app, express);
require('./config')(app, express);


var authenticate = require('./authentication')(app);
app.use('/authenticate', authenticate);

var apiRoute = require('./api/api')(app, express);
app.use('/api', apiRoute);

var viewRoute = require('./www/view')(app, express);
app.use('/', viewRoute);



app.server = http.createServer(app);

//console.log(process.env);
if (!process.env.PORT) {
    process.env.PORT = 3010;
}

app.port = process.env.PORT;
app.server.listen(process.env.PORT)
    //http.createServer(app).listen(port);
